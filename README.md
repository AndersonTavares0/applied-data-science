# Retail Analytics Portfolio

[![CI](https://github.com/AndersonTavares0/ds-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/AndersonTavares0/ds-portfolio/actions/workflows/ci.yml)
[![Live report](https://img.shields.io/badge/live-report-1f6feb)](https://AndersonTavares0.github.io/ds-portfolio/)

Analytics on the Olist Brazilian e-commerce dataset: 99,441 orders placed between September 2016 and October 2018, across nine related tables. Three projects on one dataset, each shipping a written analysis, a one-page decision memo, and a statement of what the data cannot support.

The thread through all three is one finding: **late delivery is the strongest signal of customer dissatisfaction in this marketplace.** An order that arrives late averages 2.27 stars out of 5. One that arrives on time averages 4.29. Project 01 measures that. Project 02 predicts it from what is known at the moment of purchase. Project 03 reads the 9,139 written complaints customers left, and finds that late and on-time customers complain about different things: the parcel, and the product.

## Start here

- [The report](https://AndersonTavares0.github.io/ds-portfolio/reports/01-retail-analytics/01-business-analytics.html) is the full analysis, with figures.
- [The decision memo](https://AndersonTavares0.github.io/ds-portfolio/reports/01-retail-analytics/00-executive-memo.html) is the same argument on one page.
- [Project 02](https://AndersonTavares0.github.io/ds-portfolio/reports/02-late-delivery/02-late-delivery.html) asks what can be known about lateness at checkout.
- [The voice-of-the-customer analysis](https://AndersonTavares0.github.io/ds-portfolio/reports/03-voice-of-customer/03-voice-of-customer.html) reads what customers actually wrote.
- [Em português](https://AndersonTavares0.github.io/ds-portfolio/pt/) has every page translated.

## Projects

| # | Project | Question it answers | Status |
|---|---|---|---|
| 01 | Retail analytics | Which levers actually move satisfaction and repeat purchase? | Published |
| 02 | Late-delivery prediction | At purchase time, can we tell which orders will arrive late? | Published |
| 03 | Voice of the customer | What do 9,139 written complaints say, and how do late orders differ? | Published |

## What Project 01 found

- **Revenue.** 99,441 orders worth R$ 16.0M, an average order of R$ 160.99. November 2017 is the largest month at R$ 1.19M, on Black Friday. 2016 holds 329 orders across three months, a launch period rather than a quiet year.
- **Repeat purchase is 3.12%.** 2,997 of 96,096 customers ever placed a second order, and 96.88% placed exactly one. Month-one cohort retention is 0.48%, flat near 0.2% afterwards. There is almost no repeat-purchase habit to lose, so the usual retention playbook does not apply. This is an acquisition business.
- **Late delivery is 6.77%.** 6,535 of 96,476 deliveries arrived after the promised date. Those orders average 2.27 stars against 4.29 for on-time orders, and past a week late about 80% of reviewers give one or two stars.
- **The promised date is conservative.** The average order arrives 11.18 days early and only 6.77% miss. Expectation management may matter as much as speed.

The report recommends investigating Rio de Janeiro, where 12.10% of 12,353 deliveries are late against São Paulo's 4.49%. At São Paulo's rate, roughly 940 Rio orders a year would not be late, and the observed review behaviour implies about 370 fewer one- and two-star reviews. It labels that an association rather than a forecast, because the data holds states and not distances, and no cost or margin figures.

## What Project 02 found

A model restricted to what is known at checkout can rank orders by late-delivery risk, but it cannot yet produce a stable probability.

- **The ranking has signal, and its stability is bounded.** On 32,150 orders purchased after 2018-04-01, the selected logistic model reaches ROC AUC 0.708 (95% bootstrap interval 0.695–0.720) and average precision 0.091 (0.083–0.101) against a 4.42% base rate. The riskiest 10% captures 23.5% of late orders at 10.4% precision — 2.35× the base rate. Rolling origins range from AUC 0.59 to 0.75.
- **Training labels must have matured.** Orders purchased before the cutoff but delivered after it are excluded from training, so the model learns only outcomes that were observable on the deployment date. That leaves 60,474 training orders at 5.97% late.
- **The probability is shifted, not broken.** Mean predicted risk is 6.38% against 4.42% observed; the calibration slope is 1.02 and the intercept −0.35. The score is still a triage queue, not a risk percentage.
- **The signal is the promise and the geography.** Permutation importance ranks `promise_days` first, then customer state and seller state. Basket value, freight, weight, payment and category add little.

The full analysis is in [Project 02](https://AndersonTavares0.github.io/ds-portfolio/reports/02-late-delivery/02-late-delivery.html) and its [decision memo](https://AndersonTavares0.github.io/ds-portfolio/reports/02-late-delivery/00-executive-memo.html).

## What Project 03 found

- **Late complaints are about the parcel.** Delivery problems, non-receipt and delay are **81.9%** of late-order complaints against **31.1%** of on-time complaints. Delivery problems alone are 39.8% against 11.0% (+28.8 pp), non-receipt 25.9% against 7.5% (+18.4 pp), and delay 16.2% against 12.6% (+3.6 pp).
- **On-time complaints are about the product.** Quality or "not as described", incomplete orders and wrong items are **68.9%** of on-time complaints against **18.1%** of late ones. Quality alone is 26.7% against 5.6% (−21.1 pp), incomplete orders 22.8% against 4.2% (−18.6 pp), and wrong item or return 19.4% against 8.3% (−11.1 pp).
- **The corpus is selected, and the report says so first.** 9,139 complaints come from delivered orders with a written 1–2 star review. Late orders are 6.8% of deliveries but 29.7% of those complaints: 57.6% of late orders receive a comment against 39.1% of on-time ones, and 42.0% receive a low-star comment against 7.2%. The comparison is compositional, not a customer survey, and carries no causal claim.

The analysis fits six LDA topics on the complaint text without using the delivery outcome, then compares topic shares with 95% intervals and Benjamini–Hochberg correction. Coherence selects k=6 among 4–10, but seed refits show the exact boundaries are unstable, so the report treats the six labels as a readable summary rather than fixed categories. It is in [the report](site/reports/03-voice-of-customer/03-voice-of-customer.qmd), with [a one-page memo](site/reports/03-voice-of-customer/00-executive-memo.qmd).

## How it is built

Raw CSVs from a revision-pinned mirror, loaded into PostgreSQL with every column kept as text, modelled with dbt, tested at every layer, and written up in Quarto.

```
Hugging Face mirror, revision pinned
  -> download_data.py       9 CSVs, ~126 MB, verified by exact byte size
  -> load_raw.py            every column TEXT, chunked
  -> PostgreSQL             schema: raw
  -> dbt staging            analytics_staging, views: cast and rename
  -> dbt marts              analytics_marts, tables: tested keys and outcomes
  -> make_charts.py         figures, committed so publishing needs no database
  -> train_model.py         model metrics + figures, committed
  -> analyze_reviews.py     LDA topic model over complaint text, tables and figures
  -> Quarto                 site/
```

Three decisions are worth knowing before reading the code. Each one is recorded with its evidence in [`docs/decisions/`](docs/decisions/).

- **Raw columns stay text.** Letting pandas infer types turns a zip-code prefix of `01001` into the integer `1001`, quietly. Every cast goes through three macros that treat an empty string as NULL, because empty CSV cells arrive as empty strings and `cast('' as timestamp)` raises.
- **Aggregate to the order before joining.** Order items, payments and reviews are each finer-grained than an order. Joining them directly multiplies rows, so an order with four items and three payments would count twelve times in every total. The SQL would compile and nothing would fail.
- **Lateness is measured in whole days.** The promised date carries no time of day: all 99,441 of them are midnight. The actual delivery time does, across 96,476 distinct values. Comparing the two to the second misclassified 1,292 orders.

## Reproducing it

You need [uv](https://docs.astral.sh/uv/), Docker and [Quarto](https://quarto.org/) on the PATH. Python and dbt come from `uv`.

```bash
git clone https://github.com/AndersonTavares0/ds-portfolio.git
cd ds-portfolio
cp .env.example .env
uv run python tasks.py doctor      # check the toolchain
uv run python tasks.py setup       # dependencies, database, dataset
uv run python tasks.py pipeline    # load, build, charts, train + topics, tests, render
```

The website is then in `site/_site/`. Every command goes through [`tasks.py`](tasks.py), which is plain Python rather than a `Makefile` because `make` is not on Windows and this repository is written on Windows and run on Linux.

The dataset is 126 MB and is not committed. It comes from a Hugging Face mirror of the original Kaggle release, pinned to one revision so the numbers cannot move underneath you, and validated by exact byte size plus a minimum row count. CI needs neither the dataset nor a database: it runs ruff and the Python tests, and the site is published from committed figures.

## Repository map

```
projects/01-retail-analytics/   the analysis
  dbt_project/                  staging models, mart models, 80 data tests (7 singular)
  src/retail/                   the data layer: config, dataset manifest, download and load
  scripts/                      download_data.py, load_raw.py, make_charts.py
  tests/                        Python tests, no network and no database
projects/02-late-delivery/      the prediction
  src/late_delivery/            feature contract, temporal split, evaluation
  scripts/train_model.py        trains both models, writes metrics and figures
  reports/                      model_metrics.json, feature_importance.csv
  tests/                        contract, split, metrics and pipeline tests
projects/03-voice-of-customer/  the complaint analysis
  src/voice/                    text normalisation, topic model, two-proportion tests
  scripts/analyze_reviews.py    reads the marts, writes tables and figures
  reports/                      scope, topic terms and prevalence as CSV/JSON
  tests/                        Python tests, no network and no database
site/                           what gets published, as its own Quarto project
  index.qmd, about.qmd          the landing pages
  reports/01-retail-analytics/  the report and the decision memo
  reports/02-late-delivery/     the model report, decision memo and figures
  reports/03-voice-of-customer/ the complaint report and its memo
  pt/                           the same pages in Portuguese
  theme/                        a light and a dark palette over one set of rules
docs/                           how and why
  metrics.md                    the definition of every number in the report
  decisions/                    why the obvious approach was wrong
  data-dictionary.md            every column, in every layer
  architecture.md               the map, and where the boundaries are enforced
data/                           the input, downloaded and never committed
tasks.py                        every command
AGENTS.md                       the rules this repository works to
```

One folder is one purpose. `site/` is what gets published, `projects/` is the analysis that produces it, `docs/` is how and why, and `data/` is the input.

## What this repository demonstrates

| Skill | Where to look |
|---|---|
| SQL and dimensional modelling | `projects/01-retail-analytics/dbt_project/models/` |
| Data quality as code | `projects/01-retail-analytics/dbt_project/models/**/schema.yml`, `.../dbt_project/tests/` |
| Python data engineering | `projects/01-retail-analytics/src/retail/` |
| NLP and statistical comparison | `projects/03-voice-of-customer/src/voice/` |
| Reproducible pipelines | `tasks.py`, `.github/workflows/` |
| Testing without a database | `projects/01-retail-analytics/tests/`, `projects/03-voice-of-customer/tests/` |
| Communicating a result | `site/reports/01-retail-analytics/`, `site/reports/03-voice-of-customer/` |

## Documentation

| | |
|---|---|
| [Architecture](docs/architecture.md) | the map, and why it is separated this way |
| [Metrics](docs/metrics.md) | what every number in the report means |
| [Data dictionary](docs/data-dictionary.md) | every column, in every layer |
| [Decisions](docs/decisions/) | every decision, and the evidence that forced it |
| [Contributing](docs/CONTRIBUTING.md) | the workflow this repository follows |

The decision log is the one to read first. It records what was measured, what the obvious approach was, and why the obvious approach was wrong.

## Licence

Code is MIT. The Olist dataset is not: it is CC BY-NC-SA 4.0, non-commercial, and is not redistributed here. See [acknowledgements](docs/acknowledgements.md).

## Contact

- GitHub: [AndersonTavares0](https://github.com/AndersonTavares0)
- LinkedIn: [andersonlimatavares](https://www.linkedin.com/in/andersonlimatavares)
- Email: anderson.g.tavares@gmail.com
