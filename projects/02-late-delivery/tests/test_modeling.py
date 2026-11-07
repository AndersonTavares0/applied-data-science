"""Tests for the late-delivery feature contract and evaluation helpers."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest
from late_delivery.features import (
    FEATURES,
    FORBIDDEN_FEATURES,
    TARGET,
    bootstrap_metrics,
    build_model,
    calibration_summary,
    capacity_metrics,
    capacity_table,
    monthly_metrics,
    prepare_features,
    split_train_validation,
    state_rate_baseline,
    temporal_split,
)


def synthetic_frame(rows: int = 480) -> pd.DataFrame:
    generator = np.random.default_rng(7)
    frame = pd.DataFrame(
        {
            "purchased_at": pd.date_range("2018-01-01", periods=rows, freq="6h"),
            "delivered_to_customer_at": pd.date_range("2018-01-03", periods=rows, freq="6h"),
            "is_late": generator.integers(0, 2, rows),
        }
    )
    for name in FEATURES:
        frame[name] = generator.normal(size=rows)
    for name in ("customer_state", "seller_state", "category"):
        frame[name] = generator.choice(["SP", "RJ", "MG"], rows)
    return frame


def test_feature_contract_is_allow_list_and_excludes_post_purchase_columns() -> None:
    assert set(FEATURES).isdisjoint(FORBIDDEN_FEATURES)
    assert TARGET not in FEATURES
    assert TARGET in FORBIDDEN_FEATURES
    assert "order_status" in FORBIDDEN_FEATURES
    assert "delivered_to_customer_at" in FORBIDDEN_FEATURES


def test_temporal_split_uses_cutoff_and_drops_inflight_or_unlabelled_orders() -> None:
    frame = synthetic_frame()
    frame.loc[0, TARGET] = np.nan
    # Purchased before the cutoff but delivered after it: no label existed at
    # the cutoff, so this row must not train the model.
    frame.loc[1, "purchased_at"] = pd.Timestamp("2018-03-30")
    frame.loc[1, "delivered_to_customer_at"] = pd.Timestamp("2018-04-02")
    train, test = temporal_split(frame, cutoff="2018-04-01")

    assert train["purchased_at"].max() < pd.Timestamp("2018-04-01")
    assert (train["delivered_to_customer_at"] < pd.Timestamp("2018-04-01")).all()
    assert test["purchased_at"].min() >= pd.Timestamp("2018-04-01")
    assert len(train) + len(test) < frame[TARGET].notna().sum()
    assert frame.loc[0].name not in set(train.index) | set(test.index)
    assert frame.loc[1].name not in set(train.index) | set(test.index)


def test_train_validation_uses_labels_observable_at_validation_cutoff() -> None:
    frame = synthetic_frame()
    train, _ = temporal_split(frame, cutoff="2018-04-01")
    fit, validation = split_train_validation(train, cutoff="2018-03-01")

    assert (fit["purchased_at"] < pd.Timestamp("2018-03-01")).all()
    assert (fit["delivered_to_customer_at"] < pd.Timestamp("2018-03-01")).all()
    assert validation["purchased_at"].min() >= pd.Timestamp("2018-03-01")


def test_capacity_metrics_capture_late_orders_when_ranking_is_perfect() -> None:
    y_true = [0] * 90 + [1] * 10
    scores = [0.0] * 90 + [1.0] * 10
    result = capacity_metrics(y_true, scores, capacity=0.10)

    assert result["n_selected"] == 10
    assert result["precision"] == pytest.approx(1.0)
    assert result["recall"] == pytest.approx(1.0)
    assert result["lift"] == pytest.approx(10.0)


def test_capacity_table_reports_multiple_budgets() -> None:
    y_true = [0] * 90 + [1] * 10
    scores = [0.0] * 90 + [1.0] * 10
    rows = capacity_table(y_true, scores, capacities=(0.05, 0.10, 0.20))

    assert [row["n_selected"] for row in rows] == [5, 10, 20]
    assert rows[0]["recall"] == pytest.approx(0.5)
    assert rows[1]["recall"] == pytest.approx(1.0)


def test_bootstrap_interval_contains_the_point_estimate() -> None:
    y_true = [0] * 90 + [1] * 10
    scores = [0.1] * 90 + [0.9] * 10
    result = bootstrap_metrics(y_true, scores, n_resamples=50, seed=1)

    assert result["n_resamples"] > 0
    for name in ("roc_auc", "average_precision", "brier", "top_precision"):
        assert result[name]["ci_low"] <= result[name]["point"] <= result[name]["ci_high"]


def test_calibration_summary_recovers_a_positive_slope() -> None:
    generator = np.random.default_rng(3)
    y_true = generator.integers(0, 2, 500)
    scores = np.where(
        y_true == 1, generator.uniform(0.4, 0.9, 500), generator.uniform(0.05, 0.6, 500)
    )
    summary = calibration_summary(y_true, scores)

    assert summary["slope"] > 0
    assert {"intercept", "mean_prediction", "observed_rate"} <= summary.keys()


def test_monthly_metrics_returns_one_row_per_purchase_month() -> None:
    frame = synthetic_frame(300)
    scores = np.linspace(0.01, 0.99, len(frame))
    rows = monthly_metrics(frame, scores)

    assert len(rows) == frame["purchased_at"].dt.to_period("M").nunique()
    assert all("late_rate" in row for row in rows)


def test_state_baseline_falls_back_to_prior_for_unseen_state() -> None:
    train = synthetic_frame(300)
    train["customer_state"] = "SP"
    test = train.head(5).copy()
    test["customer_state"] = "ZZ"
    scores = state_rate_baseline(train, test)
    assert np.allclose(scores, train[TARGET].mean())


@pytest.mark.parametrize("kind", ["logistic", "boosting"])
def test_pipeline_fits_with_missing_values(kind: str) -> None:
    frame = synthetic_frame(300)
    frame.loc[1:10, "seller_state"] = np.nan
    frame.loc[11:20, "same_state"] = np.nan
    frame.loc[21:30, "avg_weight_grams"] = np.nan
    matrix = prepare_features(frame)

    model = build_model(kind).fit(matrix, frame[TARGET].astype(int))
    scores = model.predict_proba(matrix)[:, 1]

    assert scores.shape == (len(frame),)
    assert np.all((scores >= 0) & (scores <= 1))
