"""Checks on the committed topic artefacts.

The topic model needs PostgreSQL, but its published tables are committed. These
tests catch a stale or internally inconsistent artefact without a database.
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

REPORTS = Path(__file__).resolve().parents[1] / "reports"


def _scope() -> dict:
    return json.loads((REPORTS / "review_scope.json").read_text(encoding="utf-8"))


def test_scope_counts_are_internally_consistent() -> None:
    corpus = _scope()["corpus"]
    assert corpus["low_star_comments"] == 9_237
    assert corpus["usable_comments"] == 9_139
    assert corpus["dropped_short_comments"] == 98
    assert corpus["late_comments"] == 2_711
    assert abs(corpus["late_share_pct"] - 29.66) < 0.01


def test_topic_prevalence_denominators_add_up() -> None:
    table = pd.read_csv(REPORTS / "topic_prevalence.csv")
    corpus = _scope()["corpus"]
    assert table["n"].sum() == corpus["usable_comments"]
    assert table["late_n"].sum() == corpus["late_comments"]
    assert table["on_time_n"].sum() == corpus["usable_comments"] - corpus["late_comments"]
    assert abs(table["share_pct"].sum() - 100.0) < 0.1
    assert (table["q_value"] <= 1.0).all()


def test_group_table_covers_every_complaint_once() -> None:
    groups = pd.read_csv(REPORTS / "topic_groups.csv")
    corpus = _scope()["corpus"]
    assert groups["late_n"].sum() == corpus["late_comments"]
    assert groups["on_time_n"].sum() == corpus["usable_comments"] - corpus["late_comments"]
    assert abs(groups["late_share_pct"].sum() - 100.0) < 0.1
    assert abs(groups["on_time_share_pct"].sum() - 100.0) < 0.1


def test_selection_records_seed_sensitivity() -> None:
    selection = _scope()["model"]["selection"]
    assert selection["seeds"] == [0, 1, 2]
    assert selection["selected"] == 6
    assert selection["seed0_best"] == 6
    assert selection["mean_best"] == 4
    assert [row["topics"] for row in selection["rows"]] == [4, 5, 6, 7, 8, 9, 10]

    table = pd.read_csv(REPORTS / "topic_selection.csv")
    assert list(table.columns) == [
        "topics",
        "seed0_coherence",
        "mean_coherence",
        "sd_coherence",
        "perplexity",
    ]
    assert (table["sd_coherence"] >= 0).all()
    assert (table["perplexity"] > 0).all()


def test_k4_sensitivity_keeps_the_same_contrast() -> None:
    groups = pd.read_csv(REPORTS / "topic_groups_k4.csv")
    corpus = _scope()["corpus"]
    assert groups["late_n"].sum() == corpus["late_comments"]
    assert groups["on_time_n"].sum() == corpus["usable_comments"] - corpus["late_comments"]
    delivery = groups.set_index("group").loc["Delivery and non-receipt"]
    product = groups.set_index("group").loc["Product"]
    assert delivery["late_share_pct"] > 80
    assert product["on_time_share_pct"] > 70


def test_hard_assignment_denominators_match_scope() -> None:
    scope = _scope()
    late = scope["by_outcome"]["late"]
    on_time = scope["by_outcome"]["on_time"]
    assert late["orders"] == 6_535
    assert on_time["orders"] == 89_941
    assert late["low_star_comments"] == 2_747
    assert on_time["low_star_comments"] == 6_490
