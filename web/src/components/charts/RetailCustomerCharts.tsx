import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartText } from '../../content/chartText'
import { statusLabels } from '../../content/labels'
import type { ChartCopy, Lang } from '../../content/types'
import {
  formatBrl,
  formatCompactBrl,
  formatCompactValue,
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

export function CohortPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const data = p01Derived.cohort.map((row, index) => ({
    offset: row.month_offset,
    retention: row.retention_pct,
    // Twelve labels do not fit at phone width; every second one is enough.
    retentionLabel: narrow && index % 2 === 1 ? '' : formatPct(row.retention_pct, lang, 2),
    eligible: row.eligible_customers,
    active: row.active_customers,
    cohorts: row.cohorts,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: chartColors.brand }} />
          {ui.retentionBars}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4" style={{ background: chartColors.accent }} />
          {ui.eligibleLine}
        </span>
      </div>
      <div className="h-[320px] w-full sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <ComposedChart data={data} margin={{ top: 24, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="offset"
              tick={axisTickSmall}
              tickLine={false}
              axisLine={{ stroke: chartColors.rule }}
              label={{
                value: lang === 'pt' ? 'Meses após o primeiro pedido' : 'Months after first order',
                position: 'insideBottom',
                offset: -2,
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <YAxis
              yAxisId="left"
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              width={44}
              domain={[0, 0.6]}
              ticks={[0, 0.2, 0.4, 0.6]}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 1)}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              width={48}
              domain={[0, 100000]}
              ticks={[0, 50000, 100000]}
              tickFormatter={(value: number) => `${formatNumber(value / 1000, lang, 0)}k`}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              labelFormatter={(value) =>
                lang === 'pt' ? `Mês ${value} após a compra` : `Month ${value} after first order`
              }
              formatter={(value, name) => {
                if (name === 'retention') return [formatPct(Number(value), lang, 2), ui.retention]
                return [formatNumber(Number(value), lang), ui.eligible]
              }}
            />
            <Bar isAnimationActive={false} yAxisId="left" dataKey="retention" fill={chartColors.brand} radius={[2, 2, 0, 0]} maxBarSize={26}>
              <LabelList
                dataKey="retentionLabel"
                position="top"
                fill="var(--muted)"
                fontSize={8.5}
              />
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="eligible"
              stroke={chartColors.accent}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

interface LollipopShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: { annotation?: string; emphasis?: boolean }
  showLabel?: boolean
}

function Lollipop({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  showLabel = true,
}: LollipopShapeProps) {
  const cy = y + height / 2
  const color = payload?.emphasis ? chartColors.accent : chartColors.brand
  return (
    <g>
      <line x1={x} x2={x + width} y1={cy} y2={cy} stroke={color} strokeWidth={1.5} />
      <circle cx={x + width} cy={cy} r={5} fill={color} stroke="var(--surface)" strokeWidth={1.5} />
      {showLabel ? (
        <text x={x + width + 9} y={cy + 3.5} fill="var(--muted)" fontSize={9.5}>
          {payload?.annotation}
        </text>
      ) : null}
    </g>
  )
}

export function RepeatPurchasePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const data = p01Derived.repeat.map((row) => {
    const share = (row.customers / p01.repeatSummary.customers) * 100
    return {
      label: row.frequency === 5 ? '5+' : String(row.frequency),
      customers: row.customers,
      annotation: narrow
        ? formatPct(share, lang, 2)
        : `${formatNumber(row.customers, lang)} · ${formatPct(share, lang, 2)}`,
    }
  })

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="h-[230px] w-full sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: narrow ? 56 : 128, bottom: 4, left: 6 }}
            barCategoryGap={8}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              scale="log"
              domain={[1, 100000]}
              ticks={[1, 10, 100, 1000, 10000, 100000]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatNumber(value, lang)}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={28}
              tick={{ fill: 'var(--ink-soft)', fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatNumber(Number(value), lang), ui.customers]}
            />
            <Bar isAnimationActive={false} dataKey="customers" shape={<Lollipop />} maxBarSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
        {ui.ordersPlaced} · {ui.repeatX}
      </p>
    </ChartFrame>
  )
}

export function OrderStatusPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const labels = statusLabels[lang]
  const data = p01.orderStatus.map((row) => ({
    name: labels[row.order_status] ?? row.order_status,
    revenue: row.revenue_brl,
    orders: row.orders,
    emphasis: row.order_status === 'canceled' || row.order_status === 'unavailable',
    annotation: `${formatCompactBrl(row.revenue_brl, lang)} · ${formatNumber(row.orders, lang)} ${ui.orders}`,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="h-[330px] w-full sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: narrow ? 8 : 190, bottom: 4, left: 6 }}
            barCategoryGap={8}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              scale="log"
              domain={[100, 20000000]}
              ticks={[100, 1000, 10000, 100000, 1000000, 10000000]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatCompactValue(value, lang)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={92}
              tick={{ fill: 'var(--ink-soft)', fontSize: 10.5 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatBrl(Number(value), lang), ui.revenueX]}
            />
            <Bar
              isAnimationActive={false}
              dataKey="revenue"
              shape={<Lollipop showLabel={!narrow} />}
              maxBarSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
