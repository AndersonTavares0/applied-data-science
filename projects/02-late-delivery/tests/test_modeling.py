"""Tests for the late-delivery feature contract and evaluation helpers."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest
from late_delivery.features import (
    FEATURES,
    FORBIDDEN_FEATURES,
    TARGET,
    build_model,
    capacity_metrics,
    prepare_features,
    state_rate_baseline,
    temporal_split,
)


def synthetic_frame(rows: int = 480) -> pd.DataFrame:
    generator = np.random.default_rng(7)
    frame = pd.DataFrame(
        {
            "purchased_at": pd.date_range("2018-01-01", periods=rows, freq="6h"),
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


def test_temporal_split_uses_cutoff_and_drops_unlabelled_orders() -> None:
    frame = synthetic_frame()
    frame.loc[0, "purchased_at"] = pd.Timestamp("2018-02-01")
    frame.loc[0, TARGET] = np.nan
    train, test = temporal_split(frame, cutoff="2018-04-01")

    assert train["purchased_at"].max() < pd.Timestamp("2018-04-01")
    assert test["purchased_at"].min() >= pd.Timestamp("2018-04-01")
    assert len(train) + len(test) == frame[TARGET].notna().sum()
    assert frame.loc[0].name not in set(train.index) | set(test.index)


def test_capacity_metrics_capture_late_orders_when_ranking_is_perfect() -> None:
    y_true = [0] * 90 + [1] * 10
    scores = [0.0] * 90 + [1.0] * 10
    result = capacity_metrics(y_true, scores, capacity=0.10)

    assert result["n_selected"] == 10
    assert result["precision"] == pytest.approx(1.0)
    assert result["recall"] == pytest.approx(1.0)
    assert result["lift"] == pytest.approx(10.0)


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
