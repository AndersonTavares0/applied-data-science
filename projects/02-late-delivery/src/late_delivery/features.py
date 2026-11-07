"""Feature contract, split and evaluation for the late-delivery model.

The model answers one question: *given only what is known when the order is
placed, how likely is this order to miss its promised delivery date?* The
feature allow-list below is the safety mechanism for that claim. Anything
observed after checkout is forbidden, even when it looks predictive — arrival
time predicts lateness perfectly, and using it would turn a forecast into a
post-mortem.
"""

from __future__ import annotations

from collections.abc import Iterable

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score,
    brier_score_loss,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET = "is_late"
SPLIT_CUTOFF = "2018-04-01"

# Columns that exist in the mart but must never reach a model. Each one is
# recorded after the order is placed, so including it would leak the future.
FORBIDDEN_FEATURES = (
    "approved_at",
    "handed_to_carrier_at",
    "delivered_to_customer_at",
    "estimated_delivery_at",
    "delivery_days",
    "days_late",
    "is_late",
    "review_score",
)

# Explicit allow-list, not "everything except FORBIDDEN_FEATURES": a new column
# added to the mart then fails closed instead of silently joining the model.
FEATURES = (
    "purchase_month",
    "purchase_dow",
    "purchase_hour",
    "purchase_weekend",
    "promise_days",
    "customer_state",
    "seller_state",
    "same_state",
    "category",
    "item_count",
    "product_count",
    "seller_count",
    "items_value",
    "freight_value",
    "order_value",
    "freight_share",
    "avg_weight_grams",
    "avg_volume_cm3",
    "avg_photos_qty",
    "items_missing_dimensions",
    "payment_count",
    "max_installments",
    "paid_by_credit_card",
    "paid_by_boleto",
    "paid_by_voucher",
)

CATEGORICAL_FEATURES = ("customer_state", "seller_state", "category")
NUMERIC_FEATURES = tuple(name for name in FEATURES if name not in CATEGORICAL_FEATURES)


def temporal_split(
    frame: pd.DataFrame, cutoff: str = SPLIT_CUTOFF
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Split by purchase date, keeping only orders with an observed outcome.

    A random split would put the same period on both sides and let the model
    learn the delivery backlog of a given month rather than a general pattern.
    The temporal split is the honest approximation of using the model forward.
    """
    delivered = frame.loc[frame[TARGET].notna()].copy()
    purchased_at = pd.to_datetime(delivered["purchased_at"])
    is_train = purchased_at < pd.Timestamp(cutoff)
    return delivered.loc[is_train].copy(), delivered.loc[~is_train].copy()


def prepare_features(frame: pd.DataFrame) -> pd.DataFrame:
    """Return the model matrix with nullable booleans as 0/1 floats."""
    matrix = frame.loc[:, FEATURES].copy()
    for name in NUMERIC_FEATURES:
        matrix[name] = pd.to_numeric(matrix[name], errors="coerce")
    for name in CATEGORICAL_FEATURES:
        # sklearn's imputer cannot test `pd.NA` for missingness, so use object
        # dtype with `np.nan` rather than pandas' nullable string dtype.
        values = matrix[name].astype(object)
        matrix[name] = values.where(matrix[name].notna(), np.nan)
    return matrix


def _preprocessor(*, scale: bool) -> ColumnTransformer:
    numeric_steps: list[tuple[str, object]] = [("impute", SimpleImputer(strategy="median"))]
    if scale:
        numeric_steps.append(("scale", StandardScaler()))
    return ColumnTransformer(
        [
            ("numeric", Pipeline(numeric_steps), list(NUMERIC_FEATURES)),
            (
                "categorical",
                Pipeline(
                    [
                        ("impute", SimpleImputer(strategy="constant", fill_value="unknown")),
                        ("encode", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
                    ]
                ),
                list(CATEGORICAL_FEATURES),
            ),
        ]
    )


def build_model(kind: str = "logistic") -> Pipeline:
    """Build an untuned estimator.

    No hyperparameter search: with a single temporal holdout, tuning on it would
    turn the reported score into a selection artefact. The two defaults are
    enough to show whether the signal exists.
    """
    if kind == "logistic":
        classifier = LogisticRegression(max_iter=2_000)
        return Pipeline([("prepare", _preprocessor(scale=True)), ("model", classifier)])
    if kind == "boosting":
        classifier = HistGradientBoostingClassifier(random_state=0)
        return Pipeline([("prepare", _preprocessor(scale=False)), ("model", classifier)])
    raise ValueError(f"unknown model kind: {kind!r}")


def prevalence_baseline(train: pd.DataFrame) -> float:
    """The late rate a constant prediction would achieve."""
    return float(train[TARGET].mean())


def state_rate_baseline(train: pd.DataFrame, test: pd.DataFrame) -> np.ndarray:
    """Smoothed historical late rate per customer state, learned on train only.

    The smoothing prior (100 pseudo-orders at the training prevalence) stops a
    state with three orders from producing a 0% or 100% estimate.
    """
    prior = prevalence_baseline(train)
    prior_weight = 100.0
    grouped = train.groupby("customer_state")[TARGET].agg(["sum", "count"])
    rates = (grouped["sum"] + prior_weight * prior) / (grouped["count"] + prior_weight)
    return test["customer_state"].map(rates).fillna(prior).to_numpy(dtype=float)


def capacity_metrics(
    y_true: Iterable[int], scores: Iterable[float], capacity: float = 0.10
) -> dict:
    """Precision, recall and lift when only the top `capacity` share is acted on.

    A ranking model is used to focus a limited intervention budget, so the
    operationally meaningful number is not accuracy at 0.5 but how many late
    orders the top slice contains.
    """
    truth = np.asarray(list(y_true), dtype=int)
    score = np.asarray(list(scores), dtype=float)
    n = len(truth)
    if n == 0:
        raise ValueError("capacity_metrics needs at least one row")

    k = max(1, int(round(n * capacity)))
    order = np.argsort(-score, kind="stable")
    selected = truth[order[:k]]
    late_total = int(truth.sum())
    prevalence = late_total / n
    hits = int(selected.sum())
    precision = hits / k
    recall = hits / late_total if late_total else 0.0
    lift = precision / prevalence if prevalence else 0.0
    return {
        "capacity": k / n,
        "n_selected": k,
        "precision": precision,
        "recall": recall,
        "lift": lift,
        "prevalence": prevalence,
    }


def evaluate(y_true: Iterable[int], scores: Iterable[float]) -> dict:
    """Discrimination, calibration and capacity metrics for one score vector."""
    truth = np.asarray(list(y_true), dtype=int)
    score = np.asarray(list(scores), dtype=float)
    return {
        "n": int(len(truth)),
        "late_rate": float(truth.mean()),
        "roc_auc": float(roc_auc_score(truth, score)),
        "average_precision": float(average_precision_score(truth, score)),
        "brier": float(brier_score_loss(truth, score)),
        "mean_prediction": float(score.mean()),
        "top_decile": capacity_metrics(truth, score, capacity=0.10),
    }


def calibration_table(y_true: Iterable[int], scores: Iterable[float], bins: int = 10) -> list[dict]:
    """Observed rate per predicted-probability decile, for the reliability plot."""
    frame = pd.DataFrame({"y": list(y_true), "score": list(scores)})
    frame["bucket"] = pd.qcut(frame["score"], bins, labels=False, duplicates="drop")
    grouped = frame.groupby("bucket").agg(
        predicted=("score", "mean"), observed=("y", "mean"), n=("y", "size")
    )
    return [
        {"predicted": float(row.predicted), "observed": float(row.observed), "n": int(row.n)}
        for row in grouped.itertuples()
    ]


def permutation_importance_by_raw_feature(
    model: Pipeline,
    matrix: pd.DataFrame,
    y_true: Iterable[int],
    *,
    repeats: int = 3,
    seed: int = 0,
) -> pd.DataFrame:
    """Shuffle one raw feature at a time; report the drop in average precision.

    Shuffling at the raw-feature level keeps a categorical variable as one
    concept, instead of the dozens of one-hot columns it becomes inside the
    pipeline.
    """
    truth = np.asarray(list(y_true), dtype=int)
    baseline = average_precision_score(truth, model.predict_proba(matrix)[:, 1])
    generator = np.random.default_rng(seed)
    rows = []
    for name in FEATURES:
        drops = []
        for _ in range(repeats):
            shuffled = matrix.copy()
            shuffled[name] = generator.permutation(shuffled[name].to_numpy())
            score = average_precision_score(truth, model.predict_proba(shuffled)[:, 1])
            drops.append(baseline - score)
        rows.append({"feature": name, "importance": float(np.mean(drops))})
    return pd.DataFrame(rows).sort_values("importance", ascending=False, ignore_index=True)
