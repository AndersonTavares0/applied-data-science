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

1. **Split by purchase date at 2018-04-01.** Everything before trains; everything
   after tests. The periods do not overlap. This is the closest offline
   approximation to using the model forward.
2. **Use an explicit feature allow-list, not a deny-list.** Anything not named in
   `late_delivery.features.FEATURES` cannot enter the model. Adding a column to
   the mart is therefore a no-op for the model until someone edits the list and
   reviews the change.
3. **Require training labels to have matured before the cutoff.** A training
   order must have been both purchased and delivered before 2018-04-01. Without
   this rule, 3,852 orders purchased before the cutoff but delivered after it
   contribute labels that did not exist on the deployment date. The mature
   training set is 60,474 orders at 5.97% late.
4. **Select the model with rolling-origin evaluation.** At 2017-07-01,
   2017-10-01 and 2018-01-01, fit on labels matured before the origin and score
   the next three months, requiring test labels to mature within three months
   after the horizon. Mean average precision selects logistic regression
   (0.138 vs 0.102). The earlier single validation period (January–March 2018)
   is descriptive only. The selected model is refitted on the full mature
   training set and evaluated once on the April–August holdout. The holdout is
   never used for selection; both models are reported there only as a
   sensitivity check.
5. **Report the base-rate shift instead of hiding it.** The prevalence falls from
   5.97% in the mature training period to 4.42% in the holdout. Predicted
   probabilities remain too high on average (6.38% vs 4.42%) even though the
   calibration slope is close to one (1.02). The report says so.
6. **Evaluate at a fixed capacity, not a fixed threshold.** The operational
   decision is how many orders a team can review, so the headline is capacity
   precision, recall and lift at 5%, 10% and 20%. This avoids inventing
   intervention costs the dataset does not contain.
7. **Check stability with monthly and rolling-origin evaluation.** A single
   holdout covers one regime. The report includes per-month metrics and three
   three-month rolling origins; AUC ranges from 0.59 to 0.67. This is a
   stability check, not a claim that any one origin is the deployment estimate.
8. **Do not report a ranking metric for a constant score.** A constant predicts
   the base rate but cannot rank, so its top-decile precision and lift are an
   arbitrary tie slice. Its Brier score remains a valid calibration check.
9. **Report paired uncertainty between models.** A paired bootstrap on holdout
   rows gives the logistic-minus-boosting AP difference as −0.0125 (95% interval
   −0.0215 to −0.0035). That is a within-period comparison; the single holdout
   still cannot settle model choice, and the report says so.

## Consequences

- **The reported score is lower and more honest.** A random split would look
  better and mean less.
- **The model cannot be sold as a calibrated probability.** It ranks; the level
  is still too high for the holdout period. A deployment needs recalibration on
  recent delivered orders and drift monitoring.
- **One holdout is still one sample.** It covers the February–March 2018 backlog
  and the abrupt improvement after it. Rolling-origin evaluation now shows AUC
  from 0.59 to 0.67 and top-decile recall from 14% to 25%, so stability is
  bounded rather than assumed.
- **Model selection is itself uncertain.** Logistic regression won validation,
  but gradient boosting did slightly better on the holdout. The difference is
  small and a single holdout cannot settle it; the report presents both rather
  than declaring a winner from the test period.
- **The excluded population is not random.** The 2,965 orders without a delivery
  timestamp are mostly in flight or cancelled at the end of the dataset. The
  model is evaluated on delivered orders and does not describe cancelled orders.
- **The allow-list needs maintenance.** A genuinely useful pre-purchase feature
  added to the mart will not appear in the model until the list is updated. That
  is the intended failure mode: it fails closed.
