"""Feature contract, split and evaluation for the late-delivery model.

The model answers one question: *given only what is known when the order is
placed, how likely is this order to miss its promised delivery date?* The
feature allow-list below is the safety mechanism for that claim. Anything
observed after checkout is forbidden, even when it looks predictive — arrival
time predicts lateness perfectly, and using it would turn a forecast into a
post-mortem.
"""

from __future__ import annotations

from collections.abc import Iterable, Sequence

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
# A label is only usable for training once the parcel has had time to arrive.
# Training purchases therefore stop three months before the test cutoff; using
# purchases up to the cutoff and keeping only already-delivered orders selects
# on delivery speed and removes exactly the late orders the model is meant to
# predict.
LABEL_MATURITY_MONTHS = 3
# The final test period starts in April 2018. The preceding three months are a
# retrospective descriptive validation slice; model selection uses rolling
# origins, so the test set is touched once.
VALIDATION_CUTOFF = "2018-01-01"

# Columns that exist in the mart but must never reach a model. Each one is
# recorded after the order is placed, so including it would leak the future.
# `delivered_to_customer_at` is metadata used only to decide whether a label
# was observable at the training cutoff.
FORBIDDEN_FEATURES = (
    "approved_at",
    "handed_to_carrier_at",
    "delivered_to_customer_at",
    "estimated_delivery_at",
    "delivery_days",
    "days_late",
    "is_late",
    "order_status",
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
    frame: pd.DataFrame,
    cutoff: str = SPLIT_CUTOFF,
    *,
    maturity_months: int = LABEL_MATURITY_MONTHS,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Split by purchase date, keeping only labels observable at the cutoff.

    A random split would put the same period on both sides and let the model
    learn the delivery backlog of a given month rather than a general pattern.
    The temporal split is the honest approximation of using the model forward.

    Training stops ``maturity_months`` before the cutoff and also requires
    delivery before the cutoff. The gap is deliberate: if purchases run right up
    to the cutoff and only already-delivered orders are kept, the slowest orders
    are removed from training. In this dataset that would drop 3,852 orders with
    a 39% late rate, leaving a training set that looks much easier than the
    population it is meant to predict.
    """
    delivered = frame.loc[frame[TARGET].notna()].copy()
    purchased_at = pd.to_datetime(delivered["purchased_at"])
    delivered_at = pd.to_datetime(delivered["delivered_to_customer_at"])
    cutoff_at = pd.Timestamp(cutoff)
    train_end = cutoff_at - pd.DateOffset(months=maturity_months)

    is_train = (purchased_at < train_end) & (delivered_at < cutoff_at)
    is_test = purchased_at >= cutoff_at
    return delivered.loc[is_train].copy(), delivered.loc[is_test].copy()


def validation_slice(
    frame: pd.DataFrame,
    cutoff: str = SPLIT_CUTOFF,
    *,
    maturity_months: int = LABEL_MATURITY_MONTHS,
) -> pd.DataFrame:
    """The gap between mature training and test, kept for description only.

    This slice uses eventual labels, not labels observable at the test cutoff.
    It describes what happened in the three months before the holdout; it is
    not used to fit the selected model or to choose between models.
    """
    purchased_at = pd.to_datetime(frame["purchased_at"])
    cutoff_at = pd.Timestamp(cutoff)
    start = cutoff_at - pd.DateOffset(months=maturity_months)
    selected = (purchased_at >= start) & (purchased_at < cutoff_at) & frame[TARGET].notna()
    return frame.loc[selected].copy()


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

    No hyperparameter search: with one temporal holdout, tuning on it would
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


def capacity_table(
    y_true: Iterable[int],
    scores: Iterable[float],
    capacities: Sequence[float] = (0.05, 0.10, 0.20),
) -> list[dict]:
    """Capacity trade-off for the intervention budgets a team might use."""
    return [capacity_metrics(y_true, scores, capacity=value) for value in capacities]


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


def bootstrap_metrics(
    y_true: Iterable[int],
    scores: Iterable[float],
    *,
    capacity: float = 0.10,
    n_resamples: int = 1_000,
    seed: int = 0,
) -> dict:
    """Bootstrap percentile intervals for ranking and capacity metrics.

    The holdout is one sample from one period. These intervals show how much
    the headline numbers would move under resampling; they do not remove the
    regime-shift or single-holdout limitations.
    """
    truth = np.asarray(list(y_true), dtype=int)
    score = np.asarray(list(scores), dtype=float)
    point = evaluate(truth, score)
    values: dict[str, list[float]] = {
        "roc_auc": [],
        "average_precision": [],
        "brier": [],
        "top_precision": [],
        "top_recall": [],
        "top_lift": [],
    }
    generator = np.random.default_rng(seed)
    kept = 0
    for _ in range(n_resamples):
        index = generator.integers(0, len(truth), len(truth))
        sample_y = truth[index]
        if sample_y.min() == sample_y.max():
            continue
        sample = evaluate(sample_y, score[index])
        values["roc_auc"].append(sample["roc_auc"])
        values["average_precision"].append(sample["average_precision"])
        values["brier"].append(sample["brier"])
        values["top_precision"].append(sample["top_decile"]["precision"])
        values["top_recall"].append(sample["top_decile"]["recall"])
        values["top_lift"].append(sample["top_decile"]["lift"])
        kept += 1

    points = {
        "roc_auc": point["roc_auc"],
        "average_precision": point["average_precision"],
        "brier": point["brier"],
        "top_precision": point["top_decile"]["precision"],
        "top_recall": point["top_decile"]["recall"],
        "top_lift": point["top_decile"]["lift"],
    }
    return {
        "n_resamples": kept,
        "seed": seed,
        **{
            name: {
                "point": points[name],
                "ci_low": float(np.percentile(draws, 2.5)),
                "ci_high": float(np.percentile(draws, 97.5)),
            }
            for name, draws in values.items()
        },
    }


def paired_bootstrap_difference(
    y_true: Iterable[int],
    scores_a: Iterable[float],
    scores_b: Iterable[float],
    *,
    metric: str = "average_precision",
    n_resamples: int = 1_000,
    seed: int = 0,
) -> dict:
    """Bootstrap the paired difference between two scores on the same rows.

    Comparing two point estimates ignores that both models were scored on the
    same orders. Resampling rows and recomputing both metrics together gives an
    interval for the difference, which is the quantity the model choice depends
    on. A positive difference means model A is better.
    """
    truth = np.asarray(list(y_true), dtype=int)
    a = np.asarray(list(scores_a), dtype=float)
    b = np.asarray(list(scores_b), dtype=float)
    functions = {
        "average_precision": average_precision_score,
        "roc_auc": roc_auc_score,
    }
    if metric not in functions:
        raise ValueError(f"unsupported metric: {metric!r}")
    score = functions[metric]
    point = float(score(truth, a) - score(truth, b))
    generator = np.random.default_rng(seed)
    draws = []
    for _ in range(n_resamples):
        index = generator.integers(0, len(truth), len(truth))
        sample_y = truth[index]
        if sample_y.min() == sample_y.max():
            continue
        draws.append(float(score(sample_y, a[index]) - score(sample_y, b[index])))
    return {
        "metric": metric,
        "n_resamples": len(draws),
        "difference": point,
        "ci_low": float(np.percentile(draws, 2.5)),
        "ci_high": float(np.percentile(draws, 97.5)),
        "share_a_better": float(np.mean(np.asarray(draws) > 0)),
    }


def calibration_summary(y_true: Iterable[int], scores: Iterable[float]) -> dict:
    """Logistic intercept and slope of observed outcome on predicted logit.

    A slope near one means the scores rank monotonically as probabilities; the
    intercept captures how far the whole curve is shifted by a base-rate change.
    """
    truth = np.asarray(list(y_true), dtype=int)
    score = np.clip(np.asarray(list(scores), dtype=float), 1e-6, 1 - 1e-6)
    if truth.min() == truth.max():
        raise ValueError("calibration_summary needs both outcomes")
    logit = np.log(score / (1 - score)).reshape(-1, 1)
    model = LogisticRegression(C=np.inf, solver="lbfgs", max_iter=1_000)
    model.fit(logit, truth)
    return {
        "intercept": float(model.intercept_[0]),
        "slope": float(model.coef_[0, 0]),
        "mean_prediction": float(score.mean()),
        "observed_rate": float(truth.mean()),
    }


def monthly_metrics(
    frame: pd.DataFrame, scores: Iterable[float], *, label: str = TARGET
) -> list[dict]:
    """Evaluate the same fitted score month by month on the holdout."""
    data = pd.DataFrame(
        {
            "month": pd.to_datetime(frame["purchased_at"]).dt.to_period("M").astype(str),
            "y": np.asarray(frame[label], dtype=int),
            "score": np.asarray(list(scores), dtype=float),
        }
    )
    rows = []
    for month, group in data.groupby("month", sort=True):
        row = {"month": month, "n": len(group), "late_rate": float(group["y"].mean())}
        if group["y"].nunique() > 1:
            metrics = evaluate(group["y"], group["score"])
            row.update(
                {
                    "roc_auc": metrics["roc_auc"],
                    "average_precision": metrics["average_precision"],
                    "top_decile_recall": metrics["top_decile"]["recall"],
                }
            )
        rows.append(row)
    return rows


def rolling_origin(
    frame: pd.DataFrame,
    cutoffs: Sequence[str],
    *,
    kind: str = "logistic",
    horizon_months: int = 3,
    maturity_months: int = LABEL_MATURITY_MONTHS,
) -> list[dict]:
    """Refit on labels observable at each origin and score the next horizon.

    Each origin is a separate, honest simulation of deploying on that date.
    Training stops ``maturity_months`` before the origin so the training set is
    not selected on delivery speed. Test outcomes are eventual: every order in
    the horizon with an observed label is scored, including orders that arrived
    after the horizon. Dropping those would remove late orders from the
    evaluation. The same fixed model family is used throughout; this is a
    stability check, not another selection round.
    """
    purchased_at = pd.to_datetime(frame["purchased_at"])
    delivered_at = pd.to_datetime(frame["delivered_to_customer_at"])
    rows = []
    for raw_cutoff in cutoffs:
        cutoff = pd.Timestamp(raw_cutoff)
        train_end = cutoff - pd.DateOffset(months=maturity_months)
        end = cutoff + pd.DateOffset(months=horizon_months)
        train = frame.loc[
            (purchased_at < train_end) & (delivered_at < cutoff) & frame[TARGET].notna()
        ]
        test = frame.loc[(purchased_at >= cutoff) & (purchased_at < end) & frame[TARGET].notna()]
        if train.empty or test.empty:
            continue
        model = build_model(kind).fit(prepare_features(train), train[TARGET].astype(int))
        scores = model.predict_proba(prepare_features(test))[:, 1]
        metrics = evaluate(test[TARGET].astype(int), scores)
        rows.append(
            {
                "cutoff": str(cutoff.date()),
                "train_cutoff": str(train_end.date()),
                "horizon_months": horizon_months,
                "maturity_months": maturity_months,
                "train_n": len(train),
                "train_late_rate": float(train[TARGET].mean()),
                "test_n": len(test),
                "late_rate": metrics["late_rate"],
                "roc_auc": metrics["roc_auc"],
                "average_precision": metrics["average_precision"],
                "top_decile_recall": metrics["top_decile"]["recall"],
                "top_decile_precision": metrics["top_decile"]["precision"],
            }
        )
    return rows


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
