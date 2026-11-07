-- A negative promise means the estimated date precedes the purchase. That is
-- not a modelling choice to make; it is corrupt data and must fail the build.
select *
from {{ ref('mart_order_features') }}
where promise_days < 0
