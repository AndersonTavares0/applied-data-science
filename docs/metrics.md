# Metrics

Every number in the report, defined once. Where two of these could reasonably be
computed differently, the difference is stated — because that difference is
usually the reason two people disagree about the same dataset.

All monetary values are in Brazilian reais (R$), as recorded in the source.

---

## Revenue

**Definition.** The sum of `payment_value` across every payment row for an order,
aggregated to the order first, then summed by month. Computed in
`mart_revenue_monthly.revenue_brl`.

**This is gross merchandise value as recorded by the payment system.** It is not
profit, not margin, and not net of anything — this dataset contains no cost data,
no returns and no refunds.

**It includes orders that were later cancelled or marked unavailable**, because a
payment was recorded for them. That is roughly 3% of orders. The report states
this rather than implying that "revenue" means delivered-and-kept revenue.

**It includes freight**, which is what the customer actually paid. Where freight
must be excluded, `mart_category_revenue.revenue_brl` uses item price only — see
below.

---

## Order value

**Definition.** `fct_orders.order_value` — the same payment total as above, at the
order grain. NULL for orders with no payment row (there is exactly one such order
in this dataset).

**A missing amount is not a zero amount.** Leaving it NULL keeps it out of
averages instead of pulling them down with an order that was never paid.

---

## Average order value

**Definition.** `mart_revenue_monthly.avg_order_value_brl` = mean `order_value`
across the orders in that month.

**Read it as an average over orders placed, not over orders completed.** A month
with many cancellations still counts those orders in the denominator.

---

## Category revenue

**Definition.** `mart_category_revenue.revenue_brl` = the sum of item `price` for
that category. Built from items, never from orders.

**Freight is excluded, deliberately.** One shipment can carry items from several
categories and the freight is charged once for the whole order, so there is no
honest way to attribute it per category. Spreading it with an invented rule would
produce a number that looks precise and is not.

**Categories therefore do not sum to total revenue.** The gap is freight. This is
expected, not a bug.

**Three of the 74 categories have no English translation.** They keep their
Portuguese names rather than being folded into "unknown", so their revenue stays
visible and checkable.

---

## Late delivery

**Definition.** `fct_orders.is_late` — TRUE when the delivery date is later than
the promised date. `fct_orders.days_late` is the difference **in whole days**:
negative is early, `0` is on the promised day, positive is the number of days
late.

**Counted in whole days, and this is the least obvious definition here.** Every
one of the 99,441 estimates in the source is stored at exactly `00:00:00` — a date
sitting in a timestamp column — while all 96,476 actual deliveries carry a real
time. Comparing instants would judge a customer's delivery against a precision the
promise never had: 1,292 orders that arrived on the promised day, at 00:03 for
instance, would be counted as late. Full reasoning and the measurement are in
[decision 0003](decisions/0003-lateness-in-whole-days.md).

**Never delivered is its own outcome, and it is not "on time".** Orders
cancelled, unavailable or still in transit at the end of the snapshot have
`is_late = NULL`. They are reported as `never delivered` rather than dropped,
because for the customer they are the worst outcome available, and dropping them
would flatter the delivery record.

---

## Late percentage

**Definition.** `mart_late_delivery_by_state.late_pct` = late orders ÷ delivered
orders × 100, for that state.

**The denominator is deliveries, not orders.** An order that was never delivered
cannot be late.

**It is NULL, not 0, where nothing was delivered.** A state with no deliveries
must not be able to rank as "perfect" by arithmetic accident. The
`delivered_orders` count is published next to the rate so a reader can tell a real
8% from a 1-in-12.

---

## Lane

**Definition.** A lane is a pair of states, `seller_state` to `customer_state`, in
`mart_late_delivery_by_lane`. `SP -> RJ` means the seller is in São Paulo and the
customer is in Rio de Janeiro. A lane is not a distance and not a route: the state
is the finest geography the dataset carries.

**Only orders with one seller state are counted.** An order whose items came from
sellers in more than one state, 65 of the 96,476 delivered orders, has no single
lane and is left out. No other delivery figure is affected.

**Handling and transit are split, and that split is the point of the table.**
`avg_handling_days` is purchase to carrier and `avg_transit_days` is carrier to
customer. Handling sits near three days on every lane with enough volume, so a
seller dispatches on schedule whatever the destination; the differences between
lanes are in transit.

**`late_pct_if_promise_plus3` and `late_pct_if_promise_plus7` are
counterfactuals.** They report the share of that lane's orders that would have been
late had the promise been three or seven days longer, computed as the share with
`days_late >= 4` and `days_late >= 8` respectively, because `is_late` means
`days_late >= 1`. A longer promise can never make more orders late, which is what
`assert_promise_counterfactuals_are_monotone` enforces. These numbers move the
measurement and not the parcel: the promise is set by Olist, so they say what the
record would show, never what the customer would experience.

**No carrier is identified.** A lane says where the delay is created. It cannot say
who creates it, and narrowing it to a carrier or a warehouse needs data this
dataset does not carry.

---

## Review score

**Definition.** `review_score`, an integer 1–5, left by the customer.

**Aggregates use `avg()` and are reported to three decimals**, because scores are
integers and a two-decimal average hides a real difference between 4.296 and
4.30.

**Reviews are self-selected.** Only customers who chose to write one appear. This
is not the satisfaction of the population, and the report says so.

**One review per order is used in `fct_orders`, not all of them.** 99,224 review
rows cover 98,673 distinct orders, so a direct join would inflate order counts,
and 768 orders have no review at all. Where an order has more than one review, the
**latest** is used — chosen over the maximum, which would systematically flatter
the result. See [decision 0002](decisions/0002-aggregate-to-the-order-grain.md).

**The distribution is bimodal** — 57,328 fives against 11,424 ones — which is why
`pct_review_score_le2` accompanies every average. A mean of 4.3 is consistent with
both a happy marketplace and a polarised one.

---

## Active customer

**Definition.** A distinct `customer_unique_id` that placed at least one order in
the period.

**The person, not the order.** `customer_id` is assigned per order, so counting it
would make every customer look new every time they returned. See
[decision 0004](decisions/0004-the-customer-is-customer-unique-id.md).

---

## Repeat-purchase rate

**Definition.** Customers with more than one order ÷ all customers.

**Measured: 3.12%** — 2,997 of 96,096 people. This is the project's least
comfortable finding and it is stated as a headline rather than buried: the
overwhelming majority of this marketplace's customers buy once.

**It is a floor, not a ceiling.** `customer_unique_id` is derived by the source
system and imperfect; a person who changes their details may be counted twice,
which would make retention look better, not worse.

---

## Cohort retention

**Definition.** `mart_cohort_retention.retention_pct` = customers from a cohort who
ordered again in a given month ÷ the size of that cohort × 100. The cohort is the
month of a customer's **first** order; `month_offset` is how many months later
they returned.

**Offset 0 is 100% by construction** — it is the acquisition month itself. It is
not a finding, and it is asserted by a test, because an offset-0 that is *not*
100% means the cohort logic is broken rather than that the business changed.

**Offsets are counted on the calendar**, not in days, so a 30-day month cannot
create an off-by-one.

**Counted in distinct people**: a customer who ordered twice in one month is one
retained customer, not two.

---

## RFM

**Definition.** Each customer scored 1–5 on Recency, Frequency and Monetary with
`ntile(5)`, plus a segment label. In `mart_rfm`.

**Direction of the scores, which is the trap.** Recency is *days since* the last
order, so smaller is better and the scores are ordered descending — `r_score = 5`
is the **most recent** customer. Frequency and Monetary are ascending, so 5 is the
best. Getting one of these backwards produces a working model with no error
message that quietly ranks the best customers as the worst.

**The snapshot date is the day after the last order in the data**, so no customer
can have a negative recency.

**`f_score` is close to meaningless here and is labelled as such.** 96.9% of
customers ordered exactly once, so nearly everyone ties, and `ntile` splits a tied
mass arbitrarily. It is kept because that flatness *is* the finding — but no
segment chart should be presented as though Frequency discriminated.

---

## Orders vs order items

**Two grains exist and mixing them is the most likely way to get a wrong total.**

- `fct_orders` — one row per order. Use it for counts of orders, order value and
  delivery outcomes.
- `fct_order_items` — one row per item. Use it for anything about products,
  categories or sellers.

An order with four items appears once in `fct_orders` and four times in
`fct_order_items`. Summing freight from the items table while counting orders from
the orders table would count the freight once per item.

---

## Late-delivery model (Project 02)

**Question.** At the moment an order is placed, how well can its risk of arriving
late be ranked using only information that exists at checkout?

**Target.** `mart_order_features.is_late`, the same whole-day definition used in
Project 01. An order needs an observed delivery timestamp to have a label. The
2,965 orders without one are excluded from training and evaluation; they are not
all “never delivered” (1,107 shipped, 619 cancelled, 609 unavailable, 314
invoiced, 301 processing, 8 delivered with an incomplete timestamp, and a few
earlier statuses).

**Population and split.** Orders purchased before **2018-04-01** train; orders
purchased on or after that date test (32,150 orders, 4.42% late). The split is
temporal and non-overlapping: a random split would put the same months on both
sides and leak period-specific backlog into the score.

**Label maturity.** A training order must have been both purchased and delivered
before 2018-04-01. An order purchased in March but delivered in May did not have
an observable label on the deployment date, so it cannot train a model deployed
then. That rule excludes 3,852 in-flight orders and leaves **60,474 mature
training orders, 5.97% late**.

**Model selection.** The mature training period is split at **2018-01-01**:
41,202 orders before it fit the models, 16,783 in January–March validate them
(6.91% late). Average precision selects logistic regression (0.127 vs 0.101).
The selected model is refitted on all 60,474 training orders and evaluated once
on the April–August holdout. Both models are still reported on the holdout as a
sensitivity check; they are not used to re-select.

**Feature policy.** The model uses an explicit allow-list in
`late_delivery.features.FEATURES`: purchase timing, promised days, customer and
seller state, the same-state flag, order composition and payment terms. Anything
observed after checkout — approval, carrier hand-off, delivery date, delivery
duration, days late, review score, order status — is forbidden. `order_status`
and `delivered_to_customer_at` exist in the mart only to enforce label maturity.
A new mart column is not a model feature until it is added to the allow-list on
purpose.

**Metrics.**

- **ROC AUC** — probability that a randomly chosen late order scores above a
  randomly chosen on-time order. Insensitive to the base rate, useful for
  comparing rankers, not for choosing a threshold.
- **Average precision (AP)** — area under the precision–recall curve. With a 4.4%
  base rate this is the honest summary of ranking quality; a constant score has
  AP equal to the base rate.
- **Brier score** — mean squared error of the predicted probability. It measures
  calibration and discrimination together, so it is only meaningful if the
  predicted probability is meant to be believed.
- **Capacity precision, recall and lift** — at 5%, 10% and 20% of test orders,
  the share of flagged orders that were late, the share of all late orders
  captured, and precision divided by the test base rate. This is the operational
  framing: a fixed review budget, not a fixed probability threshold.
- **Bootstrap interval** — percentile interval over 500 resamples of the test
  rows, reported for AUC, AP, Brier and the top-decile metrics. It describes
  sampling noise within this holdout, not regime change between periods.
- **Calibration intercept and slope** — a logistic regression of the outcome on
  the predicted logit. Slope measures whether the ranking is stretched; intercept
  measures whether the level is shifted.
- **Rolling origin** — refit at 2017-07, 2017-10, 2018-01 and 2018-04 using only
  labels matured before each origin, then score the next three months. This is
  the stability check a single holdout cannot provide.

**Results on the holdout.** Selected logistic: AUC 0.708 (0.695–0.720), AP 0.091
(0.083–0.101), Brier 0.0420, top-decile precision 10.4% (9.3–11.5%), recall
23.5% (21.6–25.6%) and lift 2.35× (2.16–2.56×). Gradient boosting scores AP
0.097 and top-decile recall 28.4%, so the model class is not settled by this
holdout.

**Calibration is a level shift, not a broken ranking.** Mean prediction is 6.38%
against 4.42% observed; calibration slope is 1.02 and intercept −0.35. The
holdout's Brier (0.0420) is slightly better than a constant (0.0425), so the
older “worse than a constant” claim no longer holds after the label-maturity
fix. Probabilities still must not be read as risks for the current regime.

All Project 02 numbers are generated by `uv run python tasks.py train`, which
writes `projects/02-late-delivery/reports/model_metrics.json`, the capacity
table, bootstrap intervals, monthly and rolling-origin results, and the
permutation-importance table. The report quotes that file; it does not restate
numbers by hand.

---

## Review complaint topics (Project 03)

**Scope.** One review per delivered order, the latest by
`review_created_at` (then `review_id`), matching `fct_orders`. A complaint is a
review scored **1 or 2 stars** whose comment retains at least two tokens after
normalisation. Of the 12,276 low-star reviews on delivered orders, 9,237 carry a
written comment and 9,139 survive the token filter (98 one-word verdicts are
dropped). The corpus therefore holds **9,139 complaints from 96,476 delivered
orders**, and **29.66%** come from late orders.

**The corpus is selected, not representative.** Late orders are much more likely
to be reviewed and much more likely to be reviewed badly:

| Outcome | Orders | With a comment | 1–2 star comments |
|---|---:|---:|---:|
| On time | 89,941 | 35,138 (39.07%) | 6,490 (7.22%) |
| Late | 6,535 | 3,762 (57.57%) | 2,747 (42.04%) |

Late orders are **6.8%** of deliveries but **29.66%** of the complaint corpus.
Every share below is therefore a share *of complaints*, not of orders or
customers. The report never converts one into the other.

**Model.** Latent Dirichlet Allocation with six topics, fit on the complaint text
only — the delivery label is joined afterwards and is not an input. Features are
unigrams and bigrams, `min_df=20`, `max_df=0.5`, `random_state=0`,
`learning_method="batch"`, `max_iter=30`, a conservative Portuguese stopword
list, and tokens of at least three letters. Each complaint is assigned to the
topic with the largest weight (hard assignment). UMass coherence (top 10 terms)
is **−2.677** at k=6, higher than k=4–5 and k=7–10 on the same corpus, so six is
the best of those candidates by a small margin. Perplexity is **332.92** and is
reported only as a descriptive fit statistic; it is not used to choose k. Refits
with seeds 1–4 give a mean adjusted Rand index of **0.258** and mean top-term
Jaccard of **0.413** against the seed-0 partition, so the exact topic boundaries
are not stable even though the broad logistics/product grouping is. Hard
assignment is also a summary: **22.7%** of complaints have a largest topic weight
below 0.5, and **31.7%** have a second topic at or above 0.3.

**Topic share.** `share_pct` = complaints assigned to a topic ÷ all 9,139
complaints. `late_share_pct` and `on_time_share_pct` use a different denominator
each: complaints from late orders (2,711) and complaints from on-time orders
(6,428). They therefore sum to 100% within each column, and the two columns
describe different populations.

**Difference and uncertainty.** `diff_pp` is `late_share_pct − on_time_share_pct`
in percentage points. Its 95% interval comes from an unpooled two-proportion
normal approximation; the p-value comes from a pooled two-sided z-test. Six
topics are tested together, so `q_value` is the Benjamini–Hochberg adjusted
p-value across those six tests. A topic is called over-represented only when the
interval excludes zero and `q_value` is small; the report also prints the
interval so a reader can see the size of the gap, not only its significance.

**What this does not measure.** The topic model describes *what the text is
about*, not sentiment: the star rating supplies the negative signal. A topic
being over-represented among late orders is an association between a delivery
outcome and the subject of a complaint. It is not evidence that lateness caused
that complaint, and the selected corpus makes even the association descriptive of
complainers rather than of all customers.
