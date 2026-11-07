"""Train and evaluate the late-delivery model against the dbt marts.

Run through `uv run python tasks.py train` so `.env` is loaded and both source
trees are importable. Outputs are small, committed artefacts: metrics JSON,
feature importance CSV and the report figures. The fitted model itself is not
committed; it can be rebuilt from the pinned data and code.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Allow running this file directly, before the package is installed.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

import matplotlib  # noqa: E402

matplotlib.use("Agg")

import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402
from late_delivery.features import (  # noqa: E402
    SPLIT_CUTOFF,
    TARGET,
    build_model,
    calibration_table,
    capacity_metrics,
    evaluate,
    permutation_importance_by_raw_feature,
    prepare_features,
    prevalence_baseline,
    state_rate_baseline,
    temporal_split,
)
from retail.config import get_settings  # noqa: E402
from retail.io import build_engine  # noqa: E402
from sklearn.metrics import precision_recall_curve  # noqa: E402

PROJECT = Path(__file__).resolve().parents[1]
REPORTS = PROJECT / "reports"
FIGURES = PROJECT.parents[1] / "site" / "reports" / "02-late-delivery" / "figures"
STRINGS = {
    "en": {
        "perfect": "Perfect",
        "calibration_x": "Predicted probability of late delivery",
        "calibration_y": "Observed late rate",
        "calibration_title": "Calibration on the temporal holdout (n={n})",
        "prevalence": "prevalence {value}",
        "pr_x": "Recall (share of late orders captured)",
        "pr_y": "Precision (share of flagged orders that were late)",
        "pr_title": "Precision–recall on the temporal holdout",
    },
    "pt": {
        "perfect": "Perfeito",
        "calibration_x": "Probabilidade prevista de atraso",
        "calibration_y": "Taxa observada de atraso",
        "calibration_title": "Calibração na amostra temporal (n={n})",
        "prevalence": "prevalência {value}",
        "pr_x": "Recall (fração dos atrasos capturados)",
        "pr_y": "Precisão (fração dos sinalizados que atrasaram)",
        "pr_title": "Precisão–recall na amostra temporal",
    },
}
QUERY = "SELECT * FROM analytics_marts.mart_order_features"


def load_features() -> pd.DataFrame:
    engine = build_engine(get_settings())
    with engine.connect() as connection:
        return pd.read_sql(QUERY, connection)


def save_calibration(models: dict[str, dict], y_test: pd.Series, lang: str) -> None:
    text = STRINGS[lang]
    figure, axis = plt.subplots(figsize=(6, 4.5))
    axis.plot([0, 1], [0, 1], color="#9ca3af", linestyle="--", linewidth=1, label=text["perfect"])
    colours = {"logistic": "#1f6fb2", "boosting": "#d97706"}
    for kind, payload in models.items():
        rows = payload["calibration"]
        axis.plot(
            [row["predicted"] for row in rows],
            [row["observed"] for row in rows],
            marker="o",
            markersize=4,
            linewidth=1.5,
            color=colours[kind],
            label=kind,
        )
    axis.set_xlabel(text["calibration_x"])
    axis.set_ylabel(text["calibration_y"])
    axis.set_title(text["calibration_title"].format(n=f"{len(y_test):,}".replace(",", " ")))
    axis.legend(frameon=False)
    figure.tight_layout()
    destination = FIGURES if lang == "en" else FIGURES / lang
    destination.mkdir(parents=True, exist_ok=True)
    figure.savefig(destination / "calibration.png", dpi=150)
    plt.close(figure)


def save_precision_recall(models: dict[str, dict], y_test: pd.Series, lang: str) -> None:
    text = STRINGS[lang]
    figure, axis = plt.subplots(figsize=(6, 4.5))
    prevalence = float(y_test.mean())
    axis.axhline(prevalence, color="#9ca3af", linestyle=":", linewidth=1)
    axis.annotate(
        text["prevalence"].format(value=f"{prevalence:.1%}".replace(".", ",")),
        xy=(0.55, prevalence),
        xytext=(0, 6),
        textcoords="offset points",
        color="#6b7280",
        fontsize=9,
    )
    colours = {"logistic": "#1f6fb2", "boosting": "#d97706"}
    for kind, payload in models.items():
        precision, recall, _ = precision_recall_curve(y_test, payload["scores"])
        axis.plot(recall, precision, color=colours[kind], linewidth=1.5, label=kind)
    axis.set_xlabel(text["pr_x"])
    axis.set_ylabel(text["pr_y"])
    axis.set_title(text["pr_title"])
    axis.legend(frameon=False)
    figure.tight_layout()
    destination = FIGURES if lang == "en" else FIGURES / lang
    destination.mkdir(parents=True, exist_ok=True)
    figure.savefig(destination / "precision_recall.png", dpi=150)
    plt.close(figure)


def main() -> int:
    REPORTS.mkdir(parents=True, exist_ok=True)
    FIGURES.mkdir(parents=True, exist_ok=True)

    frame = load_features()
    train, test = temporal_split(frame, cutoff=SPLIT_CUTOFF)
    x_train, x_test = prepare_features(train), prepare_features(test)
    y_train, y_test = train[TARGET].astype(int), test[TARGET].astype(int)

    print(f"train {len(train):,} orders ({y_train.mean():.2%} late) up to {SPLIT_CUTOFF}")
    print(f"test  {len(test):,} orders ({y_test.mean():.2%} late) from {SPLIT_CUTOFF}")

    payloads: dict[str, dict] = {}
    for kind in ("logistic", "boosting"):
        model = build_model(kind)
        model.fit(x_train, y_train)
        scores = model.predict_proba(x_test)[:, 1]
        payloads[kind] = {
            "scores": scores,
            "metrics": evaluate(y_test, scores),
            "calibration": calibration_table(y_test, scores),
        }
        print(f"\n{kind}: {json.dumps(payloads[kind]['metrics'], indent=2)}")

    best = max(payloads, key=lambda kind: payloads[kind]["metrics"]["average_precision"])
    importance = permutation_importance_by_raw_feature(
        build_model(best).fit(x_train, y_train), x_test, y_test
    )
    print(f"\npermutation importance ({best}), top 10:")
    print(importance.head(10).to_string(index=False))

    prevalence = prevalence_baseline(train)
    state_scores = state_rate_baseline(train, test)
    baselines = {
        "constant_prevalence": {
            "brier": float(((y_test - prevalence) ** 2).mean()),
            "top_decile": capacity_metrics(y_test, [prevalence] * len(y_test)),
        },
        "state_rate": {
            "brier": float(((y_test - state_scores) ** 2).mean()),
            "top_decile": capacity_metrics(y_test, state_scores),
        },
    }

    metrics = {
        "target": TARGET,
        "split_cutoff": SPLIT_CUTOFF,
        "train": {"n": len(train), "late_rate": float(y_train.mean())},
        "test": {"n": len(test), "late_rate": float(y_test.mean())},
        "models": {
            kind: {"metrics": payload["metrics"], "calibration": payload["calibration"]}
            for kind, payload in payloads.items()
        },
        "baselines": baselines,
        "best_model": best,
    }
    (REPORTS / "model_metrics.json").write_text(
        json.dumps(metrics, indent=2) + "\n", encoding="utf-8"
    )
    importance.to_csv(REPORTS / "feature_importance.csv", index=False)

    save_calibration(payloads, y_test, "en")
    save_precision_recall(payloads, y_test, "en")
    save_calibration(payloads, y_test, "pt")
    save_precision_recall(payloads, y_test, "pt")
    print(f"\nwrote {REPORTS.relative_to(PROJECT)}/model_metrics.json")
    print(f"wrote {REPORTS.relative_to(PROJECT)}/feature_importance.csv")
    print(f"wrote figures to {FIGURES}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
