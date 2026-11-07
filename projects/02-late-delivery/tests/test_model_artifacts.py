"""Checks on the committed metrics artefact.

The pipeline needs a database, but the artefact it writes is part of the
published result. These tests catch a stale or internally inconsistent JSON
without downloading data or starting PostgreSQL.
"""

from __future__ import annotations

import json
from pathlib import Path

METRICS = Path(__file__).resolve().parents[1] / "reports" / "model_metrics.json"


def _metrics() -> dict:
    return json.loads(METRICS.read_text(encoding="utf-8"))


def test_split_counts_add_up_to_observable_orders() -> None:
    metrics = _metrics()
    train_n = metrics["train"]["n"]
    validation_n = metrics["train"]["validation_n"]
    test_n = metrics["test"]["n"]
    excluded_n = metrics["excluded"]["n"]
    gap_n = metrics["maturity_gap"]["n"]
    assert train_n + validation_n + test_n + excluded_n + gap_n == 99_441
    assert train_n == 43_691
    assert validation_n == 20_628
    assert test_n == 32_150
    assert gap_n == 7


def test_selection_uses_rolling_origin_and_reports_both_models() -> None:
    metrics = _metrics()
    selection = metrics["selection"]
    assert selection["criterion"] == "mean rolling-origin average precision"
    assert selection["selected"] in {"logistic", "boosting"}
    assert set(selection["mean_average_precision"]) == {"logistic", "boosting"}
    assert set(metrics["rolling_origin"]) == {"logistic", "boosting"}
    for rows in metrics["rolling_origin"].values():
        assert [row["cutoff"] for row in rows] == [
            "2017-07-01",
            "2017-10-01",
            "2018-01-01",
        ]
        assert all(row["maturity_months"] == 3 for row in rows)
        assert all(row["train_cutoff"] < row["cutoff"] for row in rows)


def test_constant_baseline_has_no_ranking_metrics() -> None:
    baseline = _metrics()["baselines"]["constant_prevalence"]
    assert baseline["top_decile"] is None
    assert 0.0 < baseline["brier"] < 1.0


def test_paired_difference_interval_contains_the_point_estimate() -> None:
    paired = _metrics()["selected_model"]["paired_differences"]
    assert paired
    for payload in paired.values():
        for result in payload.values():
            assert result["ci_low"] <= result["difference"] <= result["ci_high"]
            assert 0.0 <= result["share_a_better"] <= 1.0


def test_test_metrics_are_probabilities_and_rates() -> None:
    metrics = _metrics()
    for payload in metrics["models"].values():
        values = payload["metrics"]
        assert 0.0 <= values["roc_auc"] <= 1.0
        assert 0.0 <= values["average_precision"] <= 1.0
        assert 0.0 <= values["brier"] <= 1.0
        assert 0.0 <= values["late_rate"] <= 1.0
