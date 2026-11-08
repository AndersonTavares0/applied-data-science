import p01Json from './p01.json'
import p02Json from './p02.json'
import p03Json from './p03.json'
import type { Lang } from '../content/types'

export interface P01Data {
  totals: {
    revenue_brl: number
    orders: number
    customers: number
    avg_order_value_brl: number
    freight_brl: number
    freight_share_pct: number
  }
  deliverySummary: {
    late_orders: number
    delivered_orders: number
    late_pct: number
    late_review: number
    on_time_review: number
    avg_days_early: number
  }
  repeatSummary: {
    customers: number
    one_order_customers: number
    repeat_customers: number
    one_order_pct: number
    repeat_pct: number
    revenue_brl: number
    one_order_revenue_brl: number
    one_order_revenue_pct: number
  }
  revenueMonthly: {
    month: string
    orders: number
    active_customers: number
    revenue_brl: number
    freight_brl: number
    avg_order_value_brl: number
  }[]
  categories: {
    category: string
    orders: number
    items: number
    revenue_brl: number
    avg_item_price_brl: number
  }[]
  deliveryBuckets: {
    delivery_bucket: string
    bucket_order: number
    orders: number
    pct_of_orders: number
    reviewed_orders: number
    avg_review_score: number
    pct_review_score_le2: number
    avg_delivery_days: number | null
  }[]
  states: {
    customer_state: string
    delivered_orders: number
    late_orders: number
    late_pct: number
    avg_delivery_days: number
    avg_review_score: number
  }[]
  lanes: {
    lane: string
    seller_state: string
    customer_state: string
    is_intrastate: boolean
    delivered_orders: number
    late_orders: number
    late_pct: number
    avg_handling_days: number
    avg_transit_days: number
    avg_delivery_days: number
    p50_delivery_days: number
    p90_delivery_days: number
    promised_days: number
    avg_days_late_when_late: number | null
    orders_over_2w_late: number
    late_pct_if_promise_plus3: number
    late_pct_if_promise_plus7: number
  }[]
  cohort: {
    month_offset: number
    cohorts: number
    eligible_customers: number
    active_customers: number
    retention_pct: number
  }[]
  repeatDistribution: { frequency: number; customers: number }[]
  rfm: {
    rfm_segment: string
    customers: number
    share_pct: number
    avg_spend_brl: number
    avg_recency_days: number
  }[]
  orderStatus: {
    order_status: string
    orders: number
    revenue_brl: number
    share_pct: number
  }[]
}

interface CalibrationPoint {
  predicted: number
  observed: number
  n: number
}

interface CapacityPoint {
  capacity: number
  n_selected: number
  precision: number
  recall: number
  lift: number
  prevalence: number
}

interface ModelMetrics {
  n: number
  late_rate: number
  roc_auc: number
  average_precision: number
  brier: number
  mean_prediction: number
  top_decile: CapacityPoint
}

interface ModelBlock {
  metrics: ModelMetrics
  calibration: CalibrationPoint[]
  capacity: CapacityPoint[]
}

interface RollingPoint {
  cutoff: string
  train_cutoff: string
  train_n: number
  test_n: number
  late_rate: number
  roc_auc: number
  average_precision: number
  top_decile_recall: number
  top_decile_precision: number
}

interface Interval {
  point: number
  ci_low: number
  ci_high: number
}

export interface P02Data {
  train: { n: number; late_rate: number; fit_n: number; validation_n: number }
  test: { n: number; late_rate: number }
  maturity_gap: { n: number; late_rate: number }
  excluded: { n: number; by_status: Record<string, number> }
  selection: {
    origins: string[]
    mean_average_precision: { logistic: number; boosting: number }
    selected: string
  }
  models: { logistic: ModelBlock; boosting: ModelBlock }
  selected_model: {
    kind: string
    bootstrap: {
      n_resamples: number
      roc_auc: Interval
      average_precision: Interval
      brier: Interval
      top_precision: Interval
      top_recall: Interval
      top_lift: Interval
    }
    calibration_summary: {
      intercept: number
      slope: number
      mean_prediction: number
      observed_rate: number
    }
    monthly: {
      month: string
      n: number
      late_rate: number
      roc_auc: number
      average_precision: number
      top_decile_recall: number
    }[]
    paired_differences: {
      logistic_minus_boosting: Record<
        'average_precision' | 'roc_auc',
        { difference: number; ci_low: number; ci_high: number; share_a_better: number }
      >
    }
  }
  rolling_origin: { logistic: RollingPoint[]; boosting: RollingPoint[] }
  baselines: {
    constant_prevalence: { brier: number; top_decile: null }
    state_rate: { brier: number; top_decile: CapacityPoint }
  }
  importance: { feature: string; importance: number }[]
}

interface OutcomeScope {
  orders: number
  with_comment: number
  comment_rate_pct: number
  low_star_comments: number
  low_star_comment_rate_pct: number
}

interface GroupRow {
  group: string
  late_n: number
  on_time_n: number
  late_share_pct: number
  on_time_share_pct: number
  diff_pp: number
  ci_low_pp: number
  ci_high_pp: number
  late_weight_share_pct: number
  on_time_weight_share_pct: number
}

export interface TopicRow {
  topic: number
  label: string
  n: number
  share_pct: number
  late_n: number
  on_time_n: number
  late_share_pct: number
  on_time_share_pct: number
  diff_pp: number
  ci_low_pp: number
  ci_high_pp: number
}

interface SelectionRow {
  topics: number
  seed0_coherence: number
  mean_coherence: number
  sd_coherence: number
  perplexity: number
}

export interface P03Data {
  delivered_orders: number
  by_outcome: { on_time: OutcomeScope; late: OutcomeScope }
  corpus: {
    low_star_reviews: number
    low_star_comments: number
    usable_comments: number
    dropped_short_comments: number
    late_comments: number
    late_share_pct: number
    min_tokens: number
  }
  groups: GroupRow[]
  groups_k4: GroupRow[]
  model: {
    method: string
    topics: number
    seed: number
    perplexity: number
    coherence: { metric: string; mean: number; per_topic: number[] }
    selection: {
      seeds: number[]
      seed0_best: number
      mean_best: number
      selected: number
      note: string
      rows: SelectionRow[]
    }
    stability: {
      reference_seed: number
      seeds: number[]
      mean_jaccard: number
      min_jaccard: number
      max_jaccard: number
      mean_adjusted_rand: number
      min_adjusted_rand: number
      max_adjusted_rand: number
      per_topic_jaccard: number[]
    }
    soft_assignment: {
      max_weight_quantiles: Record<string, number>
      share_max_below_0_5_pct: number
      share_max_below_0_4_pct: number
      share_second_at_least_0_3_pct: number
      share_second_at_least_0_25_pct: number
      mean_normalized_entropy: number
    }
    mean_weight_by_outcome: { late: number[]; on_time: number[] }
  }
  tables: {
    topic_prevalence: TopicRow[]
    topic_groups: GroupRow[]
    topic_groups_k4: GroupRow[]
    topic_selection: SelectionRow[]
    topic_terms: { topic: number; label: string; rank: number; term: string }[]
  }
}

export const p01 = p01Json as unknown as P01Data
export const p02 = p02Json as unknown as P02Data
export const p03 = p03Json as unknown as P03Data

export const p01Derived = {
  // The committed chart excludes the launch and partial edge months; the API
  // keeps them so the exclusion is auditable rather than baked into the export.
  revenue: p01.revenueMonthly.filter((row) => {
    const month = row.month.slice(0, 7)
    return month >= '2016-10' && month <= '2018-08'
  }),
  excludedOrders: p01.revenueMonthly
    .filter((row) => {
      const month = row.month.slice(0, 7)
      return month < '2016-10' || month > '2018-08'
    })
    .reduce((sum, row) => sum + row.orders, 0),
  topCategories: p01.categories.slice(0, 12),
  categoryTotal: p01.categories.reduce((sum, row) => sum + row.revenue_brl, 0),
  topCategoryShare:
    (p01.categories.slice(0, 12).reduce((sum, row) => sum + row.revenue_brl, 0) /
      p01.categories.reduce((sum, row) => sum + row.revenue_brl, 0)) *
    100,
  // Twelve worst lanes for readability, plus every same-state lane with
  // volume: the comparison is the point, and dropping it would lose it.
  lanes: [
    ...p01.lanes.slice(0, 12),
    ...p01.lanes.filter((row) => row.is_intrastate && row.delivered_orders >= 250),
  ]
    .filter((row, index, all) => all.findIndex((x) => x.lane === row.lane) === index)
    .sort((a, b) => b.late_pct - a.late_pct),
  cohort: p01.cohort.filter((row) => row.month_offset >= 1 && row.month_offset <= 12),
  repeat: [1, 2, 3, 4].map((frequency) => ({
    frequency,
    customers:
      p01.repeatDistribution.find((row) => row.frequency === frequency)?.customers ?? 0,
  })).concat({
    frequency: 5,
    customers: p01.repeatDistribution
      .filter((row) => row.frequency >= 5)
      .reduce((sum, row) => sum + row.customers, 0),
  }),
}

const locales: Record<Lang, string> = { en: 'en-US', pt: 'pt-BR' }

export function formatNumber(value: number, lang: Lang, digits = 0): string {
  return new Intl.NumberFormat(locales[lang], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatPct(value: number, lang: Lang, digits = 1): string {
  return `${formatNumber(value, lang, digits)}%`
}

export function formatPp(value: number, lang: Lang, digits = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatNumber(value, lang, digits)} pp`
}

export function formatDecimal(value: number, lang: Lang, digits = 3): string {
  return formatNumber(value, lang, digits)
}

export function formatMillions(value: number, lang: Lang): string {
  return lang === 'pt'
    ? `R$ ${formatNumber(value / 1_000_000, lang, 1)} mi`
    : `R$ ${formatNumber(value / 1_000_000, lang, 1)}m`
}

export function formatCompactNumber(value: number, lang: Lang): string {
  if (value >= 10_000) return `${formatNumber(value / 1000, lang, 0)}k`
  if (value >= 1_000) return `${formatNumber(value / 1000, lang, 1)}k`
  return formatNumber(value, lang)
}

export function formatCompactBrl(value: number, lang: Lang): string {
  if (value >= 1_000_000) {
    return `R$ ${formatNumber(value / 1_000_000, lang, 1)}${lang === 'pt' ? 'mi' : 'm'}`
  }
  if (value >= 10_000) return `R$ ${formatNumber(value / 1000, lang, 0)}k`
  return `R$ ${formatNumber(value, lang, 0)}`
}

// Axis ticks, not prose: one significant unit and no currency prefix.
export function formatCompactValue(value: number, lang: Lang): string {
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, lang, 0)}M`
  if (value >= 1_000) return `${formatNumber(value / 1000, lang, 0)}k`
  return formatNumber(value, lang)
}

export function formatBrl(value: number, lang: Lang): string {
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMonth(month: string, lang: Lang, short = true): string {
  const date = new Date(`${month.slice(0, 7)}-15T00:00:00`)
  if (!short) {
    return date.toLocaleDateString(locales[lang], { month: 'short', year: 'numeric' })
  }
  const label = date.toLocaleDateString(locales[lang], { month: 'short' }).replace('.', '')
  return `${label} ’${String(date.getFullYear()).slice(2)}`
}

export function formatMonthLong(month: string, lang: Lang): string {
  const date = new Date(`${month.slice(0, 7)}-15T00:00:00`)
  return date.toLocaleDateString(locales[lang], { month: 'long', year: 'numeric' })
}

export function formatCutoff(cutoff: string, lang: Lang): string {
  return formatMonth(cutoff, lang, false)
}
