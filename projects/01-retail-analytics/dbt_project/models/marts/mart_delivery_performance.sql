-- Satisfaction by delivery outcome. This is the headline table of the project.
--
-- Buckets are defined by lateness against the ESTIMATE the customer was shown,
-- not by absolute delivery time, because that is the promise the customer
-- experienced and reacted to. A 20-day delivery promised in 25 days is a kept
-- promise; a 5-day delivery promised in 4 is a broken one.
--
-- Lateness is counted in whole days (`days_late`), because every estimate in
-- the source is stored as a date at midnight — so the promise never had a time
-- of day to be late against.
--
-- "no delivery timestamp" is not one experience. Cancelled and unavailable
-- orders are closed events; shipped, invoiced and processing orders are still
-- open at the end of the snapshot; a handful of orders are marked delivered but
-- carry no delivery timestamp. They are kept as separate buckets instead of
-- being filtered out, because for the customer they are not "on time" — but
-- collapsing them into a single "never delivered" label would mix a refund with
-- a parcel still in transit.
--
-- `bucket_order` exists so charts sort by severity rather than alphabetically.

with bucketed as (

    select
        case
            when is_late is null and order_status in ('canceled', 'unavailable')
                then 'not delivered: cancelled or unavailable'
            when is_late is null and order_status = 'delivered'
                then 'delivered: missing timestamp'
            when is_late is null
                then 'not delivered: still open'
            when not is_late         then 'on time'
            when days_late <= 7      then 'late: up to 7 days'
            when days_late <= 14     then 'late: 8 to 14 days'
            else 'late: more than 14 days'
        end as delivery_bucket,

        case
            when is_late is null and order_status in ('canceled', 'unavailable') then 4
            when is_late is null and order_status = 'delivered' then 6
            when is_late is null then 5
            when not is_late         then 0
            when days_late <= 7      then 1
            when days_late <= 14     then 2
            else 3
        end as bucket_order,

        review_score,
        delivery_days

    from {{ ref('fct_orders') }}

)

select
    delivery_bucket,
    min(bucket_order)                                  as bucket_order,
    count(*)                                           as orders,
    round(100.0 * count(*) / sum(count(*)) over (), 2) as pct_of_orders,
    count(*) filter (where review_score is not null)    as reviewed_orders,
    round(avg(review_score), 3)                        as avg_review_score,
    round(
        100.0 * count(*) filter (where review_score <= 2)
        / nullif(count(*) filter (where review_score is not null), 0),
        2
    )                                                  as pct_review_score_le2,
    round(avg(delivery_days), 2)                       as avg_delivery_days

from bucketed
group by delivery_bucket
