import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartText } from '../../content/chartText'
import { deliveryBucketLabels } from '../../content/labels'
import type { ChartCopy, Lang } from '../../content/types'
import {
  formatCompactNumber,
  formatDecimal,
  formatNumber,
  formatPct,
  p01,
  p01Derived,
} from '../../data'
import { useNarrow } from '../../lib/useNarrow'
import { ChartFrame } from './ChartFrame'
import { axisTickSmall, chartColors, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './chartTheme'

interface Props {
  lang: Lang
  copy: ChartCopy
  sourceLabel: string
}

export function DeliveryOutcomePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const labels = deliveryBucketLabels[lang]
  const data = p01.deliveryBuckets.map((row) => ({
    name: labels[row.delivery_bucket] ?? row.delivery_bucket,
    bucket: row.delivery_bucket,
    score: row.avg_review_score,
    low: row.pct_review_score_le2,
    orders: row.orders,
    annotation: narrow
      ? `${formatDecimal(row.avg_review_score, lang, 2)} · ${formatPct(row.pct_review_score_le2, lang, 0)} ≤2`
      : `${formatDecimal(row.avg_review_score, lang, 2)} · ${formatPct(row.pct_review_score_le2, lang, 1)} ≤2 · n=${formatCompactNumber(row.orders, lang)}`,
  }))

  const fillFor = (bucket: string) => {
    if (bucket === 'on time') return chartColors.onTime
    if (bucket.startsWith('late')) return chartColors.late
    if (bucket === 'delivered: missing timestamp') return chartColors.nonDelivery
    return chartColors.alt
  }

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.onTime }} />
          {ui.onTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.late }} />
          {ui.late}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.alt }} />
          {ui.notDelivered}
        </span>
      </div>
      <div className="h-[360px] w-full sm:h-[390px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
            barCategoryGap={10}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 6.3]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              label={{
                value: ui.meanScore,
                position: 'insideBottom',
                offset: -2,
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={122}
              tick={{ fill: 'var(--ink-soft)', fontSize: 10.5 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value, name) => {
                if (name === 'score') return [formatDecimal(Number(value), lang, 2), ui.meanScore]
                return [String(value), String(name)]
              }}
            />
            <Bar isAnimationActive={false} dataKey="score" radius={[0, 2, 2, 0]} maxBarSize={16}>
              {data.map((row) => (
                <Cell key={row.bucket} fill={fillFor(row.bucket)} />
              ))}
              <LabelList
                dataKey="annotation"
                position="right"
                fill="var(--muted)"
                fontSize={9.5}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

export function LateByStatePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const data = p01.states.map((row) => ({
    name: row.customer_state,
    late: row.late_pct,
    orders: row.delivered_orders,
    review: row.avg_review_score,
    days: row.avg_delivery_days,
    annotation: narrow
      ? formatPct(row.late_pct, lang, 1)
      : `${formatPct(row.late_pct, lang, 2)} · ${formatCompactNumber(row.delivered_orders, lang)}`,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.accent }} />
          {lang === 'pt' ? 'São Paulo (maior mercado)' : 'São Paulo (largest market)'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.brand }} />
          {lang === 'pt' ? 'Outros estados' : 'Other states'}
        </span>
      </div>
      <div className="h-[360px] w-full sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 8, bottom: 4, left: 4 }}
            barCategoryGap={8}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 18]}
              ticks={[0, 4, 8, 12, 16]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 0)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={36}
              tick={{ fill: 'var(--ink-soft)', fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatPct(Number(value), lang, 2), ui.latePct]}
            />
            <ReferenceLine
              x={p01.deliverySummary.late_pct}
              stroke={chartColors.muted}
              strokeDasharray="4 3"
              label={{
                value: ui.national,
                position: 'top',
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <Bar isAnimationActive={false} dataKey="late" radius={[0, 2, 2, 0]} maxBarSize={14}>
              {data.map((row) => (
                <Cell
                  key={row.name}
                  fill={row.name === 'SP' ? chartColors.accent : chartColors.brand}
                />
              ))}
              <LabelList
                dataKey="annotation"
                position="right"
                fill="var(--muted)"
                fontSize={9.5}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

export function LateByLanePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const data = p01Derived.lanes.map((row) => ({
    name: row.lane,
    late: row.late_pct,
    orders: row.delivered_orders,
    intrastate: row.is_intrastate,
    transit: row.avg_transit_days,
    p90: row.p90_delivery_days,
    annotation: narrow
      ? formatPct(row.late_pct, lang, 1)
      : `${formatPct(row.late_pct, lang, 1)} · ${formatCompactNumber(row.delivered_orders, lang)}`,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.brand }} />
          {ui.sameState}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.alt }} />
          {ui.interstate}
        </span>
      </div>
      <div className="h-[560px] w-full sm:h-[600px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 8, bottom: 4, left: 4 }}
            barCategoryGap={6}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 28]}
              ticks={[0, 5, 10, 15, 20, 25]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 0)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={82}
              tick={{ fill: 'var(--ink-soft)', fontSize: 10.5 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatPct(Number(value), lang, 2), ui.latePct]}
            />
            <ReferenceLine
              x={p01.deliverySummary.late_pct}
              stroke={chartColors.muted}
              strokeDasharray="4 3"
              label={{
                value: ui.national,
                position: 'top',
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <Bar isAnimationActive={false} dataKey="late" radius={[0, 2, 2, 0]} maxBarSize={12}>
              {data.map((row) => (
                <Cell
                  key={row.name}
                  fill={row.intrastate ? chartColors.brand : chartColors.alt}
                />
              ))}
              <LabelList
                dataKey="annotation"
                position="right"
                fill="var(--muted)"
                fontSize={9}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
