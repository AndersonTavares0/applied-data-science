"""Proportion comparisons and multiple-testing correction."""

from __future__ import annotations

import math
from collections.abc import Iterable

import numpy as np
import pandas as pd

Z_95 = 1.959963984540054


def two_proportion_test(k1: int, n1: int, k2: int, n2: int) -> dict:
    """Difference between two proportions with a 95% CI and a two-sided p-value.

    The confidence interval uses unpooled standard errors; the test uses the
    pooled standard error, which is the usual null hypothesis of equal rates.
    """
    if n1 <= 0 or n2 <= 0:
        raise ValueError("both groups need at least one observation")
    if not (0 <= k1 <= n1 and 0 <= k2 <= n2):
        raise ValueError("counts must lie within their group sizes")

    p1 = k1 / n1
    p2 = k2 / n2
    diff = p1 - p2
    se = math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2)
    pooled = (k1 + k2) / (n1 + n2)
    se_pooled = math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2))
    z = diff / se_pooled if se_pooled else 0.0
    p_value = math.erfc(abs(z) / math.sqrt(2))
    margin = Z_95 * se
    return {
        "rate_1": p1,
        "rate_2": p2,
        "diff": diff,
        "ci_low": diff - margin,
        "ci_high": diff + margin,
        "z": z,
        "p_value": min(1.0, p_value),
    }


def benjamini_hochberg(pvalues: Iterable[float]) -> np.ndarray:
    """Benjamini–Hochberg adjusted q-values, returned in the input order."""
    values = np.asarray(list(pvalues), dtype=float)
    if values.size == 0:
        return values
    if np.any((values < 0) | (values > 1)):
        raise ValueError("p-values must lie in [0, 1]")
    order = np.argsort(values)
    ranked = values[order]
    m = values.size
    adjusted = ranked * m / np.arange(1, m + 1)
    adjusted = np.minimum.accumulate(adjusted[::-1])[::-1]
    result = np.empty_like(adjusted)
    result[order] = np.clip(adjusted, 0.0, 1.0)
    return result


def topic_prevalence(
    frame: pd.DataFrame, *, topic_col: str = "topic", label_col: str = "is_late"
) -> pd.DataFrame:
    """Compare each topic's share of late vs on-time complaints.

    The comparison is compositional: the denominator is the number of late
    (or on-time) complaints, not the number of orders. That is the right
    question for a corpus of written complaints and it is stated as such in the
    report.
    """
    if frame.empty:
        raise ValueError("topic_prevalence needs at least one row")
    late = frame[label_col].astype(bool)
    late_total = int(late.sum())
    on_time_total = int((~late).sum())
    if late_total == 0 or on_time_total == 0:
        raise ValueError("both late and on-time complaints are needed")

    total = len(frame)
    rows = []
    for topic, group in frame.groupby(topic_col, sort=True):
        group_late = group[label_col].astype(bool)
        late_n = int(group_late.sum())
        on_time_n = len(group) - late_n
        test = two_proportion_test(late_n, late_total, on_time_n, on_time_total)
        rows.append(
            {
                "topic": int(topic),
                "n": len(group),
                "share_pct": 100 * len(group) / total,
                "late_n": late_n,
                "on_time_n": on_time_n,
                "late_share_pct": 100 * test["rate_1"],
                "on_time_share_pct": 100 * test["rate_2"],
                "diff_pp": 100 * test["diff"],
                "ci_low_pp": 100 * test["ci_low"],
                "ci_high_pp": 100 * test["ci_high"],
                "p_value": test["p_value"],
            }
        )
    result = pd.DataFrame(rows).sort_values("share_pct", ascending=False, ignore_index=True)
    result["q_value"] = benjamini_hochberg(result["p_value"])
    return result
