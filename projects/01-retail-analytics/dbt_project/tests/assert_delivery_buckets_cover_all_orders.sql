-- Every order must land in exactly one delivery bucket. A bucket that is
-- accidentally dropped (for example, the old single "never delivered" row)
-- would make the table's shares look complete while silently losing orders.

with bucket_total as (

    select sum(orders) as bucketed_orders
    from {{ ref('mart_delivery_performance') }}

),

order_total as (

    select count(*) as orders
    from {{ ref('fct_orders') }}

)

select *
from bucket_total
cross join order_total
where bucket_total.bucketed_orders <> order_total.orders
