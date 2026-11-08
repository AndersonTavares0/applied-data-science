import type { SiteContent } from './types'

export const en: SiteContent = {
  lang: 'en',
  htmlLang: 'en',
  nav: {
    skip: 'Skip to content',
    home: 'Home',
    projects: 'Projects',
    about: 'About',
    allProjects: 'All projects',
    menu: 'Menu',
    close: 'Close menu',
    language: 'Language',
    switchLanguage: 'Ver em português',
    themeLight: 'Switch to light theme',
    themeDark: 'Switch to dark theme',
    onThisPage: 'On this page',
    backToProjects: 'Back to projects',
    projectNav: 'Project navigation',
    nextProject: 'Next project',
    previousProject: 'Previous project',
    source: 'Source',
    sourceNote: 'Every number is reproducible from committed SQL and scripts.',
    dataLicence: 'Data: Olist, CC BY-NC-SA 4.0',
    builtWith: 'Built with React, TypeScript, Tailwind and Recharts',
    contact: 'Contact',
    notFoundTitle: 'This page does not exist.',
    notFoundBody: 'The link may be old, or the page may have moved. The three case studies are still here.',
    notFoundCta: 'Go to the home page',
  },
  home: {
    metaTitle: 'Anderson Tavares — E-commerce Operations & Customer Experience',
    metaDescription:
      'Late delivery is the strongest signal of customer dissatisfaction in this marketplace. Measured across 99,441 orders, predicted honestly, and explained through 9,139 written complaints.',
    eyebrow: 'E-commerce Operations & Customer Experience · Anderson Tavares',
    subtitle: 'A Reproducible Data Science Study',
    title: 'Late delivery is the strongest signal of customer dissatisfaction.',
    lead:
      'I measured it across 99,441 Olist orders. Then I asked the two questions that follow: can a model see the risk at checkout, and what do customers actually write when the parcel goes wrong?',
    thesis:
      'One dataset. Three questions: which levers move satisfaction and repeat purchase, can late orders be ranked honestly, and what do the complaints say in the customers’ own words?',
    primaryCta: 'Read the operations analysis',
    secondaryCta: 'See all three projects',
    heroPlate: {
      label: 'The finding, in two numbers',
      lateLabel: 'Late delivery',
      lateValue: '2.27',
      onTimeLabel: 'On time',
      onTimeValue: '4.29',
      footnote:
        'Mean review score. 6,535 of 96,476 deliveries — 6.77% — arrived after the promised date. This is an association, not a causal effect.',
    },
    projectsHeading: 'Three projects, one thread',
    projectsIntro:
      'Each case study states its question, its scope, the method, the result, and what the data cannot support. The limitations are part of the argument, not a footnote.',
    projects: [
      {
        slug: 'retail-analytics',
        number: '01',
        title: 'E-commerce Performance & Fulfillment Analytics',
        question: 'Which levers actually move customer satisfaction and repeat purchase?',
        headline: 'R$ 16.0M in recorded payment value. 96.9% of customers buy exactly once.',
        headlineNote:
          'Late delivery is concentrated on the São Paulo → Rio crossing: 14.17% late, against 4.49% within São Paulo. The pattern is associational; the data do not identify the carrier or the cause.',
        method: 'PostgreSQL · dbt · SQL · Python',
        tags: ['dbt', 'PostgreSQL', 'cohorts', 'delivery'],
        cta: 'Read the case study',
      },
      {
        slug: 'late-delivery',
        number: '02',
        title: 'Late-Delivery Risk Prediction & Temporal Validation',
        question: 'At the moment of purchase, can we rank orders by their risk of arriving late?',
        headline: 'AUC 0.685. The riskiest 10% contains 19.7% of late orders.',
        headlineNote:
          'That is 1.97× the base rate — a modest ranking signal, not a deployment-ready queue. The top 5% is less precise than the top 10%.',
        method: 'Python · pandas · scikit-learn',
        tags: ['temporal holdout', 'calibration', 'capacity', 'no-go'],
        cta: 'Read the case study',
      },
      {
        slug: 'voice-of-customer',
        number: '03',
        title: 'Customer Complaint Topic Modeling & Comparative Analysis',
        question: 'What do 9,139 written complaints say, and how do late orders differ?',
        headline: 'Late complaints are about the parcel: 65.7% against 18.5%.',
        headlineNote:
          'On-time complaints are about the product: 68.9% against 18.1%. The corpus is selected by outcome, and the report states that before the result.',
        method: 'Python · NLP · LDA topic modelling',
        tags: ['LDA', 'compositional', 'selection', 'audit'],
        cta: 'Read the case study',
      },
    ],
    work: {
      heading: 'How I work',
      intro: 'The analysis is only as good as the path from the raw file to the number on the page.',
      items: [
        {
          icon: 'pipeline',
          title: 'Reproducible by default',
          body:
            'Raw CSVs stay text, casts happen in dbt staging, and every mart is tested. One command rebuilds the analysis from a pinned download.',
        },
        {
          icon: 'clock',
          title: 'Temporal validation',
          body:
            'The model trains only on labels that had matured before the cutoff. The naive split removed 3,852 in-flight orders with a 39.1% late rate.',
        },
        {
          icon: 'uncertainty',
          title: 'Uncertainty on the number',
          body:
            'Bootstrap intervals, confidence intervals and seed refits come with the estimate. A single point is not a result.',
        },
        {
          icon: 'limits',
          title: 'Limitations before recommendations',
          body:
            'No carrier identifier, no cost model, a 25-month snapshot. Saying so is part of the finding, not a disclaimer at the end.',
        },
      ],
    },
    credibility: [
      { value: '99,441', label: 'orders analysed' },
      { value: 'PostgreSQL + dbt', label: 'tested pipeline' },
      { value: '91', label: 'dbt data tests' },
      { value: '54', label: 'Python tests' },
      { value: 'EN / PT', label: 'every page translated' },
    ],
    closing: {
      heading: 'The measurement is the easy part. Deciding what it means is the work.',
      body:
        'If you are hiring for data analyst or data scientist work, the method and the caveats are the part I would most like to discuss.',
      cta: 'About and contact',
    },
  },
  projects: {
    'retail-analytics': {
      metaTitle: 'E-commerce Performance & Fulfillment Analytics — Anderson Tavares',
      metaDescription:
        '99,441 Olist orders in PostgreSQL and dbt: R$ 16.0M in recorded payment value, a 3.12% repeat rate, and a late-delivery problem concentrated on the São Paulo → Rio crossing.',
      kicker: 'Project 01 · E-commerce Performance & Fulfillment Analytics',
      title: 'E-commerce Performance & Fulfillment Analytics',
      deck:
        'A dbt and PostgreSQL analysis of 99,441 orders. The uncomfortable finding is that this is an acquisition business, and that lateness is concentrated on one crossing rather than explained by seller quality.',
      heroStats: [
        { value: 'R$ 16.0M', label: 'recorded payment value in 25 months', note: 'R$ 160.99 average order; freight is 14.1% of it. This is payment value, not realized revenue after refunds.' },
        { value: '96.9%', label: 'customers buy exactly once', note: '3.12% ever repeat; 0.48% in the next calendar month.' },
        { value: '6.77%', label: 'deliveries arrive late', note: 'Late orders average 2.27 stars against 4.29 on time.' },
      ],
      sectionLabels: {
        question: 'The question',
        why: 'Why it matters',
        data: 'Data and scope',
        method: 'Method',
        findings: 'What the data shows',
        implications: 'What I would do',
        limitations: 'Limitations',
        reproduction: 'Reproduce it',
      },
      tocTitle: 'On this page',
      question: [
        'The question was which levers actually move customer satisfaction and repeat purchase, rather than what happened. The marketplace had 99,441 orders and a review score for almost every one. The obvious levers — marketing, loyalty, discounts, seller quality — needed to be separated from the one the data kept pointing at.',
        'Three findings came out of it. Recorded payment value grows through acquisition, not retention. The promised delivery date is conservative almost everywhere. And the minority of late deliveries is not spread evenly across the country: it concentrates on a single crossing.',
      ],
      why: [
        'If 96.9% of customers never place a second order, a loyalty programme would spend money to influence a decision almost nobody is making. The growth question becomes how to acquire more customers or raise order value per visit. That is a different operating model from the one a retention dashboard implies.',
        'The delivery finding matters for a second reason: it is the strongest relationship in the dataset. A late order averages 2.27 stars; an on-time order averages 4.29. The conditions associated with lateness also account for a large share of the dissatisfaction the marketplace can measure.',
      ],
      data: [
        'The dataset is the Olist Brazilian e-commerce dataset: 99,441 orders placed between September 2016 and October 2018, across nine related tables — orders, items, payments, reviews, products, sellers, customers, geolocation and category translation.',
        'The analysis covers 96,476 deliveries with an observed delivery timestamp. Orders without one are kept as separate buckets rather than imputed: cancelled or unavailable, still open at the snapshot, and eight delivered orders with a missing timestamp. They are not one outcome.',
        'Two scope limits shape every number. The snapshot ends on 17 October 2018, so September and October 2018 are partial months. Reviews are self-selected: only customers who chose to write appear, and their satisfaction is not the population’s. There is no cost, margin, refund or carrier data.',
      ],
      method: {
        intro: [
          'Every number comes from a tested model in projects/01-retail-analytics/dbt_project. Raw CSVs are loaded into PostgreSQL with every column kept as text; casting and renaming happen in dbt staging through macros that treat an empty cell as NULL.',
        ],
        steps: [
          'Aggregate three finer-grained tables before joining them. Order items, payments and reviews are each more granular than an order; a direct join multiplies rows and nothing errors. An order with four items and three payments would count twelve times.',
          'Build marts for revenue by month, category revenue, delivery outcomes, lateness by state, lateness by lane, cohort retention and RFM. Each key is tested with unique and not-null; foreign keys use relationships tests.',
          'Measure lateness in whole days. The promised date is midnight for all 99,441 orders, while the delivery timestamp carries a time. Comparing to the second misclassified 1,292 orders.',
          'Run 91 data tests in dbt build, including month-zero retention equals 100%, the late flag agrees with days late, and a longer promise can never make more orders late.',
        ],
      },
      findings: {
        intro: [
          'Recorded payment value was R$ 16,008,872.12 across 99,441 orders, an average of R$ 160.99. Freight is R$ 2.25M, or 14.1% of what customers paid. November 2017 is the largest month at R$ 1.19M and 7,544 orders, 63% above October — consistent with Black Friday.',
        ],
        bullets: [
          'This is an acquisition business. 93,099 of 96,096 customers placed exactly one order (96.88%). 2,997 ever placed a second, a repeat rate of 3.12%. One-order customers account for 94.1% of recorded payment value; repeat customers for 5.9%.',
          'Ordering again in the next calendar month is 0.48%, and retention stays near 0.2% after that. It does not decay from a high base; it starts low. The offset is a calendar month, not a 30-day window, and the 25-month observation window truncates anyone who would return later. The figure is a floor.',
          'RFM is reported but weak. Frequency barely varies when 96.9% of customers order once, so the frequency score is a count capped at five, not a quintile split. “Champions” means bought recently, spent well and returned at least once — 1,066 customers, not a large loyal segment.',
          '6,535 of 96,476 deliveries arrived after the promised date, 6.77%. Late orders average 2.27 stars against 4.29 for on-time orders. Beyond a week late, about 80% of reviewers give one or two stars, against 9.27% of on-time reviewers.',
          'São Paulo is late on 4.49% of 40,495 deliveries. Rio de Janeiro is late on 12.10% of 12,353; Bahia on 12.16%; Ceará on 13.76%. The average delivered order arrives 11.88 days early, so the promise is conservative almost everywhere.',
          'Seller behaviour does not explain the gap. Sellers dispatch in about three days on lanes with volume. A Rio seller delivering inside Rio is late 4.76% of the time, close to São Paulo’s 4.66%, and 53 of the 65 sellers that ship to both states are worse into Rio. That makes seller quality an unlikely sole explanation, but it does not rule it out.',
          'The lane is where the problem concentrates. São Paulo → Rio carries 8,129 of Rio’s 12,353 deliveries and is late 14.17%. Every intrastate lane with at least 250 deliveries sits at 4.8% or below. The median on the crossing is 12.8 days and the ninetieth percentile is 31.0, so the tail is the problem. This is an observed association: the route marks where to investigate the carrier and hand-off, not proof that the route itself causes the delay.',
          'São Paulo → Rio also carries the thinnest promise: 27.0 days, against 30.3 for the farther São Paulo → Rio Grande do Sul lane, whose median is 13.9 days and p90 is 27.1. Three more days on the promise would report 11.60% instead of 14.17%; seven more would report 8.37%.',
          'Category item value sums to R$ 13.59M against R$ 16.0M of recorded payments because it counts item price only. The gap is freight, not a mistake. The top ten of 74 categories account for 62.4% of item value.',
          'Recorded payment value includes cancelled and unavailable orders — 1,234 orders and R$ 269,735.11, about 1.7% — because a payment was recorded. Excluding them would be a different but equally defensible definition. The report states which one is in use.',
        ],
        outro: [
          'The Rio estimate is an association, not a causal forecast. At São Paulo’s late rate, about 940 of Rio’s 1,495 late orders over the 25-month snapshot would not have been late. Applying the observed review behaviour — 49.36% of late orders score ≤2 against 9.27% of on-time orders — implies roughly 377 fewer one- and two-star reviews over the snapshot. That is cumulative over the observed period, not an annual rate.',
        ],
      },
      implications: {
        intro: [
          'The recommendation follows from where the delay concentrates, not from the size of the review gap. The lane is the first place to investigate; this is not a finding about seller fault.',
        ],
        items: [
          {
            title: 'Investigate the São Paulo → Rio crossing, not seller quality alone',
            body:
              'The crossing carries two thirds of Rio’s orders at 14.17% late. The question for the carriers is why the ninetieth percentile is 31 days on a lane whose median is 12.8, and why 379 orders arrive more than two weeks after the promise. No carrier identifier exists, so this needs the operational side, not another query.',
          },
          {
            title: 'Then recalibrate the promise, lane by lane',
            body:
              'The promise is uniform where the service is not. Three more days would report 11.60% and seven more 8.37%, while the average parcel arrives 10.9 days early. Widening a promise changes the measurement rather than the parcel, so it belongs alongside the operational question, not instead of it.',
          },
          {
            title: 'Test the missing-parcel result before acting on it',
            body:
              'Cancelled or unavailable orders score 1.662, essentially tied with orders arriving 8–14 days late at 1.672, while orders still open at the snapshot score 1.796. The earlier version collapsed all three into “never delivered” and mixed a refund with a parcel in transit. Until the difference is tested, it is an observation.',
          },
          {
            title: 'Feed the prediction project',
            body:
              'The delivery buckets are the natural target for Project 02. The constraint is already clear: only features knowable at purchase time may enter the model, and the training labels must have matured before the test cutoff.',
          },
        ],
      },
      limitations: [
        'The dataset is a snapshot from September 2016 to October 2018, not a live feed. September and October 2018 are partial. Anything here is one observation of one period, not a trend.',
        'Reviews are self-selected. 98,673 of 99,441 orders carry a review, but only customers who chose to write appear. A 4.29 average among respondents is not a 4.29 average among all customers.',
        '“Recorded payment value” means the gross value recorded in the payment table. There is no cost, margin, refund or return data, so no statement about profit is possible — only about money collected.',
        'Recorded payment value includes 1,234 orders later cancelled or marked unavailable, worth R$ 269,735.11, because a payment was recorded. Excluding them would be a different and equally defensible definition.',
        'customer_unique_id is derived and imperfect. Repeat-purchase findings are a floor, not a ceiling; a person who changes details may appear twice.',
        'Order counts and item counts are different grains. Products and categories come from fct_order_items; money, delivery and reviews come from fct_orders. Mixing them is the most likely way to produce a wrong total.',
        'A lane is a pair of states, not a measured route. Seller and customer states are the finest geography the dataset carries.',
        'The dataset has no carrier identifier. The lane finding says where the delay concentrates; it cannot identify the carrier or the cause.',
        'Lane figures cover 96,411 of 96,476 delivered orders. The 65 orders whose items came from sellers in more than one state have no single lane.',
        'Where delivery timestamps are missing, 2,965 orders are excluded from delivery statistics rather than imputed, and kept as separate buckets where the customer experience is the subject.',
      ],
      reproduction: {
        intro:
          'The pipeline is one command from a clean clone. The download is revision-pinned and verified by exact byte size, so a changed source fails the build rather than moving a published number.',
        commands: [
          'uv run python tasks.py db-up',
          'uv run python tasks.py data',
          'uv run python tasks.py load',
          'uv run python tasks.py dbt-build',
          'uv run python tasks.py charts',
        ],
        note:
          'dbt build also runs 91 data tests. The report and charts are committed, so the website builds without a database.',
      },
      charts: {
        revenue: {
          title: 'Monthly recorded payment value',
          subtitle: 'Gross payment value; the near-empty edge months are excluded from the chart',
          note: 'mart_revenue_monthly. Recorded payment value, not realized revenue. Excluded: Sep 2016 and Sep–Oct 2018 (24 orders). No orders in Nov 2016; Dec 2016 has one. Bars are months, not a continuous series.',
          description:
            'Column chart of monthly recorded payment value from October 2016 to August 2018. It climbs through 2017, peaks in November 2017 at R$ 1.19M, then flattens near R$ 1.0–1.16M through 2018.',
        },
        categories: {
          title: 'The categories that carry the marketplace',
          subtitle: 'Top 12 by item value; share is of all item value',
          note: 'mart_category_revenue. Labels show item value, share and average item price. Freight is excluded.',
          description:
            'Horizontal bars of the twelve categories with the most item value, best first. Health and beauty leads at R$ 1.26M, followed by watches and gifts at R$ 1.21M and bed, bath and table at R$ 1.04M.',
        },
        delivery: {
          title: 'Average review score by delivery outcome',
          subtitle: 'Mean of the latest review per delivered order; lower is worse',
          note: 'mart_delivery_performance. Bars show mean score; the label gives n and the share of reviews at 2 stars or below.',
          description:
            'Horizontal bars of mean review score by delivery outcome. On-time orders average 4.29 with 9.27% low-star reviews; the three late buckets average 2.72, 1.67 and 1.72; cancelled or unavailable orders average 1.66. The share of one- and two-star reviews is printed with each bar.',
        },
        states: {
          title: 'Late delivery by customer state',
          subtitle: 'States with at least 1,000 delivered orders; the dashed line is the national rate',
          note: 'mart_late_delivery_by_state. Late means delivered after the promised date. n is delivered orders.',
          description:
            'Horizontal bars of late-delivery percentage by customer state, worst first. Ceará is 13.76%, Bahia 12.16% and Rio de Janeiro 12.10%; São Paulo is 4.49% and is highlighted. Each bar carries its number of deliveries.',
        },
        lanes: {
          title: 'Late delivery by seller → customer lane',
          subtitle: 'The 12 worst lanes with at least 250 deliveries, plus the same-state lanes with volume',
          note: 'mart_late_delivery_by_lane. Blue bars are intrastate lanes; the dashed line is the national rate. A lane is a state pair, not a road.',
          description:
            'Horizontal bars of late-delivery percentage by lane. São Paulo to Alagoas is worst at 23.92%, São Paulo to Maranhão 18.98% and São Paulo to Rio de Janeiro 14.17% with 8,129 deliveries. The six same-state lanes shown are at 4.76% or below.',
        },
        cohort: {
          title: 'Repeat purchase by calendar-month offset',
          subtitle: 'Share of eligible customers ordering again; bars are retention, the line is exposure',
          note: 'mart_cohort_retention. Offset 1 means the next calendar month, which can be 28–62 days. Later offsets use older cohorts only; the 25-month window truncates the tail.',
          description:
            'Bars of retention by month offset, starting at 0.48% in month one and staying near 0.2%. A line shows the eligible customer count falling from 96,095 at offset one to 31,243 at offset twelve as younger cohorts drop out.',
        },
        repeat: {
          title: 'How often customers come back',
          subtitle: 'Customers on a log scale; 5+ combines 5, 6, 7, 9 and 17 orders',
          note: 'mart_rfm. One order per customer is the overwhelming majority. Counts are customers, not orders.',
          description:
            'Lollipop chart on a logarithmic horizontal scale. 93,099 customers placed one order (96.88%); 2,745 placed two; 203 placed three; the tail continues to one customer with 17 orders.',
        },
        status: {
          title: 'What the payment total includes',
          subtitle: 'Recorded payment value by order status, on a log scale',
          note: 'fct_orders. Amber marks cancelled or unavailable orders: a payment was recorded, so they remain in the payment total. Realized revenue would exclude them and any refunds.',
          description:
            'Lollipop chart of recorded payment value by order status on a logarithmic scale. Delivered orders hold R$ 15.42M; shipped R$ 177k; cancelled R$ 143k and unavailable R$ 126k, both highlighted; the remaining statuses are smaller.',
        },
      },
    },
    'late-delivery': {
      metaTitle: 'Late-Delivery Risk Prediction & Temporal Validation — Anderson Tavares',
      metaDescription:
        'A checkout-time model on 32,150 temporal holdout orders: ROC AUC 0.685, top-decile lift 1.97×, calibration slope 0.82, and an honest no-go for deployment.',
      kicker: 'Project 02 · Late-Delivery Risk Prediction & Temporal Validation',
      title: 'Late-Delivery Risk Prediction & Temporal Validation',
      deck:
        'A classifier restricted to what is known when the order is placed, evaluated on a temporal holdout. The result is a modest ranking signal and a clear no-go for deployment.',
      heroStats: [
        { value: '32,150', label: 'temporal holdout orders', note: '4.42% late. Trained on 43,691 mature orders at 5.61%.' },
        { value: '0.685', label: 'ROC AUC', note: '95% bootstrap interval 0.671–0.698.' },
        { value: '1.97×', label: 'lift at the top 10%', note: '19.7% recall at 8.7% precision. The top 5% is worse.' },
      ],
      sectionLabels: {
        question: 'The question',
        why: 'Why it matters',
        data: 'Data and scope',
        method: 'Method',
        findings: 'What the model does',
        implications: 'What I would do',
        limitations: 'Limitations',
        reproduction: 'Reproduce it',
      },
      tocTitle: 'On this page',
      question: [
        'Project 01 established that late delivery is the strongest signal of dissatisfaction and that the delay concentrates on the São Paulo → Rio lane. This project asks the forward-looking question: at the moment the order is placed, can we rank orders by their risk of arriving late?',
        'The answer is yes, weakly. The ranking is better than a customer-state baseline and worse than a deployable queue. The interesting part is not the AUC; it is the selection rule that made an earlier version look better than it was.',
      ],
      why: [
        'A model that works at checkout can act before the parcel moves. It could prioritise carrier hand-offs, warn the customer, or reserve service capacity. The value depends entirely on whether the ranking is precise enough at a capacity operations can actually staff — and on whether the score is stable across periods.',
        'The honest answer changes the decision. A top-decile lift of 1.97× does not justify a production queue without a cost model and a prospective pilot. The project is useful because it says so before anyone builds the queue.',
      ],
      data: [
        'The target is is_late: the delivery date is strictly after the promised date. Orders without an observed delivery timestamp have no label and are excluded. That is not the same as “never delivered”: the 2,965 excluded orders are mostly in flight or cancelled at the end of the dataset (1,107 shipped, 619 cancelled, 609 unavailable, and smaller statuses).',
        'Training uses purchases before 2018-01-01 and deliveries before 2018-04-01. The three-month gap is the point. A naive rule — purchase before April, keep only delivered orders — drops every order still in transit on 1 April. Those 3,852 orders are not random: 39.1% were late. Removing them makes the training set look easier than the population it must predict.',
        'After the gap, the mature training set is 43,691 orders at 5.61% late. The test is purchases on or after 2018-04-01 with an observed label: 32,150 orders at 4.42% late. January–March 2018 is kept as a retrospective description only, because its 12.89% late rate reflects the 2018-02/03 backlog.',
      ],
      method: {
        intro: [
          'The feature contract is an allow-list, not a blocklist: a new mart column fails closed until someone adds it on purpose. It permits only information that exists when the order is placed.',
        ],
        steps: [
          'Allowed: purchase month, day of week, hour and weekend flag; promise_days; customer and seller state, plus a same-state flag; order composition (category, counts, item value, freight, value, freight share, weight, volume, photos, missing dimensions); payment count, installments and method flags.',
          'Forbidden: approval time, carrier hand-off, delivery date, delivery duration, days late, the label, review score and order status. Arrival time would predict lateness almost perfectly, which is why including it would make the forecast worthless. A unit test enforces the exclusion.',
          'Model selection uses rolling origin at 2017-07-01, 2017-10-01 and 2018-01-01. Each model is fitted on labels matured three months before the origin and scored on the next three months. Average precision selects logistic regression, 0.119 against 0.108 for boosting.',
          'The final model is refit on the full mature training set and evaluated once on the April–August holdout. Both models are reported there as a sensitivity check, not used to re-select. Metrics are ROC AUC and average precision for ranking, Brier and a calibration summary for probabilities, and precision/recall/lift at 5%, 10% and 20% capacity.',
        ],
      },
      findings: {
        intro: [
          'Logistic regression reaches ROC AUC 0.685 (95% interval 0.671–0.698) and average precision 0.082 (0.076–0.091) against a 4.42% base rate. Gradient boosting reaches AUC 0.679 and AP 0.087. The paired bootstrap difference in AP is −0.0048 (−0.0122 to +0.0036); the interval includes zero, so this holdout does not distinguish them.',
        ],
        bullets: [
          'At 10% capacity — 3,215 orders — the model finds 280 late orders: 8.7% precision, 19.7% recall and 1.97× lift. The 95% bootstrap intervals are 7.7–9.6% precision, 17.7–21.7% recall and 1.77–2.17× lift.',
          'The capacity curve is not monotone. At 5% capacity, 1,608 orders, precision is 7.7% and recall 8.7%; at 20%, 6,430 orders, precision is 9.2% and recall 41.8%. The very highest scores are not the purest, so the model should not be used as a narrow shortlist.',
          'A customer-state baseline captures 12.2% of late orders at 10% capacity, 5.4% precision and 1.22× lift. The model’s 8.7% precision is better, but the gain is modest.',
          'The aggregate probability level is close: mean prediction is 4.26% against 4.42% observed. The deciles are not uniformly calibrated. Middle and upper-middle bins under-predict — the ninth decile predicts 7.0% and observes 9.8% — while the top decile over-predicts, 12.3% against 8.7%. The calibration slope is 0.82 with intercept −0.47. The score is a ranking, not a probability for an individual order.',
          'The signal moves with the period. Monthly AUC ranges from 0.60 to 0.79; top-decile recall falls to 10.4% in August. Rolling origins are weaker still: AUC 0.59–0.62 and average precision 0.056–0.184 across three windows.',
          'Permutation importance ranks promise_days first (a 0.026 drop in AP), then customer_state (0.017) and seller_state (0.003). Basket value, freight, weight, payment and category add almost nothing. purchase_month is slightly negative.',
          'The model class is not settled. Logistic regression won the rolling-origin comparison; boosting was slightly better on the final holdout. Neither paired interval excludes zero. Reporting one as “the model” would overstate what this split can decide.',
        ],
        outro: [
          'The practical reading is narrow. The score can order a review queue better than geography alone, but not well enough to promise a stable yield. The top 5% being less precise than the top 10% is a direct warning against treating the highest scores as a precise shortlist.',
        ],
      },
      implications: {
        intro: [
          'The recommendation is a no-go for production, with a narrow path to a pilot. The constraint is not the code; it is the evidence.',
        ],
        items: [
          {
            title: 'Do not deploy this as a triage queue yet',
            body:
              'The lift is modest, the capacity curve is irregular and there is no cost model. A prospective pilot is defensible only if operations can measure the late rate for reviewed orders against unreviewed ones, with a pre-registered capacity and decision rule.',
          },
          {
            title: 'Do not expose the score as a customer-facing probability',
            body:
              'The mean is close but the slope is 0.82. If a probability is needed, recalibrate on recent delivered orders and monitor it as the regime moves. A single holdout cannot establish calibration stability.',
          },
          {
            title: 'Monitor and retrain as labels mature',
            body:
              'A production system would retrain monthly as outcomes arrive, not freeze the training window at one cutoff. It would track the late rate, the promise distribution and the state mix, because each one moved during the observed period.',
          },
          {
            title: 'Keep the operational question first',
            body:
              'The model confirms that the promise and the seller–customer state pair carry the signal. It does not say that changing the promise causes a better outcome. The causal question remains the corridor question from Project 01.',
          },
        ],
      },
      limitations: [
        'The signal is modest. AUC 0.685 and top-decile lift 1.97× are not enough to justify deployment without a cost model and a prospective pilot.',
        'There is one holdout and a moving regime. Monthly AUC ranges from 0.60 to 0.79 and rolling origins from 0.59 to 0.62. A production decision needs a longer rolling evaluation.',
        'Excluded orders are not a random sample. 2,965 orders have no observable late label; most are in flight or cancelled at the end of the dataset. The model says nothing about whether a cancelled order would have been late.',
        'The training gap costs data. Training before 2018-01-01 avoids delivery-speed selection but discards the period with the highest late rate, January–March 2018.',
        'No carrier or warehouse identifier. The dataset stops at seller and state, so the most plausible operational cause of lateness is not in the model.',
        'The label is the promise, not the customer’s expectation. An order can be late against an aggressive promise and still arrive when the customer expected it.',
        'Multi-seller orders lose their origin. 1,285 orders have no single seller state; imputation keeps them in evaluation but weakens geography for those rows.',
        'Feature importance is associational. Shuffling promise_days breaks its correlation with lane difficulty, so the drop is not the causal effect of changing the promise.',
        'There is no cost model. The dataset has no intervention cost, refund value or margin. The capacity framing avoids inventing one; a real deployment would compare the cost of reviewing an order with the cost of a late delivery.',
      ],
      reproduction: {
        intro:
          'The feature contract, split and evaluation helpers have unit tests, including checks that no forbidden post-purchase column can enter the feature list and that training stops three months before the test cutoff.',
        commands: [
          'uv run python tasks.py db-up',
          'uv run python tasks.py data',
          'uv run python tasks.py load',
          'uv run python tasks.py dbt-build',
          'uv run python tasks.py train',
        ],
        note:
          'train writes model_metrics.json, the permutation-importance table and the report figures. The trained model itself is not committed.',
      },
      charts: {
        calibration: {
          title: 'Calibration on the temporal holdout',
          subtitle: 'Predicted against observed late rate in ten score bins of 3,215 orders each',
          note: 'model_metrics.json. The dashed diagonal is perfect calibration; the horizontal line is the 4.42% observed rate. Mean prediction is 4.26%. The ninth decile predicts 7.0% and observes 9.8%; the top decile predicts 12.3% and observes 8.7%. Slope 0.82, intercept −0.47.',
          description:
            'Scatter plot of predicted against observed late-delivery rate for logistic regression and gradient boosting. The ninth decile predicts 7.0% and observes 9.8%; the top decile predicts 12.3% and observes 8.7%. The observed base rate is 4.42%.',
        },
        capacity: {
          title: 'Precision at review capacity',
          subtitle: 'Reviewing the highest-scoring 5%, 10% or 20% of the 32,150 test orders; the dashed line is the 4.42% base rate',
          note: 'model_metrics.json. Labels give recall, lift and the number of orders reviewed. The dashed line is the 4.42% base rate. Precision at 5% is lower than at 10%.',
          description:
            'Bars of precision at 5%, 10% and 20% capacity: 7.7%, 8.7% and 9.2%. A dashed line marks the 4.42% base rate. Recall rises from 8.7% to 41.8%, and lift from 1.74× to 2.09×.',
        },
        stability: {
          title: 'Stability across time',
          subtitle: 'Rolling-origin average precision by cutoff, and monthly AUC on the holdout',
          note: 'model_metrics.json. Rolling origins train on labels matured three months earlier and score the next three months. Monthly AUC is within the April–August holdout. The dashed line is the 4.42% base rate (0.044 on this axis).',
          description:
            'Two tabs. Rolling origin: average precision by cutoff for logistic and boosting models, from about 0.056 to 0.184 as the late rate rises. Test month: monthly ROC AUC for the holdout, from 0.60 in August to 0.79 in June.',
        },
        importance: {
          title: 'What the model is using',
          subtitle: 'Drop in average precision when one raw feature is shuffled',
          note: 'feature_importance.csv. Raw-feature shuffling keeps a category as one concept. The values are associational, not causal effects.',
          description:
            'Horizontal bars of permutation importance. promise_days leads at 0.026, customer_state follows at 0.017, seller_state at 0.003, and the remaining features are near zero.',
        },
      },
    },
    'voice-of-customer': {
      metaTitle: 'Customer Complaint Topic Modeling & Comparative Analysis — Anderson Tavares',
      metaDescription:
        '9,139 written 1–2 star complaints: late complaints are about the parcel (65.7%) and on-time complaints about the product (68.9%), with the selection stated first.',
      kicker: 'Project 03 · Customer Complaint Topic Modeling & Comparative Analysis',
      title: 'Customer Complaint Topic Modeling & Comparative Analysis',
      deck:
        'A topic model over the Portuguese text customers wrote. Late and on-time customers are not having the same conversation: one is about the parcel, the other about the product.',
      heroStats: [
        { value: '9,139', label: 'usable complaints', note: '1–2 star reviews on delivered orders, at least two tokens after normalisation.' },
        { value: '29.7%', label: 'of complaints are late orders', note: 'Late orders are 6.8% of deliveries. The corpus is selected by outcome.' },
        { value: '65.7% vs 18.5%', label: 'delivery + non-receipt share', note: 'Late complaints against on-time complaints. Product topics go the other way.' },
      ],
      sectionLabels: {
        question: 'The question',
        why: 'Why it matters',
        data: 'Data and scope',
        method: 'Method',
        findings: 'What the complaints say',
        implications: 'What I would do',
        limitations: 'Limitations',
        reproduction: 'Reproduce it',
      },
      tocTitle: 'On this page',
      question: [
        'Project 01 measured late delivery from the order side and found it was the strongest signal of dissatisfaction. This project reads the other side: the Portuguese text customers actually wrote. The question is what they complain about, and whether that changes when the parcel arrives late.',
        'The short answer is that it changes almost completely. Late complaints are about the parcel. On-time complaints are about the product. That is a more useful result than a single sentiment score because the two failures have different owners.',
      ],
      why: [
        'A single “low satisfaction” queue hides two different operational problems. A late order that never arrived needs the delivery operation. An on-time order with the wrong colour needs catalogue, quality or packaging. Routing both to the same team because both scored one star wastes the signal in the text.',
        'The result also changes how review volume should be read. Late orders are 6.8% of deliveries but 29.7% of the complaint corpus, because late orders are both more likely to be reviewed and much more likely to be reviewed badly. A complaint count without its denominator is not a satisfaction metric.',
      ],
      data: [
        'There are 99,224 review rows, but most orders have no written comment, and the ones that do are selected by the outcome. Restricting to delivered orders and the latest review per order gives 96,476 deliveries.',
        'On-time orders: 89,941, with 35,138 comments (39.07%) and 6,490 low-star comments (7.22%). Late orders: 6,535, with 3,762 comments (57.57%) and 2,747 low-star comments (42.04%).',
        'The selection is the first finding, not a caveat at the end. A late order is 1.47 times as likely to receive a written review, and a low-star review is 5.8 times as likely. Late orders are 6.8% of deliveries but 29.7% of the complaints we can read. Every share below is a share of complaints, not of orders or customers.',
        'The corpus contains 9,237 low-star comments; 9,139 retain at least two tokens after normalisation, so 98 one-word verdicts such as “ruim” are dropped. A further 3,039 low-star reviews carry no written comment and never enter.',
      ],
      method: {
        intro: [
          'The method is deliberately simple and fixed before looking at the outcome. The delivery label is joined after the topics are fitted, never used as an input.',
        ],
        steps: [
          'One review per delivered order: the latest by review_created_at, then review_id. Joining all 99,224 review rows directly would add 551 duplicate rows across 547 orders and inflate every denominator.',
          'Keep 1–2 star reviews with a comment. The star rating is the negative signal; the model is not asked to discover sentiment, only to describe what the complaint is about.',
          'Normalise conservatively: lowercase, remove links, digits and punctuation, keep accents, and drop Portuguese function words and seller names. Negation stays, because “não recebi” and “recebi” are different complaints.',
          'Fit LDA with six topics on unigrams and bigrams (min_df 20, max_df 0.5, random_state 0, max_iter 30). Assign each complaint to its highest-weight topic and label the topics from their top terms. A runtime check confirms every topic still contains its anchor term.',
          'Check stability rather than assuming it. Refit with seeds 1–4: mean adjusted Rand index 0.258 against seed 0, mean top-term Jaccard 0.413. The exact partition is not stable; the logistics/product contrast is. A stratified manual audit read 30 complaints, five per topic.',
        ],
      },
      findings: {
        intro: [
          'The comparison is compositional: each topic’s share of late complaints against its share of on-time complaints. The denominators are 2,711 late complaints and 6,428 on-time complaints, and differences are in percentage points with 95% two-proportion intervals.',
        ],
        bullets: [
          'Delivery problems are 39.8% of late complaints against 11.0% of on-time complaints (+28.8 pp, interval +26.8 to +30.8). Non-receipt is 25.9% against 7.5% (+18.4 pp). Delay is 16.2% against 12.6% (+3.6 pp) and is reported separately because it is mixed.',
          'Quality or “not as described” is 26.7% of on-time complaints against 5.6% of late ones (−21.1 pp). Incomplete orders are 22.8% against 4.2% (−18.6 pp), and wrong item, defect or return is 19.4% against 8.3% (−11.1 pp).',
          'Grouping the topics by hand makes the split starker. Delivery and non-receipt together are 65.7% of late complaints and 18.5% of on-time complaints. The three product topics are 18.1% against 68.9%. The grouping is an analyst’s summary, not a model output.',
          'All six topic differences have 95% intervals excluding zero and Benjamini–Hochberg q-values below 0.001. The direction does not depend on forcing each complaint into one topic: using the full distribution, delivery and non-receipt carry 58.9% of late weight against 22.8% of on-time weight; product topics carry 24.9% against 63.1%.',
          'The four-topic alternative does not overturn the headline. At k=4, the delivery/non-receipt topics hold 83.3% of late complaints and 29.3% of on-time complaints; product/order topics hold 16.7% and 70.7%. The same contrast with coarser boundaries.',
          'Six was the initial analysis choice, not a coherence optimum established in advance. A later seed-0 check ranks k=6 highest on UMass coherence (−2.677), but the seed-averaged score is highest at k=4 (−2.628 against −2.739). k=4 merges product and return complaints, so six is retained for granularity. That is a judgement about interpretation, not evidence that six is the true number of topics.',
          'The labels are readable but not reliable at the individual level. The manual audit found 20 of 30 clearly consistent, 5 partly consistent and 5 dominated by another theme. The delay topic was weakest: three of its five sampled complaints were mainly about product quality or wrong items. This is one analyst’s review, not independent coding.',
          '22.7% of complaints have a largest topic weight below 0.5, 7.5% below 0.4, and 31.7% have a second topic at or above 0.3. Mean normalised entropy is 0.522. A late, damaged, incomplete order often has mass on more than one theme.',
        ],
        outro: [
          'The words are evidence of what each topic is about, not a causal explanation. “Correios” appears in the delivery-problem topic, but the dataset has no carrier identifier, so the topic cannot establish who caused a delay.',
        ],
      },
      implications: {
        intro: [
          'The operational implication is two queues, not one. Reducing lateness would remove the largest source of late complaints, but it would not touch the product and completeness complaints that dominate the on-time group.',
        ],
        items: [
          {
            title: 'Separate the queue by cause, not by star rating',
            body:
              'Route complaints from late orders to the delivery operation, and product complaints from on-time orders to catalogue, quality and packaging. The largest late gap is delivery; the largest on-time gap is product quality. One “low satisfaction” bucket hides both.',
          },
          {
            title: 'Report complaints per delivered order, within outcome',
            body:
              'The review rate itself changes with the outcome: 57.6% of late orders have a comment against 39.1% of on-time orders, and 42.0% have a low-star comment against 7.2%. A raw complaint count without that denominator is not a satisfaction KPI.',
          },
          {
            title: 'Code a sample by hand before operational use',
            body:
              'The six topics are a derived summary with subjective labels. A few hundred hand-coded complaints would establish whether the boundaries between “delay”, “delivery problem” and “not received” are stable enough for triage.',
          },
          {
            title: 'Keep the product queue funded',
            body:
              'Even a perfect delivery operation would leave the on-time complaints. 68.9% of the on-time complaint mix is product-related, and those orders met the promise. The two problems have different owners and different fixes.',
          },
        ],
      },
      limitations: [
        'No causal claim. A topic being more common among late complaints is an association between a delivery outcome and the subject of a complaint. The selected corpus makes even the association descriptive of complainers.',
        'No claim about all customers. 57.6% of late orders have a comment against 39.1% of on-time orders. The people who write are not a random sample, and nothing here estimates the complaint mix of the silent majority.',
        'No claim about positive experience. Only 1–2 star reviews are modelled. The analysis says what dissatisfied people complained about, not what satisfied people valued.',
        'Topics are a simplification: six topics, hard assignment, bag-of-words features, subjective labels and overlapping categories. The seed-stability check shows the exact partition is not stable even though the broad grouping is.',
        'A complaint about a late, damaged, incomplete order is forced into one topic. 22.7% have a largest weight below 0.5, and the mean normalised entropy is 0.522.',
        'Different values of k would produce a different but not necessarily wrong partition. k=4 preserves the headline contrast with coarser boundaries.',
        'One marketplace and one period: Olist, September 2016 to October 2018. The vocabulary and the delivery operation are specific to it.',
        'The label is the promise, not the carrier scan. is_late means the delivered timestamp is after the promised date. There is no carrier, route or warehouse, so “delivery problem” cannot be assigned to a responsible party.',
        'The manual audit is one analyst’s reading of 30 complaints. It supports the broad reading of the corpus, not the exact assignment of an individual complaint.',
      ],
      reproduction: {
        intro:
          'One script reads the built marts, fits the model and writes every table and figure. The model is deterministic given the pinned scikit-learn version, the seed and the fixed corpus.',
        commands: [
          'uv run python tasks.py db-up',
          'uv run python tasks.py data',
          'uv run python tasks.py load',
          'uv run python tasks.py dbt-build',
          'uv run python tasks.py topics',
          'uv run pytest',
        ],
        note:
          'topics writes review_scope.json, topic_prevalence.csv, topic_groups.csv, topic_groups_k4.csv, topic_selection.csv and the figures. It fails if a library upgrade reorders the topic anchors instead of silently relabelling them.',
      },
      charts: {
        groups: {
          title: 'The complaint mix within each outcome',
          subtitle: 'Share of late and on-time complaints in three hand-grouped themes',
          note: 'topic_groups.csv. Delivery and non-receipt combine two topics; Product combines quality, incomplete order and wrong item/return. Delay is the mixed theme and is not counted as logistics.',
          description:
            'Grouped horizontal bars. Delivery and non-receipt are 65.7% of late complaints against 18.5% of on-time; product is 18.1% against 68.9%; mixed delay is 16.2% against 12.6%. Difference labels give percentage-point gaps and intervals.',
        },
        topics: {
          title: 'Each topic, late against on-time',
          subtitle: 'Share of complaints in each outcome; the line is the gap',
          note: 'topic_prevalence.csv. Intervals are 95% two-proportion intervals; all six differences exclude zero after Benjamini–Hochberg correction.',
          description:
            'Dumbbell chart for six topics. Delivery problem is 39.8% of late against 11.0% of on-time; not received 25.9% against 7.5%; delay 16.2% against 12.6%; quality 5.6% against 26.7%; incomplete 4.2% against 22.8%; wrong item 8.3% against 19.4%.',
        },
        coherence: {
          title: 'Why six topics',
          subtitle: 'UMass coherence by number of topics, seed 0 against the mean of seeds 0–2',
          note: 'topic_selection.csv. k=6 is highest at seed 0; the seed-averaged score is highest at k=4. Six was the initial choice and is retained for granularity, not because it is the coherence optimum.',
          description:
            'Line chart of coherence for k=4 to 10. The seed-0 line peaks at k=6 (−2.677); the seed-averaged line peaks at k=4 (−2.628). The differences are small relative to the spread across seeds.',
        },
        mixed: {
          title: 'Many complaints are mixed',
          subtitle: 'How much weight the largest topic carries',
          note: 'review_scope.json. A largest weight below 0.5 means no single theme dominates; mean normalized entropy is 0.522 on a 0–1 scale. Hard assignment is a simplification, and it is measurable.',
          description:
            'Stat bars: 22.7% of complaints have a largest topic weight below 0.5, 7.5% below 0.4, and 31.7% have a second topic at or above 0.3. Mean normalised entropy is 0.522 on a 0–1 scale.',
        },
      },
    },
  },
  about: {
    metaTitle: 'About — Anderson Tavares',
    metaDescription:
      'Data analyst working in SQL, dbt and Python. Marketplace and operations data, reproducible pipelines, and written analysis that states its limitations.',
    title: 'Anderson Tavares',
    intro: [
      'Data analyst. I work in SQL as a first language, model data with dbt, and write the analysis so someone who does not write SQL can follow the argument and recheck the numbers.',
      'Most of my work is on marketplace and operations data, where the hard part is deciding what a number means. The three projects here are one dataset and three different questions: measurement, prediction and text.',
    ],
    lookingFor: 'Looking for data analyst or data scientist roles.',
    toolsHeading: 'What I work with',
    tools: [
      { area: 'Querying and modelling', items: 'PostgreSQL, dbt, advanced SQL (window functions, CTEs), dimensional modelling' },
      { area: 'Analysis', items: 'Python (pandas, scikit-learn, matplotlib, seaborn), statistical reasoning, topic modelling' },
      { area: 'Engineering', items: 'Git, Docker, pytest, GitHub Actions, uv, React and TypeScript for the published site' },
      { area: 'Communication', items: 'Technical writing, decision memos, bilingual documentation (EN/PT)' },
    ],
    principlesHeading: 'How I work',
    principles: [
      {
        title: 'Start from a decision',
        body: 'Every analysis exists to answer a question someone would pay to have answered. If the answer would not change an action, it is a description, not an analysis.',
      },
      {
        title: 'Test the data, not just the code',
        body: 'If an assumption breaks, the build should fail loudly. The dbt project carries 91 data tests, including month-zero retention and the agreement between the late flag and days late.',
      },
      {
        title: 'Write the limitations down',
        body: 'A finding without its caveats is a liability. Every project states what the data cannot support before the recommendation, not after it.',
      },
      {
        title: 'Prefer the honest number',
        body: 'The earlier late-delivery model looked better because its training rule removed the slowest orders. Fixing that lowered the headline lift. The lower number is the one on this site.',
      },
    ],
    contactHeading: 'Contact',
    contactNote:
      'The fastest way to reach me is email. I am happy to walk through the SQL, the evaluation design, or the parts that did not work.',
    links: [
      { label: 'GitHub', value: 'AndersonTavares0', href: 'https://github.com/AndersonTavares0' },
      { label: 'LinkedIn', value: 'andersonlimatavares', href: 'https://www.linkedin.com/in/andersonlimatavares' },
      { label: 'Email', value: 'anderson.g.tavares@gmail.com', href: 'mailto:anderson.g.tavares@gmail.com' },
    ],
    note:
      'Code is MIT. The Olist dataset is CC BY-NC-SA 4.0, non-commercial, and is not redistributed here. All published numbers are aggregates from the tested marts; no raw review text is reproduced.',
  },
  footer: {
    line: 'E-commerce Operations & Customer Experience. A Reproducible Data Science Study.',
    source: 'Source and reproduction',
    licence: 'Code MIT · Data CC BY-NC-SA 4.0',
    note: 'Built as a static site. No tracking, no cookies, no analytics.',
  },
  common: {
    figure: 'Figure',
    sourceLabel: 'Source',
    definition: 'Definition',
    readCase: 'Read the case study',
    published: 'Published',
    methodLabel: 'Method',
    limitationLabel: 'What this cannot say',
    openSource: 'View the repository',
    backHome: 'Back to the home page',
  },
}
