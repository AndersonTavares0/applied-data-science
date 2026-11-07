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
3. **Report the base-rate shift instead of hiding it.** The prevalence falls from
   7.95% to 4.42% across the split. The consequence is visible: predicted
   probabilities are too high, the Brier score is no better than a constant, and
   the report says so.
4. **Evaluate at a fixed capacity, not a fixed threshold.** The operational
   decision is how many orders a team can review, so the headline is top-decile
   precision, recall and lift. This avoids inventing intervention costs the
   dataset does not contain.
5. **Do not tune hyperparameters on the holdout.** Two default models are
   compared. With one holdout, a search would make the reported score a selection
   artefact rather than an estimate.

## Consequences

- **The reported score is lower and more honest.** A random split would look
  better and mean less.
- **The model cannot be sold as a calibrated probability.** It ranks; it does not
  yet predict a risk level for the current regime. A deployment needs
  recalibration on recent delivered orders and drift monitoring.
- **One holdout is still one sample.** It covers the February–March 2018 backlog
  and the abrupt improvement after it. Rolling-origin evaluation would test
  stability better, and is the next methodological step, not a substitute for
  this one.
- **The allow-list needs maintenance.** A genuinely useful pre-purchase feature
  added to the mart will not appear in the model until the list is updated. That
  is the intended failure mode: it fails closed.
