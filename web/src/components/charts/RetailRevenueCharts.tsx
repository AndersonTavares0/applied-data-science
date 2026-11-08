import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartText } from '../../content/chartText'
import { categoryLabels } from '../../content/labels'
import type { ChartCopy, Lang } from '../../content/types'
import {
  formatBrl,
  formatDecimal,
  formatMillions,
  formatMonth,
  formatMonthLong,
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

export function RevenueMonthlyPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const peak = p01Derived.revenue.reduce((best, row) =>
    row.revenue_brl > best.revenue_brl ? row : best,
  )
  const data = p01Derived.revenue.map((row) => ({
    label: formatMonth(row.month, lang),
    full: formatMonthLong(row.month, lang),
    revenue: row.revenue_brl / 1_000_000,
    orders: row.orders,
    isPeak: row.month === peak.month,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="h-[300px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart data={data} margin={{ top: 30, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={axisTickSmall}
              tickLine={false}
              axisLine={{ stroke: chartColors.rule }}
              interval="preserveStartEnd"
              minTickGap={26}
            />
            <YAxis
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              width={narrow ? 64 : 72}
              tickFormatter={(value: number) =>
                value === 0
                  ? 'R$ 0'
                  : `R$ ${formatNumber(value, lang, 1)}${lang === 'pt' ? 'mi' : 'm'}`
              }
              domain={[0, 1.3]}
              ticks={[0, 0.4, 0.8, 1.2]}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatMillions(Number(value) * 1_000_000, lang), ui.revenueAxis]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ''}
            />
            <Bar isAnimationActive={false} dataKey="revenue" radius={[2, 2, 0, 0]} maxBarSize={30}>
              {data.map((row) => (
                <Cell
                  key={row.label}
                  fill={row.isPeak ? chartColors.accent : chartColors.brand}
                />
              ))}
            </Bar>
            <ReferenceDot
              x={data.find((row) => row.isPeak)?.label}
              y={peak.revenue_brl / 1_000_000}
              r={3.5}
              fill={chartColors.accent}
              stroke="var(--surface)"
              label={{
                value: `Black Friday · ${formatMillions(peak.revenue_brl, lang)}`,
                position: 'top',
                fill: chartColors.accent,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

export function CategoryRevenuePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const labels = categoryLabels[lang]
  const total = p01Derived.categoryTotal
  const data = p01Derived.topCategories.map((row) => ({
    name: labels[row.category] ?? row.category,
    revenue: row.revenue_brl / 1_000_000,
    annotation: `${formatMillions(row.revenue_brl, lang)} · ${formatPct(
      (row.revenue_brl / total) * 100,
      lang,
      1,
    )} · ${ui.avgItem} R$ ${formatNumber(row.avg_item_price_brl, lang, 0)}`,
    orders: row.orders,
    items: row.items,
    avgPrice: row.avg_item_price_brl,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="h-[420px] w-full sm:h-[460px]">
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
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              domain={[0, 2.05]}
              ticks={[0, 0.5, 1, 1.5, 2]}
              tickFormatter={(value: number) =>
                value === 0
                  ? 'R$ 0'
                  : `R$ ${formatNumber(value, lang, 1)}${lang === 'pt' ? 'mi' : 'm'}`
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              width={122}
              tick={{ fill: 'var(--ink-soft)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value, _name, item) => [
                formatMillions(Number(value) * 1_000_000, lang),
                `${ui.orders} ${formatNumber(Number(item?.payload?.orders ?? 0), lang)} · ${ui.avgItem} ${formatBrl(Number(item?.payload?.avgPrice ?? 0), lang)}`,
              ]}
            />
            <Bar isAnimationActive={false} dataKey="revenue" fill={chartColors.brand} radius={[0, 2, 2, 0]} maxBarSize={18}>
              <LabelList
                dataKey="annotation"
                position="right"
                fill="var(--muted)"
                fontSize={10}
                className="category-annotation"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
        {formatDecimal(p01Derived.topCategoryShare, lang, 1)}% ·{' '}
        {lang === 'pt'
          ? `12 maiores de ${p01.categories.length}`
          : `top 12 of ${p01.categories.length}`}
      </p>
    </ChartFrame>
  )
}
