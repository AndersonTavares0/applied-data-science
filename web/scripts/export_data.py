#!/usr/bin/env python
"""Export the published aggregates the React site renders.

The website must build without PostgreSQL, so this script is the only thing
that touches the database and its output is committed. It reads the tested
marts plus the Project 02/03 report artifacts; it never queries raw tables and
it never invents a number.

    uv run python web/scripts/export_data.py
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "projects" / "01-retail-analytics" / "src"
sys.path.insert(0, str(SRC))

import pandas as pd  # noqa: E402
from retail.config import get_settings  # noqa: E402
from retail.io import build_engine  # noqa: E402
from sqlalchemy import text  # noqa: E402

OUT = REPO / "web" / "src" / "data"
P02 = REPO / "projects" / "02-late-delivery" / "reports"
P03 = REPO / "projects" / "03-voice-of-customer" / "reports"


def read(conn, sql: str) -> list[dict]:
    """Rows as JSON-safe primitives, with numpy scalars unwrapped."""
    frame = pd.read_sql(text(sql), conn)
    return json.loads(frame.to_json(orient="records", date_format="iso"))


def write(name: str, payload: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(REPO)}")


def p01(conn) -> dict:
    totals = read(
        conn,
        """
        select round(sum(order_value), 2) as revenue_brl,
               count(*) as orders,
               count(distinct customer_unique_id) as customers,
               round(avg(order_value), 2) as avg_order_value_brl,
               round(sum(freight_value), 2) as freight_brl,
               round(100.0 * sum(freight_value) / sum(order_value), 2) as freight_share_pct
        from analytics_marts.fct_orders
        """,
    )[0]
    delivery = read(
        conn,
        """
        select count(*) filter (where is_late) as late_orders,
               count(*) filter (where is_late is not null) as delivered_orders,
               round(100.0 * count(*) filter (where is_late)
                     / count(*) filter (where is_late is not null), 2) as late_pct,
               round(avg(review_score) filter (where is_late), 3) as late_review,
               round(avg(review_score) filter (where is_late = false), 3) as on_time_review
        from analytics_marts.fct_orders
        """,
    )[0]
    early = read(
        conn,
        """
        select round(avg(estimated_delivery_at::date - delivered_to_customer_at::date), 2)
               as avg_days_early
        from analytics_marts.fct_orders
        where delivered_to_customer_at is not null
        """,
    )[0]
    repeat = read(
        conn,
        """
        select count(*) as customers,
               count(*) filter (where frequency = 1) as one_order_customers,
               count(*) filter (where frequency > 1) as repeat_customers,
               round(100.0 * count(*) filter (where frequency = 1) / count(*), 2)
                   as one_order_pct,
               round(100.0 * count(*) filter (where frequency > 1) / count(*), 2)
                   as repeat_pct,
               round(sum(monetary), 2) as revenue_brl,
               round(sum(monetary) filter (where frequency = 1), 2) as one_order_revenue_brl,
               round(100.0 * sum(monetary) filter (where frequency = 1) / sum(monetary), 1)
                   as one_order_revenue_pct
        from analytics_marts.mart_rfm
        """,
    )[0]
    return {
        "totals": totals,
        "deliverySummary": {**delivery, **early},
        "repeatSummary": repeat,
        "revenueMonthly": read(
            conn,
            """
            select month, orders, active_customers, round(revenue_brl, 2) as revenue_brl,
                   round(freight_brl, 2) as freight_brl,
                   round(avg_order_value_brl, 2) as avg_order_value_brl
            from analytics_marts.mart_revenue_monthly order by month
            """,
        ),
        "categories": read(
            conn,
            """
            select category, orders, items, round(revenue_brl, 2) as revenue_brl,
                   round(avg_item_price_brl, 2) as avg_item_price_brl
            from analytics_marts.mart_category_revenue order by revenue_brl desc
            """,
        ),
        "deliveryBuckets": read(
            conn,
            """
            select delivery_bucket, bucket_order, orders, pct_of_orders,
                   reviewed_orders, avg_review_score, pct_review_score_le2,
                   avg_delivery_days
            from analytics_marts.mart_delivery_performance order by bucket_order
            """,
        ),
        "states": read(
            conn,
            """
            select customer_state, delivered_orders, late_orders, late_pct,
                   avg_delivery_days, avg_review_score
            from analytics_marts.mart_late_delivery_by_state
            where delivered_orders >= 1000 order by late_pct desc
            """,
        ),
        "lanes": read(
            conn,
            """
            select lane, seller_state, customer_state, is_intrastate,
                   delivered_orders, late_orders, late_pct, avg_handling_days,
                   avg_transit_days, avg_delivery_days, p50_delivery_days,
                   p90_delivery_days, promised_days, avg_days_late_when_late,
                   orders_over_2w_late, late_pct_if_promise_plus3,
                   late_pct_if_promise_plus7
            from analytics_marts.mart_late_delivery_by_lane
            where delivered_orders >= 250 order by late_pct desc
            """,
        ),
        "cohort": read(
            conn,
            """
            select month_offset, count(distinct cohort_month) as cohorts,
                   sum(cohort_customers) as eligible_customers,
                   sum(active_customers) as active_customers,
                   round(100.0 * sum(active_customers) / sum(cohort_customers), 2)
                       as retention_pct
            from analytics_marts.mart_cohort_retention
            group by month_offset order by month_offset
            """,
        ),
        "repeatDistribution": read(
            conn,
            """
            select frequency, count(*) as customers
            from analytics_marts.mart_rfm group by frequency order by frequency
            """,
        ),
        "rfm": read(
            conn,
            """
            select rfm_segment, count(*) as customers,
                   round(100.0 * count(*) / sum(count(*)) over (), 2) as share_pct,
                   round(avg(monetary), 2) as avg_spend_brl,
                   round(avg(recency_days), 0) as avg_recency_days
            from analytics_marts.mart_rfm group by rfm_segment order by customers desc
            """,
        ),
        "orderStatus": read(
            conn,
            """
            select order_status, count(*) as orders, round(sum(order_value), 2) as revenue_brl,
                   round(100.0 * sum(order_value)
                         / (select sum(order_value) from analytics_marts.fct_orders), 2)
                       as share_pct
            from analytics_marts.fct_orders group by order_status order by revenue_brl desc
            """,
        ),
    }


def p02() -> dict:
    metrics = json.loads((P02 / "model_metrics.json").read_text(encoding="utf-8"))
    with (P02 / "feature_importance.csv").open(encoding="utf-8") as handle:
        importance = [
            {"feature": row["feature"], "importance": float(row["importance"])}
            for row in csv.DictReader(handle)
        ]
    return {**metrics, "importance": importance}


def p03() -> dict:
    scope = json.loads((P03 / "review_scope.json").read_text(encoding="utf-8"))
    csvs = {}
    for name in (
        "topic_prevalence",
        "topic_groups",
        "topic_groups_k4",
        "topic_selection",
        "topic_terms",
    ):
        frame = pd.read_csv(P03 / f"{name}.csv")
        csvs[name] = json.loads(frame.to_json(orient="records"))
    return {**scope, "tables": csvs}


def main() -> int:
    settings = get_settings()
    engine = build_engine(settings)
    with engine.connect() as conn:
        write("p01.json", p01(conn))
    write("p02.json", p02())
    write("p03.json", p03())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
