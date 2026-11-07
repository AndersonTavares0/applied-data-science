# 0008. Read complaints, not all reviews, and compare their mix

**Status:** Accepted
**Date:** 2026-11-07

## The situation

The dataset holds 99,224 review rows, but only 40,968 carry a comment, and the
people who write one are not a random sample of buyers. Late orders are reviewed
far more often than on-time orders (57.57% against 39.07%) and are far more
likely to receive one or two stars (42.04% against 7.22%). A sentiment average
over all reviews would mostly restate the star rating, on a sample selected by
the outcome it is meant to explain.

Two smaller traps appeared while exploring the text. The Portuguese negation
`não` is the difference between `recebi` and `não recebi`; removing it as a
stopword merged "received" and "never received" into one topic. And 547 orders
have more than one review row, so joining reviews directly to orders double-counts
those orders and inflates every denominator.

## The decision

1. **One review per delivered order.** Use the latest review by
   `review_created_at`, then `review_id`, matching the rule already used by
   `fct_orders`. Restrict the corpus to delivered orders so the outcome label is
   defined.
2. **Read the complaints, not the praise.** Analyse only 1–2 star reviews with a
   comment of at least two normalised tokens. The star rating is the negative
   signal; the topic model describes what the complaint is about.
3. **Fit the topics without the outcome.** LDA with six topics sees only the
   complaint text. Delivery outcome is joined after fitting, so the topics cannot
   be chosen to separate late from on-time orders.
4. **Compare composition, with uncertainty.** Report each topic's share of late
   complaints and of on-time complaints, the difference in percentage points, a
   95% interval, and a Benjamini–Hochberg adjusted p-value across the six topics.
5. **Check the labels against the fitted model.** Each topic is labelled from its
   top terms, and the script fails if a topic no longer contains its anchor term,
   so a library upgrade cannot silently publish mismatched labels.

## What it costs

- **98 low-star comments are dropped**, 1.1% of the 9,237 low-star comments,
  because they retain fewer than two tokens after normalisation. Most are
  one-word verdicts ("ruim", "péssimo", "lixo"). A further 3,039 low-star reviews
  carry no written comment at all and never enter the corpus. The topic mix
  therefore describes written complaints, not every dissatisfied customer.
- **The corpus is selected by outcome.** 57.57% of late orders comment against
  39.07% of on-time orders. Topic shares describe complainers, and cannot be
  projected onto all customers or all orders.
- **Six topics is a judgement, not an estimate.** Other values of k are
  defensible; the report shows the six-topic solution because it separated the
  complaint axes the data actually contains. Perplexity is reported but is not
  used to claim an optimum.
- **The labels are subjective and the topics overlap.** "Delivery problem" and
  "Delay and long wait" both concern delivery; "Not received" and "Delay" share
  vocabulary. Hard assignment to the largest weight hides complaints that mix
  product and delivery issues.
- **A bag of words does not understand a sentence.** Keeping `não` preserves the
  common `não recebi` bigram, but the model cannot represent scope, irony or
  which product a complaint refers to.
- **No causal claim.** A topic being more common among late orders is an
  association between a delivery outcome and the subject of a complaint. It does
  not show that lateness produced that complaint, and the selection above makes
  even the association descriptive of people who wrote reviews.

## What it bought

The complaints split cleanly along the line Project 01 drew from the delivery
side. Among late-order complaints, delivery problems are **+28.8 pp** more common
than among on-time complaints (39.8% against 11.0%), non-receipt is **+18.4 pp**
(25.9% against 7.5%), and delay is **+3.6 pp** (16.2% against 12.6%). All three
intervals exclude zero and all three adjusted p-values are below 0.001.

The on-time complaints are a different conversation: product quality or "not as
described" is **−21.1 pp** (5.6% against 26.7%), incomplete orders **−18.6 pp**,
and wrong item, defect or return **−11.1 pp**. So the answer to "is it the parcel
or the product?" is: it depends on whether the parcel arrived late. That is a
more useful result than an average sentiment score, and it is stated with the
selection caveat rather than instead of it.
