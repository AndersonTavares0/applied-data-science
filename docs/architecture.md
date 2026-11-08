# Architecture

## The shape of the repository

```
applied-data-science/
├── .agents/                      agent procedures scoped to this repository
├── .github/
│   ├── ISSUE_TEMPLATE/           what a useful report looks like
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/                CI and publishing
├── data/                         raw CSVs — git-ignored, with a README explaining the source
├── docs/                         governance, metrics, dictionary, decisions, contributing
├── projects/
│   └── 01-retail-analytics/
│       ├── dbt_project/          staging views and mart tables
│       ├── scripts/              thin entry points (download, load, charts)
│       ├── src/retail/           the data layer as importable modules
│       └── tests/                Python tests, no network and no database required
├── web/                          the published React site (TypeScript + Tailwind)
│   ├── src/data/                 committed JSON exports of the tested marts
│   ├── src/content/              typed EN/PT copy
│   ├── src/components/charts/    Recharts plates and custom figures
│   ├── src/pages/                home, routed case studies, about
│   └── scripts/                  export_data.py, spa-fallback.mjs
├── site/                         Quarto archive of the original reports — not deployed
│   ├── reports/01-retail-analytics/  the report, the memo, and their figures
│   ├── pt/                       the same pages in Portuguese
│   ├── _quarto.yml               shared configuration
│   ├── _quarto-en.yml            the English profile
│   ├── _quarto-pt.yml            the Portuguese profile
│   └── theme/                    the original light/dark rules
├── AGENTS.md                     the rules an agent (or a person) works to here
├── README.md                     project landing page
├── docker-compose.yml            PostgreSQL, and nothing else
├── pyproject.toml                dependencies and tool configuration
├── tasks.py                      the task runner — works the same on Windows and Linux
└── uv.lock                       pinned dependency versions
```

The website is a React application rooted at `web/`. It is deliberately a
separate build from the analysis: `web/scripts/export_data.py` reads the tested
marts and the Project 02/03 report artifacts once and writes typed JSON into
`web/src/data/`, so the site never needs PostgreSQL or the 126 MB dataset. The
committed JSON is the contract between the analysis and the presentation.

Routing is client-side with React Router under the `/applied-data-science/` base path.
The production build is a static bundle in `web/dist/`; a postbuild step copies
`index.html` to `404.html` so deep links work on GitHub Pages, and the publish
workflow pushes `web/dist` to `gh-pages`. Both languages are routes
(`/projects/...` and `/pt/projects/...`) rather than separate builds, and the
theme is a class on `<html>` backed by CSS variables, so there is one set of
components and one set of numbers.

The Quarto sources under `site/` are retained as the archive of the original
reports. They are no longer rendered or deployed; `tasks.py render` remains for
anyone who wants to inspect the old build.

## How data moves

```
    Kaggle / Hugging Face mirror
              │
              │  scripts/download_data.py
              │  · revision pinned, so the bytes never change under you
              │  · validated by exact byte size and minimum row count
              ▼
        data/raw/*.csv                                    9 files, ~126 MB
              │
              │  scripts/load_raw.py
              │  · every column loaded as TEXT
              │  · chunked, so 126 MB does not need 126 MB of RAM
              ▼
    PostgreSQL   schema: raw                              9 tables, all TEXT
              │
              │  dbt
              ▼
  analytics_staging   stg_*        views  — cast, rename, normalise
              │
              ▼
  analytics_marts     dim_*, fct_*, mart_*   tables — what the report queries
              │
              │  web/scripts/export_data.py      aggregates → committed JSON
              ▼
      React site (web/src) → web/dist → GitHub Pages
```

## Why it is separated this way

**Raw is kept raw.** Every column in `raw` is TEXT. Casting, renaming and
normalising happen in the staging layer, in one visible place, covered by tests.
It also stops the silent corruption that happens when a zip-code prefix like
`01001` is inferred as the integer `1001` and every geographic join quietly
returns nothing. See [decision 0001](decisions/0001-raw-columns-stay-text.md).

**Docker runs the database and nothing else.** Python and dbt run natively;
Node builds the site. Containerising the whole stack would make the environment harder to
inspect and slower to iterate on, in exchange for reproducibility that
`uv.lock` already provides for dependencies and `docker-compose.yml` provides
for the database.

**The database is the only stateful thing.** It lives in a named volume, so
`db-down` stops it without losing the 126 MB load, and `db-reset` deletes it
when a genuinely clean start is needed.

**The task runner is Python, not `make`.** `make` is not present on a stock
Windows machine, and this repository is authored on Windows and run on Fedora.
`tasks.py` is pure standard library, so it works before any dependency is
installed, and it exists to serve `retail.io` rather than replace it — the
functions are the interface, the scripts are thin wrappers, and the runner is a
fourth way in that also knows about `.env` and `PYTHONPATH`.

**Tests do not need the network or a database.** Every function in `retail.io`
takes a `files=` override, so the download and validation logic is exercised
against synthetic fixtures. The suite runs in CI on a machine that has never
seen a CSV from Olist.

## Where the boundaries are enforced

| Boundary | Enforced by |
|---|---|
| No credentials or data in git | `.gitignore`, and `data/` is ignored except its README |
| Raw stays TEXT | The loader, plus the safe-cast macros being the only casts in staging |
| Keys are keys | `unique` + `not_null` on every primary key, `relationships` on foreign keys |
| Values are valid | `accepted_values` on statuses, payment types and scores |
| Business rules hold | Singular tests in `dbt_project/tests/` |
| No silent breakage | CI runs lint, tests and a full `dbt build` on every pull request |

The organising principle throughout: **make the wrong thing loud.** A test that
can only fail when something is genuinely broken is worth more than ten that
pass no matter what.
