-- Retention is a share of a cohort: it cannot be negative, exceed the cohort,
-- or contain more active customers than the cohort has. A zero-activity offset
-- is legitimate and must stay in the table, so the test checks the bounds rather
-- than requiring a minimum.

select
    cohort_month,
    month_offset,
    cohort_customers,
    active_customers,
    retention_pct

from {{ ref('mart_cohort_retention') }}
where retention_pct < 0
   or retention_pct > 100
   or active_customers < 0
   or active_customers > cohort_customers
