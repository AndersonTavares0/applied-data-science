import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartText } from '../../content/chartText'
import { groupLabels, topicShortLabels } from '../../content/labels'
import type { ChartCopy, Lang } from '../../content/types'
import { formatNumber, formatPct, formatPp, p03 } from '../../data'
import { useNarrow } from '../../lib/useNarrow'
import { ChartFrame } from './ChartFrame'
import { axisTickSmall, chartColors, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './chartTheme'

interface Props {
  lang: Lang
  copy: ChartCopy
  sourceLabel: string
}

export function ComplaintGroupsPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const labels = groupLabels[lang]
  const data = p03.groups.map((row) => ({
    name: labels[row.group] ?? row.group,
    late: row.late_share_pct,
    onTime: row.on_time_share_pct,
    diff: formatPp(row.diff_pp, lang, 1),
    interval: `${formatPp(row.ci_low_pp, lang, 1)} · ${formatPp(row.ci_high_pp, lang, 1)}`,
    lateLabel: formatPct(row.late_share_pct, lang, 1),
    onTimeLabel: formatPct(row.on_time_share_pct, lang, 1),
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.late }} />
          {ui.late}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.onTime }} />
          {ui.onTime}
        </span>
      </div>
      <div className="h-[330px] w-full sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 50, bottom: 4, left: 6 }}
            barCategoryGap={12}
            barGap={4}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 0)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={132}
              tick={{ fill: 'var(--ink-soft)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value, name) => [
                formatPct(Number(value), lang, 1),
                name === 'late' ? ui.late : ui.onTime,
              ]}
            />
            <Bar isAnimationActive={false} dataKey="late" fill={chartColors.late} radius={[0, 2, 2, 0]} maxBarSize={18}>
              <LabelList dataKey="lateLabel" position="right" fill="var(--muted)" fontSize={10} />
            </Bar>
            <Bar isAnimationActive={false} dataKey="onTime" fill={chartColors.onTime} radius={[0, 2, 2, 0]} maxBarSize={18}>
              <LabelList dataKey="onTimeLabel" position="right" fill="var(--muted)" fontSize={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 border-t border-rule pt-3 sm:grid-cols-3">
        {data.map((row) => (
          <div key={row.name} className="text-xs leading-relaxed text-muted">
            <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
              {row.name}
            </span>
            {ui.difference} {row.diff}{' '}
            <span className="text-muted">({row.interval})</span>
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

export function TopicDumbbellPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const narrow = useNarrow()
  const labels = topicShortLabels[lang]
  const order = [3, 1, 4, 0, 2, 5]
  const ticks = narrow ? [0, 20, 40] : [0, 10, 20, 30, 40]
  const rows = order.map((topic) => {
    const row = p03.tables.topic_prevalence.find((item) => item.topic === topic)
    return {
      topic,
      label: labels[topic],
      late: row?.late_share_pct ?? 0,
      onTime: row?.on_time_share_pct ?? 0,
      diff: row?.diff_pp ?? 0,
      low: row?.ci_low_pp ?? 0,
      high: row?.ci_high_pp ?? 0,
      n: row?.n ?? 0,
    }
  })
  const max = 40

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartColors.late }} />
          {ui.late}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rotate-45"
            style={{ background: chartColors.onTime }}
          />
          {ui.onTime}
        </span>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-[6.5rem_1fr_6rem] gap-2 font-mono text-[10px] uppercase tracking-[0.06em] text-muted sm:grid-cols-[10.5rem_1fr_9rem]">
          <span />
          <span className="relative block h-4">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute top-0"
                style={{
                  left: `${(tick / max) * 100}%`,
                  transform:
                    tick === 0
                      ? 'none'
                      : tick === max
                        ? 'translateX(-100%)'
                        : 'translateX(-50%)',
                }}
              >
                {tick}%
              </span>
            ))}
          </span>
          <span className="text-right">{lang === 'pt' ? 'atrasados / prazo' : 'late / on time'}</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.topic}
            className="grid grid-cols-[6.5rem_1fr_6rem] items-center gap-2 sm:grid-cols-[10.5rem_1fr_9rem] sm:gap-3"
          >
            <span className="text-[11px] leading-tight text-ink-soft">
              {row.label}
              <span className="mt-0.5 block font-mono text-[9px] text-muted">
                n={formatNumber(row.n, lang)}
              </span>
            </span>
            <div className="relative h-7">
              <div className="absolute inset-x-0 top-1/2 h-px bg-rule" />
              <div
                className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-rule"
                style={{
                  left: `${(Math.min(row.late, row.onTime) / max) * 100}%`,
                  width: `${(Math.abs(row.late - row.onTime) / max) * 100}%`,
                }}
              />
              <span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
                style={{
                  left: `${(row.late / max) * 100}%`,
                  background: chartColors.late,
                }}
                title={`${ui.late}: ${formatPct(row.late, lang, 1)}`}
              />
              <span
                className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 ring-2 ring-surface"
                style={{
                  left: `${(row.onTime / max) * 100}%`,
                  background: chartColors.onTime,
                }}
                title={`${ui.onTime}: ${formatPct(row.onTime, lang, 1)}`}
              />
            </div>
            <span className="text-right font-mono text-[10px] leading-tight text-muted">
              {formatPct(row.late, lang, 1)} / {formatPct(row.onTime, lang, 1)}
              <span className="block text-ink-soft">{formatPp(row.diff, lang, 1)}</span>
              <span className="block text-[9px] text-muted">
                {formatNumber(row.low, lang, 1)}–{formatNumber(row.high, lang, 1)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

export function CoherencePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const data = p03.tables.topic_selection.map((row) => ({
    k: row.topics,
    seed0: row.seed0_coherence,
    mean: row.mean_coherence,
    label: String(row.topics),
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.onTime }} />
          {ui.seed0}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.accent }} />
          {ui.seedMean}
        </span>
      </div>
      <div className="h-[310px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <LineChart data={data} margin={{ top: 22, right: 24, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="k"
              tick={axisTickSmall}
              tickLine={false}
              axisLine={{ stroke: chartColors.rule }}
              label={{
                value: ui.topics,
                position: 'insideBottom',
                offset: -2,
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <YAxis
              domain={[-2.9, -2.6]}
              ticks={[-2.9, -2.8, -2.7, -2.6]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(value: number) => formatNumber(value, lang, 2)}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              labelFormatter={(value) => `${ui.topics}: ${value}`}
              formatter={(value, name) => [
                formatNumber(Number(value), lang, 3),
                name === 'seed0' ? ui.seed0 : ui.seedMean,
              ]}
            />
            <ReferenceLine
              x={6}
              stroke={chartColors.late}
              strokeDasharray="4 3"
              label={{
                value: 'k=6',
                position: 'insideTop',
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="seed0"
              stroke={chartColors.onTime}
              strokeWidth={2}
              dot={{ r: 3.5, fill: chartColors.onTime, stroke: 'var(--surface)' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="mean"
              stroke={chartColors.accent}
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 3.5, fill: chartColors.accent, stroke: 'var(--surface)' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 border-t border-rule pt-3 text-xs leading-relaxed text-muted sm:grid-cols-3">
        <span>
          {ui.seed0}: k={p03.model.selection.seed0_best}
        </span>
        <span>
          {ui.seedMean}: k={p03.model.selection.mean_best}
        </span>
        <span className="text-ink-soft">
          {lang === 'pt'
            ? 'k=6 mantido pela granularidade semântica.'
            : 'k=6 retained for semantic granularity.'}
        </span>
      </div>
    </ChartFrame>
  )
}

export function MixedDocumentsPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const soft = p03.model.soft_assignment
  const rows = [
    { label: ui.largestBelow05, value: soft.share_max_below_0_5_pct },
    { label: ui.largestBelow04, value: soft.share_max_below_0_4_pct },
    { label: ui.secondAbove03, value: soft.share_second_at_least_0_3_pct },
  ]

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_3.2rem] items-center gap-3">
            <div>
              <div className="mb-1 text-[11px] text-ink-soft">{row.label}</div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${row.value}%`, background: chartColors.late }}
                />
              </div>
            </div>
            <span className="text-right font-mono text-xs text-ink">
              {formatNumber(row.value, lang, 1)}%
            </span>
          </div>
        ))}
      </div>
      {/* Entropy is a 0–1 index, not a share of documents, so it gets no bar. */}
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-rule pt-3">
        <div>
          <div className="text-[11px] text-ink-soft">{ui.meanEntropy}</div>
          <div className="font-mono text-[10px] text-muted">
            {lang === 'pt' ? 'escala 0–1' : '0–1 scale'}
          </div>
        </div>
        <span className="font-mono text-lg leading-none text-ink">
          {formatNumber(soft.mean_normalized_entropy, lang, 3)}
        </span>
      </div>
    </ChartFrame>
  )
}
