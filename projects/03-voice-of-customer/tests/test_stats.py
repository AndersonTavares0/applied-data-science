import numpy as np
import pandas as pd
from voice.stats import benjamini_hochberg, topic_prevalence, two_proportion_test


def test_two_proportion_test_matches_hand_calculation():
    result = two_proportion_test(30, 100, 20, 100)
    assert abs(result["diff"] - 0.10) < 1e-12
    assert result["ci_low"] < 0.10 < result["ci_high"]
    assert 0.10 < result["p_value"] < 0.11


def test_benjamini_hochberg_is_monotone_and_order_preserving():
    adjusted = benjamini_hochberg([0.01, 0.04, 0.03, 0.002])
    assert np.allclose(adjusted, [0.02, 0.04, 0.04, 0.008])


def test_topic_prevalence_uses_complaint_denominators():
    frame = pd.DataFrame(
        {
            "topic": [0] * 60 + [1] * 40 + [0] * 20 + [1] * 80,
            "is_late": [True] * 100 + [False] * 100,
        }
    )
    table = topic_prevalence(frame).set_index("topic")
    assert table.loc[0, "late_share_pct"] == 60.0
    assert table.loc[0, "on_time_share_pct"] == 20.0
    assert table.loc[0, "diff_pp"] == 40.0
    assert table.loc[0, "q_value"] < 0.01
