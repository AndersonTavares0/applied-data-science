# Applied Data Science

**A Reproducible Data Science Study**

[![CI](https://github.com/AndersonTavares0/applied-data-science/actions/workflows/ci.yml/badge.svg)](https://github.com/AndersonTavares0/applied-data-science/actions/workflows/ci.yml)
[![Publish](https://github.com/AndersonTavares0/applied-data-science/actions/workflows/publish.yml/badge.svg)](https://github.com/AndersonTavares0/applied-data-science/actions/workflows/publish.yml)
[![Live site](https://img.shields.io/badge/live-site-1f6feb?logo=githubpages&logoColor=white)](https://AndersonTavares0.github.io/applied-data-science/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![dbt](https://img.shields.io/badge/dbt-PostgreSQL-FF694B?logo=dbt&logoColor=white)](https://www.getdbt.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Code: MIT](https://img.shields.io/badge/code-MIT-2ea44f)](LICENSE)
[![Data: CC BY-NC-SA 4.0](https://img.shields.io/badge/data-CC%20BY--NC--SA%204.0-important)](docs/acknowledgements.md)

**Applied Data Science** is the collection identity: reproducible studies built on real operational data, each with a written case study, committed figures, reproducible SQL, and an explicit account of what the data cannot support.

The first collection is **Olist e-commerce operations** — *E-commerce Operations & Customer Experience*. It follows the Olist Brazilian e-commerce dataset: **99,441 orders** from September 2016 to October 2018, across nine related tables. Three connected analyses on one dataset, each with its own question and its own limits.

The thread: **late delivery is the strongest signal of customer dissatisfaction in this marketplace.** A late order averages **2.27 stars**; an on-time order averages **4.29**. The first study measures the problem, the second asks whether it can be ranked at checkout, and the third reads what customers wrote when the parcel went wrong. Start with the collection page: [applied-data-science/collections/olist](https://AndersonTavares0.github.io/applied-data-science/collections/olist).

The published site is a static React application in [`web/`](web/); the original Quarto reports remain in [`site/`](site/) as an archive but are no longer deployed. Docker container and volume names, and the dbt profile/schema, keep the original `ds-portfolio` / `portfolio` identifiers so existing local environments keep working.

## At a glance

| | |
|---|---|
| Dataset | Olist, 99,441 orders, Sep 2016–Oct 2018 |
| Recorded payment value | R$ 16.0M — payment records, **not** realized revenue after refunds |
| Late deliveries | 6.77% (6,535 / 96,476 delivered orders) |
| Prediction holdout | 32,150 orders; ROC AUC 0.685; average precision 0.082 |
| Complaint corpus | 9,139 written 1–2★ complaints from delivered orders |
| Site | React 19 + TypeScript + Tailwind, EN/PT, light/dark, GitHub Pages |

## The three studies

| # | Study | Question | Headline |
|---|---|---|---|
| 01 | [E-commerce Performance & Fulfillment Analytics](https://AndersonTavares0.github.io/applied-data-science/projects/retail-analytics) | Which levers actually move satisfaction and repeat purchase? | 96.9% of customers buy once; lateness concentrates on one crossing |
| 02 | [Late-Delivery Risk Prediction & Temporal Validation](https://AndersonTavares0.github.io/applied-data-science/projects/late-delivery) | Can orders be ranked at checkout without leaking the future? | Modest ranking signal; **no-go** as a production queue |
| 03 | [Customer Complaint Topic Modeling & Comparative Analysis](https://AndersonTavares0.github.io/applied-data-science/projects/voice-of-customer) | What do late and on-time customers complain about? | Late = parcel; on-time = product |

Every page is also available in Portuguese: [pt/](https://AndersonTavares0.github.io/applied-data-science/pt/).

## What the studies found

### 01 · E-commerce Performance & Fulfillment Analytics

- **Recorded payment value is R$ 16.0M.** That is the gross value in the payment table, including freight and 1,234 cancelled/unavailable orders that still had a payment record. It is not realized revenue: there is no refund, cost or margin data.
- **This is an acquisition business.** 93,099 of 96,096 customers placed exactly one order (96.88%); 2,997 ever placed a second (3.12%). Ordering again in the next calendar month is **0.48%**, not a 30-day retention rate, and the 25-month window truncates later returns.
- **Lateness is 6.77%** (6,535 / 96,476 delivered orders). Late orders average 2.27 stars against 4.29 for on-time orders.
- **The lane matters as a description, not a proven cause.** São Paulo → Rio is late 14.17% of the time against 4.49% within São Paulo. The data localise the problem to the crossing; they do not identify the carrier, the hand-off, or the cause, and seller quality is not ruled out. The report recommends investigating the crossing, not blaming sellers.
- **RFM is reported but weak.** With 96.9% of customers ordering once, frequency is a count capped at five, not a meaningful quintile.

### 02 · Late-Delivery Risk Prediction & Temporal Validation

- **The ranking is modest.** On 32,150 orders purchased after 2018-04-01, logistic regression reaches ROC AUC **0.685** (95% bootstrap 0.671–0.698) and average precision **0.082** (0.076–0.091) against a 4.42% base rate. The top 10% captures 19.7% of late orders at 8.7% precision — **1.97×** the base rate. The top 5% is less precise than the top 10%.
- **Labels must mature before training.** The mature training set is 43,691 orders at 5.61% late. A naive “purchase before April, keep delivered” rule would drop 3,852 in-flight orders with a 39.1% late rate — exactly the slow tail.
- **The probability is close in level but not uniformly calibrated.** Mean prediction is 4.26% against 4.42% observed; slope 0.82, intercept −0.47. The ninth decile predicts 7.0% and observes 9.8%; the top decile predicts 12.3% and observes 8.7%. The score is a ranking, not a risk percentage.
- **The model class is not settled.** Logistic regression won rolling-origin selection; boosting was slightly better on the final holdout, and the paired interval does not establish a winner. **No-go for deployment**, go as a case study in leakage and honest evaluation.

### 03 · Customer Complaint Topic Modeling & Comparative Analysis

- **Late complaints are about the parcel.** Delivery problems and non-receipt are **65.7%** of late complaints against **18.5%** of on-time complaints. Delivery problems alone are 39.8% vs 11.0%; non-receipt 25.9% vs 7.5%.
- **On-time complaints are about the product.** Quality, incomplete orders and wrong items are **68.9%** of on-time complaints against **18.1%** of late ones.
- **Delay is mixed, not logistics.** The delay topic is 16.2% vs 12.6% (+3.6 pp) and is reported separately. The manual audit found several “delay” cases were really product complaints.
- **The corpus is selected, and the report says so first.** Late orders are 6.8% of deliveries but 29.7% of complaints: 57.6% of late orders comment against 39.1% of on-time ones. The comparison is compositional, not a customer survey, and carries no causal claim.
- **Six topics was the initial choice, not a proven optimum.** Seed 0 ranks k=6 highest on UMass coherence, but the seed-averaged score is highest at k=4. k=4 merges product and return complaints, so six is retained for granularity; seed refits show the exact boundaries are unstable (ARI 0.258), while the parcel/product contrast survives.

## Why the result is credible

- **Leakage is treated as a design constraint.** Project 02 uses an explicit checkout-time feature allow-list; post-purchase fields are forbidden by contract and test.
- **Time is respected.** Training labels are matured three months before the cutoff, and rolling-origin evaluation is reported alongside the single holdout.
- **Uncertainty is part of the result.** Bootstrap intervals, calibration summaries, topic-share confidence intervals and seed refits are published with the estimates.
- **The negatives are visible.** The site states the no-go recommendation, the selected complaint corpus, the unstable topic boundaries, the 25-month window, and the missing carrier/cost data.
- **The pipeline is reproducible.** Raw CSVs are revision-pinned and never committed; PostgreSQL → dbt → Python → JSON → React is scripted end to end.

## Stack

| Layer | Tools |
|---|---|
| Warehouse and modelling | PostgreSQL, dbt, SQL |
| Analysis and evaluation | Python 3.12, pandas, scikit-learn, statsmodels, scipy |
| Text | scikit-learn LDA, custom Portuguese normalisation, compositional tests |
| Site | React 19, TypeScript, Vite, Tailwind, Recharts, Lucide |
| Delivery | GitHub Actions, GitHub Pages, static JSON data contract |

## Run it

Requires [uv](https://docs.astral.sh/uv/), Docker, and Node.js 22.

```bash
git clone https://github.com/AndersonTavares0/applied-data-science.git
cd applied-data-science
cp .env.example .env
uv run python tasks.py doctor      # toolchain and environment
uv run python tasks.py setup       # dependencies, database, dataset
uv run python tasks.py pipeline    # load -> dbt build -> charts -> train/topics -> tests
```

Build the site:

```bash
cd web
npm ci
npm run dev        # http://localhost:5173/applied-data-science/
npm run build      # typecheck + production bundle in web/dist
npm run preview
```

Regenerate the site data after a pipeline change with `uv run python tasks.py web-export`. `uv run python tasks.py web-build` builds from the repository root.

The dataset is about 126 MB and is not committed. CI needs neither the dataset nor a database: it runs ruff, 54 Python tests, a dbt parse, and the frontend typecheck/build from committed JSON.

## Repository map

```
projects/01-retail-analytics/   E-commerce Performance & Fulfillment Analytics
  dbt_project/                   staging, marts, 91 data tests (11 singular)
  src/retail/                    config, dataset manifest, download, load
  scripts/                       download, load, chart generation
  tests/                         Python tests, no network or database

projects/02-late-delivery/      Late-Delivery Risk Prediction & Temporal Validation
  src/late_delivery/             feature contract, temporal splits, evaluation
  scripts/train_model.py         model selection, metrics, figures
  reports/                       metrics, feature importance, artifacts
  tests/                         contract, split, metric and pipeline tests

projects/03-voice-of-customer/  Customer Complaint Topic Modeling & Comparative Analysis
  src/voice/                     normalisation, LDA, proportion tests
  scripts/analyze_reviews.py     topics, prevalence, coherence, stability
  reports/                       scope, terms, prevalence, groups, k-sensitivity
  tests/                         pure Python, no network or database

web/                            published React site
  src/data/                     committed JSON exports of tested marts
  src/content/                  typed EN/PT copy
  src/components/charts/        Recharts data plates
  src/pages/                    home, collection, case studies, about
  scripts/export_data.py        the only database step the site needs

site/                           Quarto archive, retained but not deployed
docs/                           metrics, decisions, data dictionary, architecture
data/                           downloaded input, never committed
tasks.py                        the analysis entry point
```

## Documentation

| | |
|---|---|
| [Architecture](docs/architecture.md) | how the pieces fit, and why they are separated |
| [Metrics](docs/metrics.md) | what every published number means — and does not mean |
| [Data dictionary](docs/data-dictionary.md) | every table and column, with grain and caveats |
| [Decisions](docs/decisions/) | the evidence behind each methodological choice |
| [Contributing](docs/CONTRIBUTING.md) | the workflow, and what a complete change looks like |

The decision log is the best place to see the reasoning: why raw columns stay text, why the order is the analysis grain, why late delivery is measured in whole days, why labels must mature, and why the first “better” model was withdrawn.

## Licence and data

Code is MIT. The Olist dataset is **CC BY-NC-SA 4.0**: non-commercial, share-alike, and not redistributed here. See [acknowledgements](docs/acknowledgements.md) for provenance and attribution.
