# 0007 — The late-delivery model is judged on a temporal holdout

**Status:** Accepted
**Date:** 2026-11-07

## Situation

The first design for Project 02 was a random train/test split, which is the
default in every tutorial and would have produced a better-looking score. It is
also wrong for this dataset.

Late delivery is not stationary. The delivered late rate moves from 2.9% in early
2017 to 12.4% in November 2017 (Black Friday), 14.1% in February 2018 and 19.0%
in March 2018, then falls to 4.5% in April 2018. The Olist data also ends in
October 2018, so there is no later period with which to check a model trained on
the whole history.

A random split places orders from the same months on both sides. The model can
then learn a month's backlog — the March 2018 collapse, for instance — and report
it as predictive skill. In production there is no future month to have already
seen.

There is a second leak that is easier to miss. The mart contains the delivery
timestamp, the carrier hand-off, the delivery duration, days late and the review
score. Each is observed after checkout. Including any of them, even indirectly
through a column added later, turns the forecast into a post-mortem with an
excellent score.

## Decision

1. **Split by purchase date at 2018-04-01, with a three-month training gap.**
   Training purchases stop at 2018-01-01 and must be delivered by 2018-04-01;
   test purchases start at 2018-04-01. The periods do not overlap. The gap is the
   closest offline approximation to using the model forward without selecting on
   delivery speed.
2. **Use an explicit feature allow-list, not a deny-list.** Anything not named in
   `late_delivery.features.FEATURES` cannot enter the model. Adding a column to
   the mart is therefore a no-op for the model until someone edits the list and
   reviews the change.
3. **Stop training early enough that labels are mature without selecting on
   delivery speed.** A naive rule — purchase before the cutoff, keep only
   delivered orders — excludes every order still in transit on the cutoff. Those
   3,852 orders had a **39.1% late rate**, so the rule removes exactly the slow
   tail. Training therefore uses purchases before 2018-01-01, delivered before
   2018-04-01: **43,691 orders at 5.61% late**. Seven purchases before January
   that arrived after April are excluded; all seven were late. January–March 2018
   is a retrospective descriptive slice only.
4. **Select the model with rolling-origin evaluation.** At 2017-07-01,
   2017-10-01 and 2018-01-01, fit on labels matured three months before the origin
   and score the next three months. Every order in the test window with an
   eventual label is scored; no late order is dropped for arriving after the
   horizon. Mean average precision selects logistic regression (0.119 vs 0.108).
   The January–March slice is descriptive only. The selected model is refitted on
   the full mature training set and evaluated once on the April–August holdout.
   Both models are reported there only as a sensitivity check.
5. **Report the base-rate shift instead of hiding it.** Prevalence falls from
   5.61% in mature training to 4.42% in the holdout. Mean prediction is 4.26%,
   close in level, but the calibration slope is 0.82: the ranking is compressed.
   The report says the score is not a probability.
6. **Evaluate at a fixed capacity, not a fixed threshold.** The operational
   decision is how many orders a team can review, so the headline is capacity
   precision, recall and lift at 5%, 10% and 20%. This avoids inventing
   intervention costs the dataset does not contain.
7. **Check stability with monthly and rolling-origin evaluation.** A single
   holdout covers one regime. The report includes per-month metrics and three
   three-month rolling origins; AUC ranges from 0.59 to 0.62. This is a stability
   check, not a claim that any one origin is the deployment estimate.
8. **Do not report a ranking metric for a constant score.** A constant predicts
   the base rate but cannot rank, so its top-decile precision and lift are an
   arbitrary tie slice. Its Brier score remains a valid calibration check.
9. **Report paired uncertainty between models.** A paired bootstrap on holdout
   rows gives the logistic-minus-boosting AP difference as −0.0048 (95% interval
   −0.0122 to +0.0036). The interval includes zero; the single holdout cannot
   settle model choice.
10. **Do not call the model deployment-ready.** The top 5% is less precise than
    the top 10%, the lift is modest, and there is no cost model or prospective
    pilot. The portfolio presents a research prototype, not an operating queue.

## Consequences

- **The reported score is lower and more honest.** The earlier 2.35× lift came
  from training on a delivery-speed-selected sample. The corrected lift is 1.97×
  at 10% capacity, and the top 5% is less precise than the top 10%.
- **The model cannot be sold as a calibrated probability.** It ranks; the level
  is close but the slope is compressed. A deployment needs recalibration on
  recent delivered orders and drift monitoring.
- **One holdout is still one sample.** It covers the February–March 2018 backlog
  and the abrupt improvement after it. Rolling-origin evaluation now shows AUC
  from 0.59 to 0.62, so stability is bounded rather than assumed.
- **Model selection is itself uncertain.** Logistic regression won the rolling
  origins, but gradient boosting scored slightly better on the holdout. The
  paired interval includes zero; the report presents both rather than declaring a
  winner from the test period.
- **The excluded population is not random.** The 2,965 orders without a delivery
  timestamp are mostly in flight or cancelled at the end of the dataset. The
  model is evaluated on delivered orders and does not describe cancelled orders.
- **The allow-list needs maintenance.** A genuinely useful pre-purchase feature
  added to the mart will not appear in the model until the list is updated. That
  is the intended failure mode: it fails closed.
