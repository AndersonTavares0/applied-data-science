#!/usr/bin/env python3
"""Describe what customers complain about, and how that differs when late.

The analysis deliberately looks at written 1–2 star reviews, not all reviews.
Most orders have no text, and the ones that do are selected: late orders are
much more likely to leave one. The report states that scope before any result.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402
from retail.config import get_settings  # noqa: E402
from retail.io import build_engine  # noqa: E402

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parents[1]
sys.path.insert(0, str(PROJECT / "src"))

from voice.stats import topic_prevalence  # noqa: E402
from voice.text import MIN_TOKENS, normalize_text  # noqa: E402
from voice.topics import (  # noqa: E402
    coherence_by_topic_count,
    fit_topic_model,
    soft_assignment_summary,
    top_terms,
    topic_stability,
    topic_terms_frame,
    umass_coherence,
)

TOPIC_COUNT = 6
SEED = 0
FIGURE_DIR = ROOT / "site" / "reports" / "03-voice-of-customer" / "figures"
REPORT_DIR = PROJECT / "reports"

PRIMARY = "#1f6fb2"
ACCENT = "#d97706"
MUTED = "#6b7280"

# Topic order is fixed by `random_state=0` and the pinned scikit-learn version.
# The anchors are checked after fitting: if an upgrade reorders the topics, the
# script fails instead of publishing mismatched labels.
TOPIC_LABELS = (
    "Product quality or not as described",
    "Not received (still waiting)",
    "Incomplete order (missing items)",
    "Delivery problem (promise or carrier)",
    "Delay and long wait",
    "Wrong item, defect or return",
)
TOPIC_ANCHORS = ("qualidade", "recebi", "apenas", "correios", "demora", "troca")
SHORT_LABELS = (
    "Quality / not as described",
    "Not received",
    "Incomplete order",
    "Delivery problem",
    "Delay / long wait",
    "Wrong item / return",
)
SHORT_LABELS_PT = (
    "Qualidade / diferente",
    "Não recebido",
    "Pedido incompleto",
    "Problema de entrega",
    "Atraso / demora",
    "Item errado / troca",
)
STRINGS = {
    "en": {
        "gap_title": "Complaint topics over-represented among late orders",
        "gap_x": "Difference in share of complaints, late minus on-time (percentage points)",
        "mix_title": "Complaint mix by delivery outcome",
        "mix_x": "Share of complaints within each group (%)",
        "late": "Late",
        "on_time": "On time",
    },
    "pt": {
        "gap_title": "Tópicos mais frequentes nas reclamações de pedidos atrasados",
        "gap_x": "Diferença na participação, atrasado menos no prazo (pontos percentuais)",
        "mix_title": "Mistura de reclamações por resultado da entrega",
        "mix_x": "Participação nas reclamações de cada grupo (%)",
        "late": "Atrasado",
        "on_time": "No prazo",
    },
}


def load_orders() -> pd.DataFrame:
    """One row per delivered order, with its latest review only."""
    engine = build_engine(get_settings())
    query = """
        with latest_reviews as (
            select order_id, review_score, comment_message
            from (
                select
                    order_id,
                    review_score,
                    comment_message,
                    row_number() over (
                        partition by order_id
                        order by review_created_at desc nulls last, review_id desc
                    ) as rn
                from analytics_staging.stg_order_reviews
            ) ranked
            where rn = 1
        )
        select
            f.order_id,
            f.is_late,
            f.delivery_days,
            r.review_score,
            r.comment_message
        from analytics_marts.fct_orders f
        left join latest_reviews r using (order_id)
        where f.is_late is not null
    """
    return pd.read_sql(query, engine)


def build_scope(frame: pd.DataFrame, corpus: pd.DataFrame) -> dict:
    """Counts that describe who is in the corpus and who is missing from it."""
    scope = {"delivered_orders": int(len(frame)), "by_outcome": {}}
    for outcome, group in frame.groupby("is_late"):
        reviewed = group["comment_message"].notna()
        low_star = reviewed & (group["review_score"] <= 2)
        key = "late" if bool(outcome) else "on_time"
        scope["by_outcome"][key] = {
            "orders": int(len(group)),
            "with_comment": int(reviewed.sum()),
            "comment_rate_pct": round(100 * reviewed.mean(), 2),
            "low_star_comments": int(low_star.sum()),
            "low_star_comment_rate_pct": round(100 * low_star.mean(), 2),
        }
    scope["corpus"] = {
        "low_star_reviews": int((frame["review_score"] <= 2).sum()),
        "low_star_comments": int(
            sum(values["low_star_comments"] for values in scope["by_outcome"].values())
        ),
        "usable_comments": int(len(corpus)),
        "dropped_short_comments": int(
            sum(values["low_star_comments"] for values in scope["by_outcome"].values())
        )
        - int(len(corpus)),
        "late_comments": int(corpus["is_late"].sum()),
        "late_share_pct": round(100 * corpus["is_late"].mean(), 2),
        "min_tokens": MIN_TOKENS,
    }
    return scope


def plot_gap(table: pd.DataFrame, language: str, destination: Path) -> None:
    labels = SHORT_LABELS if language == "en" else SHORT_LABELS_PT
    ordered = table.sort_values("diff_pp")
    positions = np.arange(len(ordered))
    gaps = ordered["diff_pp"].to_numpy()
    errors = np.vstack(
        [
            gaps - ordered["ci_low_pp"].to_numpy(),
            ordered["ci_high_pp"].to_numpy() - gaps,
        ]
    )
    colors = [ACCENT if value > 0 else MUTED for value in gaps]

    fig, ax = plt.subplots(figsize=(8.8, 4.8))
    ax.barh(
        positions,
        gaps,
        color=colors,
        xerr=errors,
        capsize=3,
        error_kw={"ecolor": "#374151", "elinewidth": 1},
    )
    ax.axvline(0, color="#111827", linewidth=1)
    ax.set_yticks(positions, [labels[i] for i in ordered["topic"]])
    ax.set_xlabel(STRINGS[language]["gap_x"])
    ax.set_title(STRINGS[language]["gap_title"], loc="left", fontsize=11)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="x", color="#e5e7eb", linewidth=0.8)
    ax.set_axisbelow(True)
    fig.tight_layout()
    fig.savefig(destination, dpi=160, bbox_inches="tight")
    plt.close(fig)


def plot_mix(table: pd.DataFrame, language: str, destination: Path) -> None:
    labels = SHORT_LABELS if language == "en" else SHORT_LABELS_PT
    ordered = table.sort_values("share_pct")
    positions = np.arange(len(ordered))

    fig, ax = plt.subplots(figsize=(8.8, 4.8))
    ax.barh(
        positions - 0.19,
        ordered["late_share_pct"],
        height=0.36,
        color=ACCENT,
        label=STRINGS[language]["late"],
    )
    ax.barh(
        positions + 0.19,
        ordered["on_time_share_pct"],
        height=0.36,
        color=PRIMARY,
        label=STRINGS[language]["on_time"],
    )
    ax.set_yticks(positions, [labels[i] for i in ordered["topic"]])
    ax.set_xlabel(STRINGS[language]["mix_x"])
    ax.set_title(STRINGS[language]["mix_title"], loc="left", fontsize=11)
    ax.legend(frameon=False, loc="lower right")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="x", color="#e5e7eb", linewidth=0.8)
    ax.set_axisbelow(True)
    fig.tight_layout()
    fig.savefig(destination, dpi=160, bbox_inches="tight")
    plt.close(fig)


def main() -> int:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    (FIGURE_DIR / "pt").mkdir(parents=True, exist_ok=True)

    frame = load_orders()
    corpus = frame[frame["review_score"] <= 2].copy()
    corpus["clean"] = corpus["comment_message"].map(normalize_text)
    corpus = corpus[corpus["clean"].str.split().str.len() >= MIN_TOKENS]
    # LDA's batch updates depend on document order, and SQL does not promise one.
    # Sorting makes the fit reproducible across table rebuilds.
    corpus = corpus.sort_values("order_id").reset_index(drop=True)
    if corpus.empty:
        raise SystemExit("no usable low-star comments found")

    texts = corpus["clean"].tolist()
    vectorizer, model, weights = fit_topic_model(
        texts, n_topics=TOPIC_COUNT, seed=SEED, max_iter=30
    )
    corpus["topic"] = weights.argmax(axis=1)
    terms = top_terms(vectorizer, model, n=12)
    for topic, anchor in enumerate(TOPIC_ANCHORS):
        if anchor not in terms[topic]:
            raise SystemExit(
                f"topic {topic} no longer contains anchor {anchor!r}; "
                "re-check TOPIC_LABELS before publishing"
            )

    table = topic_prevalence(corpus)
    table["label"] = table["topic"].map(dict(enumerate(TOPIC_LABELS)))
    table = table[
        [
            "topic",
            "label",
            "n",
            "share_pct",
            "late_n",
            "on_time_n",
            "late_share_pct",
            "on_time_share_pct",
            "diff_pp",
            "ci_low_pp",
            "ci_high_pp",
            "p_value",
            "q_value",
        ]
    ].sort_values("share_pct", ascending=False)

    selection = coherence_by_topic_count(texts, topic_counts=(4, 5, 6, 7, 8, 9, 10), seed=SEED)
    best_topics = int(selection.loc[selection["mean_coherence"].idxmax(), "topics"])
    if best_topics != TOPIC_COUNT:
        raise SystemExit(
            f"coherence selects {best_topics} topics, not {TOPIC_COUNT}; "
            "re-check TOPIC_COUNT and TOPIC_LABELS before publishing"
        )
    stability = topic_stability(texts, n_topics=TOPIC_COUNT, seeds=(0, 1, 2, 3, 4), max_iter=30)
    soft = soft_assignment_summary(weights)
    coherence = umass_coherence(vectorizer, model, texts)

    scope = build_scope(frame, corpus)
    scope["model"] = {
        "method": "Latent Dirichlet Allocation",
        "topics": TOPIC_COUNT,
        "seed": SEED,
        "max_iter": 30,
        "min_df": 20,
        "max_df": 0.5,
        "ngram_range": [1, 2],
        "perplexity": round(float(model.perplexity(vectorizer.transform(texts))), 2),
        "coherence": {
            "metric": "UMass, top 10 terms",
            "mean": round(float(np.mean(coherence)), 4),
            "per_topic": [round(float(value), 4) for value in coherence],
        },
        "selection": selection.round(4).to_dict(orient="records"),
        "stability": stability,
        "soft_assignment": soft,
        "mean_weight_by_outcome": {
            "late": np.round(weights[corpus["is_late"].to_numpy()].mean(axis=0), 4).tolist(),
            "on_time": np.round(weights[~corpus["is_late"].to_numpy()].mean(axis=0), 4).tolist(),
        },
    }

    (REPORT_DIR / "review_scope.json").write_text(
        json.dumps(scope, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    topic_terms_frame(vectorizer, model, TOPIC_LABELS, n=12).to_csv(
        REPORT_DIR / "topic_terms.csv", index=False
    )
    selection.to_csv(REPORT_DIR / "topic_selection.csv", index=False, float_format="%.6g")
    table.to_csv(REPORT_DIR / "topic_prevalence.csv", index=False, float_format="%.6g")

    plot_gap(table, "en", FIGURE_DIR / "topic_gap.png")
    plot_mix(table, "en", FIGURE_DIR / "topic_mix.png")
    plot_gap(table, "pt", FIGURE_DIR / "pt" / "topic_gap.png")
    plot_mix(table, "pt", FIGURE_DIR / "pt" / "topic_mix.png")

    print(f"delivered orders: {scope['delivered_orders']:,}")
    for outcome, values in scope["by_outcome"].items():
        print(
            f"  {outcome:<7} orders={values['orders']:,} "
            f"comments={values['with_comment']:,} ({values['comment_rate_pct']:.2f}%) "
            f"1-2 star={values['low_star_comments']:,} "
            f"({values['low_star_comment_rate_pct']:.2f}%)"
        )
    print(
        f"corpus: {scope['corpus']['usable_comments']:,} usable complaints from "
        f"{scope['corpus']['low_star_comments']:,} low-star comments "
        f"({scope['corpus']['dropped_short_comments']:,} too short), "
        f"{scope['corpus']['late_share_pct']:.2f}% from late orders"
    )
    print(
        f"perplexity: {scope['model']['perplexity']:.2f}; "
        f"mean coherence: {scope['model']['coherence']['mean']:.3f} "
        f"(best k={best_topics} across {len(selection)} candidates)"
    )
    print(
        f"stability: mean ARI {stability['mean_adjusted_rand']:.3f}, "
        f"mean top-term Jaccard {stability['mean_jaccard']:.3f}"
    )
    print(
        f"mixed documents: {soft['share_max_below_0_5_pct']:.1f}% have max topic weight < 0.5; "
        f"{soft['share_second_at_least_0_3_pct']:.1f}% have a second topic >= 0.3\n"
    )
    display = table.copy()
    for column in ("share_pct", "late_share_pct", "on_time_share_pct", "diff_pp"):
        display[column] = display[column].round(1)
    display["q_value"] = display["q_value"].map(lambda value: f"{value:.2g}")
    print(
        display[
            ["label", "n", "share_pct", "late_share_pct", "on_time_share_pct", "diff_pp", "q_value"]
        ].to_string(index=False)
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
