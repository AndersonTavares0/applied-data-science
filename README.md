# Applied Data Science Portfolio

[![CI](https://github.com/AndersonTavares0/ds-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/AndersonTavares0/ds-portfolio/actions/workflows/ci.yml)
[![Live report](https://img.shields.io/badge/live-report-1f6feb)](https://AndersonTavares0.github.io/ds-portfolio/)

Analytics on the Olist Brazilian e-commerce dataset: 99,441 orders placed between September 2016 and October 2018, across nine related tables. Three projects on one dataset, each shipping a written case study, its figures, and a statement of what the data cannot support. The original one-page decision memos remain in the archived Quarto sources.

The repository slug stays `ds-portfolio` so existing links keep working; the public title reflects the wider scope — measurement, prediction and text analysis, not only retail reporting.

The thread through all three is one finding: **late delivery is the strongest signal of customer dissatisfaction in this marketplace.** An order that arrives late averages 2.27 stars out of 5. One that arrives on time averages 4.29. Project 01 measures that. Project 02 predicts it from what is known at the moment of purchase. Project 03 reads the 9,139 written complaints customers left, and finds that late and on-time customers complain about different things: the parcel, and the product.

## Start here

- [The retail case study](https://AndersonTavares0.github.io/ds-portfolio/projects/retail-analytics) is the full analysis, with interactive figures.
- [The late-delivery case study](https://AndersonTavares0.github.io/ds-portfolio/projects/late-delivery) asks what can be known about lateness at checkout.
- [The voice-of-the-customer case study](https://AndersonTavares0.github.io/ds-portfolio/projects/voice-of-customer) reads what customers actually wrote.
- [About and contact](https://AndersonTavares0.github.io/ds-portfolio/about).
- [Em português](https://AndersonTavares0.github.io/ds-portfolio/pt/) has every page translated.

## Projects

| # | Project | Question it answers | Status |
|---|---|---|---|
| 01 | Retail analytics | Which levers actually move satisfaction and repeat purchase? | Published |
| 02 | Late-delivery prediction | At purchase time, can we tell which orders will arrive late? | Published |
| 03 | Voice of the customer | What do 9,139 written complaints say, and how do late orders differ? | Published |

## What Project 01 found

- **Revenue.** 99,441 orders worth R$ 16.0M, an average order of R$ 160.99. November 2017 is the largest month at R$ 1.19M, on Black Friday. 2016 holds 329 orders across three months, a launch period rather than a quiet year.
- **Repeat purchase is 3.12%.** 2,997 of 96,096 customers ever placed a second order, and 96.88% placed exactly one. Ordering again in the next calendar month is 0.48%, flat near 0.2% afterwards. There is almost no repeat-purchase habit to lose, so the usual retention playbook does not apply. This is an acquisition business.
- **Late delivery is 6.77%.** 6,535 of 96,476 deliveries arrived after the promised date. Those orders average 2.27 stars against 4.29 for on-time orders, and past a week late about 80% of reviewers give one or two stars.
- **The promised date is conservative.** The average delivered order arrives 11.88 days early and only 6.77% miss. Expectation management may matter as much as speed.

The report recommends investigating Rio de Janeiro, where 12.10% of 12,353 deliveries are late against São Paulo's 4.49%. At São Paulo's rate, roughly 940 Rio orders over the 25-month snapshot would not be late, and the observed review behaviour implies about 377 fewer one- and two-star reviews over the snapshot. It labels that an association rather than a forecast, because the data holds states and not distances, and no cost or margin figures.

## What Project 02 found

A model restricted to what is known at checkout can rank orders by late-delivery risk, but it cannot yet produce a stable probability.

- **The ranking is modest, not strong.** On 32,150 orders purchased after 2018-04-01, the selected logistic model reaches ROC AUC 0.685 (95% bootstrap interval 0.671–0.698) and average precision 0.082 (0.076–0.091) against a 4.42% base rate. The riskiest 10% captures 19.7% of late orders at 8.7% precision — 1.97× the base rate. The top 5% is less precise than the top 10%, so the model is not a deployment-ready shortlist.
- **Training labels must have matured.** Training stops three months before the test cutoff, so the sample is not selected on delivery speed. A naive “purchase before April, keep delivered” rule would drop 3,852 in-flight orders with a 39.1% late rate. The mature training set is 43,691 orders at 5.61% late; rolling origins range from AUC 0.59 to 0.62, and the model class remains open.
- **The probability is close in level but compressed.** Mean predicted risk is 4.26% against 4.42% observed; the calibration slope is 0.82 and the intercept −0.47. High scores are not high enough and low scores are not low enough, so the score is a ranking, not a risk percentage.
- **The signal is the promise and the geography.** Permutation importance ranks `promise_days` first, then customer state and seller state. Basket value, freight, weight, payment and category add little.

The full analysis is in [the late-delivery case study](https://AndersonTavares0.github.io/ds-portfolio/projects/late-delivery).

## What Project 03 found

- **Late complaints are about the parcel.** Delivery problems and non-receipt are **65.7%** of late-order complaints against **18.5%** of on-time complaints. Delivery problems alone are 39.8% against 11.0% (+28.8 pp), non-receipt 25.9% against 7.5% (+18.4 pp). Delay is a mixed topic at 16.2% against 12.6% (+3.6 pp) and is reported separately, not counted as logistics.
- **On-time complaints are about the product.** Quality or "not as described", incomplete orders and wrong items are **68.9%** of on-time complaints against **18.1%** of late ones. Quality alone is 26.7% against 5.6% (−21.1 pp), incomplete orders 22.8% against 4.2% (−18.6 pp), and wrong item or return 19.4% against 8.3% (−11.1 pp).
- **The corpus is selected, and the report says so first.** 9,139 complaints come from delivered orders with a written 1–2 star review. Late orders are 6.8% of deliveries but 29.7% of those complaints: 57.6% of late orders receive a comment against 39.1% of on-time ones, and 42.0% receive a low-star comment against 7.2%. The comparison is compositional, not a customer survey, and carries no causal claim.

The analysis fits six LDA topics on the complaint text without using the delivery outcome, then compares topic shares with 95% intervals and Benjamini–Hochberg correction. Six is a prespecified semantic choice: seed 0 ranks it highest on UMass coherence, but the seed-averaged score is highest at k=4, and k=4 merges product with returns. Seed refits also show the exact boundaries are unstable, so the report treats the six labels as a readable summary rather than fixed categories. A soft-assignment check reaches the same conclusion: delivery and non-receipt carry 58.9% of late complaint weight against 22.8% of on-time weight, while product topics carry 24.9% against 63.1%. It is in [the voice-of-the-customer case study](https://AndersonTavares0.github.io/ds-portfolio/projects/voice-of-customer).

## How it is built

Raw CSVs from a revision-pinned mirror, loaded into PostgreSQL with every column kept as text, modelled with dbt, tested at every layer, and written up as a React site. The Quarto sources under `site/` are retained as the archive of the original reports but are no longer deployed.

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
  -> web/scripts/export_data.py   aggregates -> committed JSON
  -> React + TypeScript     web/src, built to web/dist
```

The website never queries the database. `web/scripts/export_data.py` reads the tested marts and the Project 02/03 report artifacts once, and writes typed JSON into `web/src/data/`. `npm run build` then produces a static bundle that deploys to GitHub Pages at `/ds-portfolio/`.

Three decisions are worth knowing before reading the code. Each one is recorded with its evidence in [`docs/decisions/`](docs/decisions/).

- **Raw columns stay text.** Letting pandas infer types turns a zip-code prefix of `01001` into the integer `1001`, quietly. Every cast goes through three macros that treat an empty string as NULL, because empty CSV cells arrive as empty strings and `cast('' as timestamp)` raises.
- **Aggregate to the order before joining.** Order items, payments and reviews are each finer-grained than an order. Joining them directly multiplies rows, so an order with four items and three payments would count twelve times in every total. The SQL would compile and nothing would fail.
- **Lateness is measured in whole days.** The promised date carries no time of day: all 99,441 of them are midnight. The actual delivery time does, across 96,476 distinct values. Comparing the two to the second misclassified 1,292 orders.

## Reproducing it

You need [uv](https://docs.astral.sh/uv/) and Docker for the analysis, and Node.js 22 (npm 10) for the website. Quarto is optional: it is only needed to render the archived `site/` sources, not the published site.

```bash
git clone https://github.com/AndersonTavares0/ds-portfolio.git
cd ds-portfolio
cp .env.example .env
uv run python tasks.py doctor      # check the toolchain
uv run python tasks.py setup       # dependencies, database, dataset
uv run python tasks.py pipeline    # load, build, charts, train + topics, tests
```

Then build the website:

```bash
cd web
npm ci
npm run dev        # local dev server at http://localhost:5173/ds-portfolio/
npm run build      # typecheck + production bundle in web/dist
npm run preview    # serve the production bundle
```

`uv run python tasks.py web-export` regenerates `web/src/data/*.json` from the marts after the pipeline changes a number. `uv run python tasks.py web-build` runs the same build from the repository root. Every command goes through [`tasks.py`](tasks.py) where a Python step is involved; the frontend uses npm directly because TypeScript tooling belongs to npm. `tasks.py` is plain Python rather than a `Makefile` because `make` is not on Windows and this repository is written on Windows and run on Linux.

The dataset is 126 MB and is not committed. It comes from a Hugging Face mirror of the original Kaggle release, pinned to one revision so the numbers cannot move underneath you, and validated by exact byte size plus a minimum row count. CI needs neither the dataset nor a database: it runs ruff, the Python tests, a dbt parse of the project, and typechecks and builds the React site from committed JSON. Publishing runs the same build and pushes `web/dist` to `gh-pages`.

## Repository map

```
projects/01-retail-analytics/   the analysis
  dbt_project/                  staging models, mart models, 91 data tests (11 singular)
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
web/                            the published React site (TypeScript + Tailwind)
  src/data/                     committed JSON exports of the tested marts
  src/content/                  full EN/PT copy, typed
  src/components/charts/        Recharts and custom data plates
  src/pages/                    home, routed case studies, about
  scripts/export_data.py        the only database step the site needs
site/                           Quarto archive, retained but not deployed
  index.qmd, about.qmd          the original landing pages
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

One folder is one purpose. `web/` is what gets published, `projects/` is the analysis that produces it, `site/` is the Quarto archive of the original reports, `docs/` is how and why, and `data/` is the input.

## What this repository demonstrates

| Skill | Where to look |
|---|---|
| SQL and dimensional modelling | `projects/01-retail-analytics/dbt_project/models/` |
| Data quality as code | `projects/01-retail-analytics/dbt_project/models/**/schema.yml`, `.../dbt_project/tests/` |
| Python data engineering | `projects/01-retail-analytics/src/retail/` |
| Predictive modelling and evaluation | `projects/02-late-delivery/src/late_delivery/` |
| NLP and statistical comparison | `projects/03-voice-of-customer/src/voice/` |
| Reproducible pipelines | `tasks.py`, `.github/workflows/` |
| Testing without a database | `projects/01-retail-analytics/tests/`, `projects/02-late-delivery/tests/`, `projects/03-voice-of-customer/tests/` |
| Communicating a result | `web/src/pages/`, `web/src/components/charts/`, and the archived `site/reports/` |

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
