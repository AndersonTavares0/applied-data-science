#!/usr/bin/env python
"""Render the charts used by the Project 01 reports.

The charts are written as committed PNGs rather than generated during the site
build. That is deliberate: the publish workflow has no database and no dataset,
so anything the site needs to display has to already exist in the repository.

Every chart is drawn twice, once in English and once in Portuguese, because the
website is published in both languages and an English axis label inside a
Portuguese page reads as unfinished. The data is fetched once and only the
strings differ, so the two sets cannot drift apart.

Run it with `uv run python tasks.py charts`, which is what sets `PYTHONPATH` so
that `retail` is importable.
"""

# ruff: noqa: E501
from __future__ import annotations

import sys
from pathlib import Path

# Allow running this file directly, before the package is installed.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

import matplotlib  # noqa: E402

matplotlib.use("Agg")

import matplotlib.dates as mdates  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402
from matplotlib.lines import Line2D  # noqa: E402
from matplotlib.patches import Patch  # noqa: E402
from matplotlib.ticker import FuncFormatter  # noqa: E402
from retail.chart_style import (  # noqa: E402
    ACCENT,
    MUTED,
    PRIMARY,
    SOFT,
    add_source,
    add_title,
    apply_style,
    brl_millions,
    reference_line,
    style_axes,
)
from retail.config import REPO_ROOT, get_settings  # noqa: E402
from retail.io import build_engine  # noqa: E402

FIGURES_DIR = REPO_ROOT / "site" / "reports" / "01-retail-analytics" / "figures"
LANGS = ("en", "pt")

apply_style()

# Human labels for the marketplace's snake_case category vocabulary. Keeping the
# raw value in the data and the readable label in the chart avoids translating
# the key that the SQL and the data dictionary use.
CATEGORY_LABELS = {
    "health_beauty": "Health & beauty",
    "watches_gifts": "Watches & gifts",
    "bed_bath_table": "Bed, bath & table",
    "sports_leisure": "Sports & leisure",
    "computers_accessories": "Computers & accessories",
    "furniture_decor": "Furniture & decor",
    "cool_stuff": "Cool stuff",
    "housewares": "Housewares",
    "auto": "Auto",
    "garden_tools": "Garden tools",
    "toys": "Toys",
    "baby": "Baby",
}
CATEGORY_LABELS_PT = {
    "health_beauty": "Saúde & beleza",
    "watches_gifts": "Relógios & presentes",
    "bed_bath_table": "Cama, mesa & banho",
    "sports_leisure": "Esporte & lazer",
    "computers_accessories": "Informática & acessórios",
    "furniture_decor": "Móveis & decoração",
    "cool_stuff": "Utilidades",
    "housewares": "Casa & cozinha",
    "auto": "Automotivo",
    "garden_tools": "Jardim & ferramentas",
    "toys": "Brinquedos",
    "baby": "Bebê",
}

STRINGS = {
    "en": {
        "revenue_title": "Monthly revenue",
        "revenue_sub": "Gross payment value, excluding the three near-empty edge months",
        "revenue_note": "Excluded: Sep 2016 and Sep–Oct 2018 ({orders} orders). Bars are months, not a continuous series.",
        "revenue_ylabel": "Revenue (R$ millions)",
        "black_friday": "Black Friday",
        "categories_title": "The categories that carry the marketplace",
        "categories_sub": "Top 12 by item revenue; share is of all item revenue",
        "categories_note": "Labels show item revenue and average item price. Freight is excluded.",
        "delivery_title": "Average review score by delivery outcome",
        "delivery_sub": "Mean of the latest review per delivered order; lower is worse",
        "delivery_note": "Bars show mean score and share of reviews at 2 stars or below. n is the number of orders.",
        "share_le2": "{value:.0f}%\n≤2 stars",
        "buckets": {
            "on time": "On time",
            "late: up to 7 days": "Late\n0–7 days",
            "late: 8 to 14 days": "Late\n8–14 days",
            "late: more than 14 days": "Late\n>14 days",
            "not delivered: cancelled or unavailable": "Cancelled or\nunavailable",
            "not delivered: still open": "Still open\nat snapshot",
            "delivered: missing timestamp": "Delivered,\nno timestamp",
        },
        "state_title": "Late delivery by customer state",
        "state_sub": "States with at least 1,000 delivered orders; dashed line is the national rate",
        "state_note": "Late = delivered after the promised date. n is the number of delivered orders.",
        "state_label": "{pct:.1f}%  ({orders:,})",
        "lane_title": "Late delivery by seller → customer lane",
        "lane_sub": "Lanes with at least 900 delivered orders; dashed line is the national rate",
        "lane_note": "Blue = seller and customer in the same state. Late = delivered after the promised date.",
        "lane_label": "{pct:.1f}%  ({orders:,})",
        "cohort_title": "Repeat purchase in the next calendar month",
        "cohort_sub": "Share of each cohort ordering again, by calendar-month offset",
        "cohort_note": "Eligible customers shown under each offset. This is not 30-day retention; later offsets use older cohorts only.",
        "repeat_title": "How often customers come back",
        "repeat_sub": "Customer count on a log scale; 5+ combines 5, 6, 7, 9 and 17 orders",
        "repeat_note": "One order per customer is the overwhelming majority. Counts are customers, not orders.",
        "repeat_x": "Customers (log scale)",
        "status_title": "What the revenue figure includes",
        "status_sub": "Recorded payment value by order status; log scale",
        "status_note": "Amber = cancelled or unavailable. A payment was recorded, so it is counted in revenue.",
        "status_x": "Recorded payment value (R$, log scale)",
        "status_cancelled": "Cancelled or unavailable",
        "status_other": "Other statuses",
        "national": "National {pct:.1f}%",
        "same_state": "Same state",
        "interstate": "Interstate",
        "sp": "São Paulo (largest market)",
        "other": "Other states",
        "n_label": "n={orders:,}",
        "share": "{pct:.1f}%",
        "revenue_peak": "R$ {value:.2f}m",
        "avg_item": "avg item R$ {value:,.0f}",
        "customers": "{value:,}",
        "customer_share": "{pct:.2f}% of customers",
        "late": "Late",
        "not_delivered": "Not delivered",
        "missing": "Missing outcome",
        "on_time": "On time",
    },
    "pt": {
        "revenue_title": "Receita mensal",
        "revenue_sub": "Valor bruto de pagamentos, sem os três meses de borda quase vazios",
        "revenue_note": "Excluídos: set 2016 e set–out 2018 ({orders} pedidos). As barras são meses, não uma série contínua.",
        "revenue_ylabel": "Receita (R$ milhões)",
        "black_friday": "Black Friday",
        "categories_title": "As categorias que sustentam o marketplace",
        "categories_sub": "12 maiores por receita de itens; participação sobre toda a receita de itens",
        "categories_note": "Rótulos mostram receita de itens e preço médio do item. Frete não entra.",
        "delivery_title": "Nota média da avaliação por resultado da entrega",
        "delivery_sub": "Média da avaliação mais recente por pedido entregue; menor é pior",
        "delivery_note": "Barras mostram nota média e participação de notas ≤2. n é o número de pedidos.",
        "share_le2": "{value:.0f}%\n≤2 estrelas",
        "buckets": {
            "on time": "No prazo",
            "late: up to 7 days": "Atraso\n0–7 dias",
            "late: 8 to 14 days": "Atraso\n8–14 dias",
            "late: more than 14 days": "Atraso\n>14 dias",
            "not delivered: cancelled or unavailable": "Cancelado ou\nindisponível",
            "not delivered: still open": "Em aberto\nno snapshot",
            "delivered: missing timestamp": "Entregue,\nsem data",
        },
        "state_title": "Atraso por estado do cliente",
        "state_sub": "Estados com ao menos 1.000 entregas; linha tracejada é a taxa nacional",
        "state_note": "Atraso = entrega após a data prometida. n é o número de pedidos entregues.",
        "state_label": "{pct:.1f}%  ({orders:,})",
        "lane_title": "Atraso por rota vendedor → cliente",
        "lane_sub": "Rotas com ao menos 900 entregas; linha tracejada é a taxa nacional",
        "lane_note": "Azul = vendedor e cliente no mesmo estado. Atraso = entrega após a data prometida.",
        "lane_label": "{pct:.1f}%  ({orders:,})",
        "cohort_title": "Recompra no mês calendário seguinte",
        "cohort_sub": "Participação de cada coorte que volta a comprar, por mês de calendário",
        "cohort_note": "Clientes elegíveis sob cada mês. Não é retenção de 30 dias; meses distantes usam só coortes antigas.",
        "repeat_title": "Com que frequência o cliente volta",
        "repeat_sub": "Clientes em escala log; 5+ agrupa 5, 6, 7, 9 e 17 pedidos",
        "repeat_note": "Um pedido por cliente é a maioria absoluta. Contagens são clientes, não pedidos.",
        "repeat_x": "Clientes (escala log)",
        "status_title": "O que a receita inclui",
        "status_sub": "Valor de pagamento registrado por status; escala log",
        "status_note": "Âmbar = cancelado ou indisponível. Houve pagamento, então entra na receita.",
        "status_x": "Valor de pagamento registrado (R$, escala log)",
        "status_cancelled": "Cancelado ou indisponível",
        "status_other": "Outros status",
        "national": "Brasil {pct:.1f}%",
        "same_state": "Mesmo estado",
        "interstate": "Interestadual",
        "sp": "São Paulo (maior mercado)",
        "other": "Outros estados",
        "n_label": "n={orders:,}",
        "share": "{pct:.1f}%",
        "revenue_peak": "R$ {value:.2f} mi",
        "avg_item": "item médio R$ {value:,.0f}",
        "customers": "{value:,}",
        "customer_share": "{pct:.2f}% dos clientes",
        "late": "Atrasado",
        "not_delivered": "Não entregue",
        "missing": "Sem resultado",
        "on_time": "No prazo",
    },
}


def read(engine, sql: str) -> pd.DataFrame:
    return pd.read_sql(sql, engine)


def load_data(engine) -> dict[str, pd.DataFrame]:
    """Query every series once, so both language builds plot the same numbers."""
    return {
        "revenue": read(
            engine,
            """
            select month, orders, revenue_brl
            from analytics_marts.mart_revenue_monthly
            order by month
            """,
        ),
        "categories": read(
            engine,
            """
            select category, revenue_brl, avg_item_price_brl
            from analytics_marts.mart_category_revenue
            order by revenue_brl desc
            limit 12
            """,
        ),
        "delivery": read(
            engine,
            """
            select delivery_bucket, bucket_order, orders, pct_of_orders,
                   avg_review_score, pct_review_score_le2
            from analytics_marts.mart_delivery_performance
            order by bucket_order
            """,
        ),
        "states": read(
            engine,
            """
            select customer_state, delivered_orders, late_orders, late_pct
            from analytics_marts.mart_late_delivery_by_state
            where delivered_orders >= 1000
            order by late_pct
            """,
        ),
        "lanes": read(
            engine,
            """
            -- Ordered ascending so the worst lane lands at the top of a barh
            -- chart. `is_intrastate` drives the colour: it is the comparison that
            -- makes the point, because intrastate lanes with volume are fine.
            -- 900 rather than 1,000 so RJ -> RJ (946 deliveries) survives the cut.
            select lane, is_intrastate, delivered_orders, late_pct
            from analytics_marts.mart_late_delivery_by_lane
            where delivered_orders >= 900
            order by late_pct
            """,
        ),
        "cohort": read(
            engine,
            """
            select month_offset,
                   count(distinct cohort_month) as cohorts,
                   sum(active_customers) as active_customers,
                   sum(cohort_customers) as eligible_customers,
                   round(100.0 * sum(active_customers) / sum(cohort_customers), 2) as retention_pct
            from analytics_marts.mart_cohort_retention
            where month_offset between 1 and 12
            group by month_offset
            order by month_offset
            """,
        ),
        "repeat": read(
            engine,
            """
            select frequency, count(*) as customers
            from analytics_marts.mart_rfm
            group by frequency
            order by frequency
            """,
        ),
        "status": read(
            engine,
            """
            select order_status, count(*) as orders, sum(order_value) as revenue
            from analytics_marts.fct_orders
            group by order_status
            order by revenue desc
            """,
        ),
        "national": read(
            engine,
            """
            select 100.0 * avg(case when is_late then 1 else 0 end) as late_pct
            from analytics_marts.fct_orders
            where is_late is not null
            """,
        ),
    }


def save(fig: plt.Figure, lang: str, name: str) -> None:
    directory = FIGURES_DIR if lang == "en" else FIGURES_DIR / lang
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / name
    fig.savefig(path, bbox_inches="tight", pad_inches=0.16)
    plt.close(fig)
    print(f"  wrote {path.relative_to(REPO_ROOT)}")


def _national(data) -> float:
    return float(data["national"].iloc[0]["late_pct"])


def _xlim_with_labels(ax, values, padding: float = 0.24) -> None:
    upper = max(values) * (1 + padding)
    ax.set_xlim(0, upper)


def chart_revenue_monthly(data, s, lang: str) -> None:
    """Monthly revenue over the period the marketplace was actually trading."""
    df = data["revenue"].copy()
    df["month"] = pd.to_datetime(df["month"])

    window = (df["month"] >= pd.Timestamp("2016-10-01")) & (
        df["month"] <= pd.Timestamp("2018-08-31")
    )
    excluded_orders = int(df.loc[~window, "orders"].sum())
    df = df.loc[window].copy()

    fig, ax = plt.subplots(figsize=(8.6, 4.0), layout="constrained")
    ax.bar(df["month"], df["revenue_brl"], color=PRIMARY, width=20)
    style_axes(ax, grid_axis="y")
    add_title(ax, s["revenue_title"], s["revenue_sub"])
    ax.set_ylabel(s["revenue_ylabel"])
    ax.yaxis.set_major_formatter(FuncFormatter(lambda value, _pos: f"R$ {value / 1e6:.1f}m"))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    ax.tick_params(axis="x", rotation=0, labelsize=8)

    peak_row = df.loc[df["revenue_brl"].idxmax()]
    peak = mdates.date2num(peak_row["month"])
    peak_value = float(peak_row["revenue_brl"])
    ax.set_ylim(0, peak_value * 1.18)
    ax.annotate(
        f"{s['black_friday']}: {s['revenue_peak'].format(value=peak_value / 1e6)}",
        xy=(peak, peak_value),
        xytext=(0.62, 0.73),
        textcoords="axes fraction",
        ha="left",
        va="center",
        color=ACCENT,
        fontsize=8.5,
        fontweight="semibold",
        arrowprops={"arrowstyle": "-", "color": ACCENT, "lw": 1.2, "shrinkA": 4},
    )
    ax.text(
        0.01,
        0.97,
        s["revenue_note"].format(orders=excluded_orders),
        transform=ax.transAxes,
        ha="left",
        va="top",
        fontsize=7.8,
        color=SOFT,
    )
    save(fig, lang, "revenue-monthly.png")


def chart_top_categories(data, s, lang: str) -> None:
    """The categories that carry the revenue, with their share of the total."""
    df = data["categories"].iloc[::-1].copy()
    labels = [
        (CATEGORY_LABELS if lang == "en" else CATEGORY_LABELS_PT).get(category, category)
        for category in df["category"]
    ]
    total = float(df["revenue_brl"].sum())

    fig, ax = plt.subplots(figsize=(8.4, 4.8), layout="constrained")
    ax.barh(labels, df["revenue_brl"], color=PRIMARY, height=0.68)
    style_axes(ax, grid_axis="x")
    add_title(ax, s["categories_title"], s["categories_sub"])
    ax.set_xlabel("Item revenue (R$ millions)")
    ax.xaxis.set_major_formatter(FuncFormatter(lambda value, _pos: f"R$ {value / 1e6:.1f}m"))

    for y, (value, price) in enumerate(
        zip(df["revenue_brl"], df["avg_item_price_brl"], strict=True)
    ):
        ax.text(
            value + total * 0.012,
            y,
            f"{brl_millions(value)}  ·  {100 * value / total:.1f}%  ·  {s['avg_item'].format(value=price)}",
            va="center",
            fontsize=7.8,
            color=SOFT,
        )
    ax.set_xlim(0, max(df["revenue_brl"]) * 1.35)
    add_source(fig, s["categories_note"])
    save(fig, lang, "top-categories.png")


def chart_delivery_review(data, s, lang: str) -> None:
    """The strongest relationship in the dataset, with its denominators."""
    df = data["delivery"].copy()
    labels = [s["buckets"][b] for b in df["delivery_bucket"]]

    def colour(bucket: str) -> str:
        if bucket == "on time":
            return PRIMARY
        if bucket.startswith("late"):
            return ACCENT
        if bucket.startswith("not delivered"):
            return SOFT
        return MUTED

    colours = [colour(bucket) for bucket in df["delivery_bucket"]]
    hatches = [
        "//" if bucket.startswith("not delivered") else ".." if "missing" in bucket else ""
        for bucket in df["delivery_bucket"]
    ]

    df = df.iloc[::-1].reset_index(drop=True)
    labels = [s["buckets"][b] for b in df["delivery_bucket"]]
    colours = colours[::-1]
    hatches = hatches[::-1]

    fig, ax = plt.subplots(figsize=(8.8, 4.9), layout="constrained")
    bars = ax.barh(labels, df["avg_review_score"], color=colours, height=0.62)
    for bar, hatch in zip(bars, hatches, strict=True):
        bar.set_hatch(hatch)
    style_axes(ax, grid_axis="x")
    add_title(ax, s["delivery_title"], s["delivery_sub"])
    ax.set_xlabel("Average review score (0–5)")
    ax.set_xlim(0, 6.3)
    ax.set_xticks([0, 1, 2, 3, 4, 5])
    ax.tick_params(axis="y", labelsize=7.8, length=0)

    for bar, score, bad, orders in zip(
        bars,
        df["avg_review_score"],
        df["pct_review_score_le2"],
        df["orders"],
        strict=True,
    ):
        ax.text(
            score + 0.10,
            bar.get_y() + bar.get_height() / 2,
            f"{score:.2f}  ·  {bad:.0f}% ≤2  ·  n={orders:,}",
            va="center",
            fontsize=7.6,
            color=SOFT,
        )

    handles = [
        Patch(facecolor=PRIMARY, label=s["on_time"]),
        Patch(facecolor=ACCENT, label=s["late"]),
        Patch(facecolor=SOFT, hatch="//", label=s["not_delivered"]),
        Patch(facecolor=MUTED, hatch="..", label=s["missing"]),
    ]
    ax.legend(handles=handles, frameon=False, ncol=4, loc="lower right", fontsize=7.4)
    add_source(fig, s["delivery_note"])
    save(fig, lang, "delivery-review.png")


def chart_late_by_state(data, s, lang: str) -> None:
    """Lateness is geographic, and it is not a small difference."""
    df = data["states"]
    national = _national(data)

    fig, ax = plt.subplots(figsize=(8.4, 5.2), layout="constrained")
    colours = [PRIMARY if state == "SP" else SOFT for state in df["customer_state"]]
    ax.barh(df["customer_state"], df["late_pct"], color=colours, height=0.68)
    style_axes(ax, grid_axis="x")
    add_title(ax, s["state_title"], s["state_sub"])
    ax.set_xlabel("Delivered after the promised date (%)")
    ax.set_xlim(0, max(df["late_pct"]) * 1.32)
    reference_line(ax, national, s["national"].format(pct=national))

    for y, (pct, orders) in enumerate(zip(df["late_pct"], df["delivered_orders"], strict=True)):
        ax.text(
            pct + 0.18,
            y,
            s["state_label"].format(pct=pct, orders=orders),
            va="center",
            fontsize=7.8,
            color=SOFT,
        )

    handles = [
        Patch(facecolor=PRIMARY, label=s["sp"]),
        Patch(facecolor=SOFT, label=s["other"]),
    ]
    ax.legend(handles=handles, frameon=False, loc="lower right", fontsize=7.8)
    add_source(fig, s["state_note"])
    save(fig, lang, "late-by-state.png")


def chart_lane_late(data, s, lang: str) -> None:
    """Lateness belongs to the route, not to the seller or the destination."""
    df = data["lanes"]
    national = _national(data)

    fig, ax = plt.subplots(figsize=(8.6, 5.8), layout="constrained")
    colours = [PRIMARY if same else ACCENT for same in df["is_intrastate"]]
    ax.barh(df["lane"], df["late_pct"], color=colours, height=0.68)
    style_axes(ax, grid_axis="x")
    add_title(ax, s["lane_title"], s["lane_sub"])
    ax.set_xlabel("Delivered after the promised date (%)")
    ax.set_xlim(0, max(df["late_pct"]) * 1.34)
    reference_line(ax, national, s["national"].format(pct=national))

    for y, (pct, orders) in enumerate(zip(df["late_pct"], df["delivered_orders"], strict=True)):
        ax.text(
            pct + 0.22,
            y,
            s["lane_label"].format(pct=pct, orders=orders),
            va="center",
            fontsize=7.7,
            color=SOFT,
        )

    handles = [
        Patch(facecolor=PRIMARY, label=s["same_state"]),
        Patch(facecolor=ACCENT, label=s["interstate"]),
    ]
    ax.legend(handles=handles, frameon=False, loc="lower right", fontsize=7.8)
    add_source(fig, s["lane_note"])
    save(fig, lang, "lane-late.png")


def chart_cohort_retention(data, s, lang: str) -> None:
    """Retention starts low and stays there; show who is eligible at each offset."""
    df = data["cohort"]

    fig, ax = plt.subplots(figsize=(8.8, 4.2), layout="constrained")
    offsets = df["month_offset"].astype(int)
    tick_labels = [
        f"{offset}\n{eligible / 1000:,.0f}k"
        for offset, eligible in zip(offsets, df["eligible_customers"], strict=True)
    ]
    ax.bar(offsets.astype(str), df["retention_pct"], color=PRIMARY, width=0.62)
    ax.set_xticks(offsets.astype(str), tick_labels, fontsize=7.5)
    style_axes(ax, grid_axis="y")
    add_title(ax, s["cohort_title"], s["cohort_sub"])
    ax.set_xlabel("Calendar months after the first order")
    ax.set_ylabel("Ordered again (%)")
    ax.set_ylim(0, max(df["retention_pct"]) * 1.45)

    for x, pct in zip(offsets.astype(str), df["retention_pct"], strict=True):
        ax.annotate(
            f"{pct:.2f}%",
            (x, pct),
            textcoords="offset points",
            xytext=(0, 4),
            ha="center",
            fontsize=8,
            color=SOFT,
        )
    add_source(fig, s["cohort_note"])
    save(fig, lang, "cohort-retention.png")


def chart_repeat_purchase(data, s, lang: str) -> None:
    """The number that reframes the whole analysis."""
    df = data["repeat"].copy()
    df["bucket"] = df["frequency"].map(lambda n: str(n) if n <= 4 else "5+")
    grouped = df.groupby("bucket", sort=False)["customers"].sum()
    total = grouped.sum()

    fig, ax = plt.subplots(figsize=(7.8, 3.9), layout="constrained")
    positions = list(range(len(grouped)))
    values = grouped.to_numpy()
    ax.hlines(positions, 1, values, color=MUTED, linewidth=2)
    ax.plot(values, positions, "o", color=PRIMARY, markersize=9)
    ax.set_xscale("log")
    style_axes(ax, grid_axis="x")
    add_title(ax, s["repeat_title"], s["repeat_sub"])
    ax.set_yticks(positions, grouped.index)
    ax.set_xlabel(s["repeat_x"])
    ax.set_xlim(1, max(values) * 10)
    ax.set_xticks([1, 10, 100, 1_000, 10_000], ["1", "10", "100", "1k", "10k"])
    ax.tick_params(axis="y", length=0)

    for y, value in zip(positions, values, strict=True):
        ax.text(
            value * 1.35,
            y,
            f"{s['customers'].format(value=value)}  ·  {s['customer_share'].format(pct=100 * value / total)}",
            va="center",
            fontsize=8,
            color=SOFT,
        )
    add_source(fig, s["repeat_note"])
    save(fig, lang, "repeat-purchase.png")


def chart_order_status(data, s, lang: str) -> None:
    """What the revenue figure includes, so nobody has to assume."""
    df = data["status"].copy()
    df["revenue"] = df["revenue"].fillna(0)
    cancelled = df["order_status"].isin(["canceled", "unavailable"])

    fig, ax = plt.subplots(figsize=(8.4, 4.1), layout="constrained")
    positions = list(range(len(df)))
    colours = [ACCENT if value else PRIMARY for value in cancelled]
    ax.scatter(
        df["revenue"],
        positions,
        c=colours,
        s=64,
        edgecolors="white",
        linewidths=0.8,
        zorder=3,
    )
    ax.set_xscale("log")
    style_axes(ax, grid_axis="x")
    add_title(ax, s["status_title"], s["status_sub"])
    ax.set_yticks(positions, df["order_status"])
    ax.set_xlabel(s["status_x"])
    ax.set_xlim(0.8, max(df["revenue"]) * 4.0)
    ax.set_xticks([1, 100, 10_000, 1_000_000, 10_000_000])
    ax.set_xticklabels(["R$1", "R$100", "R$10k", "R$1m", "R$10m"])

    def money(value: float) -> str:
        if value >= 1_000_000:
            return f"R$ {value / 1_000_000:.1f}m"
        if value >= 1_000:
            return f"R$ {value / 1_000:.0f}k"
        return f"R$ {value:.0f}"

    for y, (value, orders) in enumerate(zip(df["revenue"], df["orders"], strict=True)):
        ax.text(
            value * 1.35,
            y,
            f"{money(value)}  ·  {orders:,} orders",
            va="center",
            fontsize=7.8,
            color=SOFT,
        )

    handles = [
        Line2D([0], [0], marker="o", color="none", markerfacecolor=ACCENT, markersize=8),
        Line2D([0], [0], marker="o", color="none", markerfacecolor=PRIMARY, markersize=8),
    ]
    ax.legend(
        handles,
        [s["status_cancelled"], s["status_other"]],
        frameon=False,
        loc="lower right",
        fontsize=7.8,
    )
    add_source(fig, s["status_note"])
    save(fig, lang, "order-status.png")


CHARTS = (
    chart_revenue_monthly,
    chart_top_categories,
    chart_delivery_review,
    chart_late_by_state,
    chart_lane_late,
    chart_cohort_retention,
    chart_repeat_purchase,
    chart_order_status,
)


def main() -> int:
    settings = get_settings()
    engine = build_engine(settings)
    data = load_data(engine)
    print(f"writing charts to {FIGURES_DIR.relative_to(REPO_ROOT)}")
    for lang in LANGS:
        for chart in CHARTS:
            chart(data, STRINGS[lang], lang)
        print(f"done. {len(CHARTS)} charts ({lang}).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
