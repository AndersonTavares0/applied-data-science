-- The model's label must agree with the delivery event. A non-null `is_late`
-- on an order with no delivery timestamp, or a null label on one that was
-- delivered, would silently move orders between the training set and the
-- excluded set and change every metric in Project 02.
select *
from {{ ref('mart_order_features') }}
where (days_late is null) <> (is_late is null)
   or (days_late is not null and promise_days is null)
