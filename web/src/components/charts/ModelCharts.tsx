import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartText } from '../../content/chartText'
import { featureLabels } from '../../content/labels'
import type { ChartCopy, Lang } from '../../content/types'
import {
  formatCutoff,
  formatMonthLong,
  formatNumber,
  formatPct,
  p02,
} from '../../data'
import { ChartFrame } from './ChartFrame'
import { Tabs } from '../ui/tabs'
import { axisTickSmall, chartColors, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './chartTheme'

interface Props {
  lang: Lang
  copy: ChartCopy
  sourceLabel: string
}

export function CalibrationPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const summary = p02.selected_model.calibration_summary
  const data = (key: 'logistic' | 'boosting') =>
    p02.models[key].calibration.map((row) => ({
      x: row.predicted * 100,
      y: row.observed * 100,
      n: row.n,
    }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.onTime }} />
          {ui.logistic}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: chartColors.accent }} />
          {ui.boosting}
        </span>
        <span className="text-muted">
          {lang === 'pt' ? 'inclinação' : 'slope'} {formatNumber(summary.slope, lang, 2)} ·{' '}
          {lang === 'pt' ? 'intercepto' : 'intercept'} {formatNumber(summary.intercept, lang, 2)} ·{' '}
          {lang === 'pt' ? 'média prevista' : 'mean predicted'}{' '}
          {formatPct(summary.mean_prediction * 100, lang, 2)}
        </span>
      </div>
      <div className="h-[330px] w-full sm:h-[380px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <ScatterChart margin={{ top: 12, right: 18, bottom: 18, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} />
            <XAxis
              type="number"
              dataKey="x"
              name={ui.predicted}
              domain={[0, 14]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={{ stroke: chartColors.rule }}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 0)}%`}
              label={{
                value: ui.predicted,
                position: 'insideBottom',
                offset: -10,
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={ui.observed}
              domain={[0, 14]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              width={46}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 0)}%`}
              label={{
                value: ui.observed,
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value, name) => [
                `${formatNumber(Number(value), lang, 1)}%`,
                String(name),
              ]}
            />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 14, y: 14 },
              ]}
              stroke={chartColors.muted}
              strokeDasharray="4 3"
            />
            <ReferenceLine
              y={p02.test.late_rate * 100}
              stroke={chartColors.late}
              strokeDasharray="2 3"
              label={{
                value: ui.observedRate,
                position: 'insideTopRight',
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <Scatter
              name={ui.logistic}
              data={data('logistic')}
              fill={chartColors.onTime}
              stroke="var(--surface)"
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Scatter
              name={ui.boosting}
              data={data('boosting')}
              fill={chartColors.accent}
              stroke="var(--surface)"
              strokeWidth={1}
              shape="triangle"
              isAnimationActive={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}

export function CapacityPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const data = p02.models.logistic.capacity.map((row) => ({
    capacity: `${formatNumber(row.capacity * 100, lang, 0)}%`,
    precision: row.precision * 100,
    recall: row.recall * 100,
    lift: row.lift,
    n: row.n_selected,
    label: formatPct(row.precision * 100, lang, 1),
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="h-[270px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart data={data} margin={{ top: 26, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="capacity"
              tick={axisTickSmall}
              tickLine={false}
              axisLine={{ stroke: chartColors.rule }}
              label={{
                value: lang === 'pt' ? 'Capacidade de revisão' : 'Review capacity',
                position: 'insideBottom',
                offset: -2,
                fill: 'var(--muted)',
                fontSize: 10,
              }}
            />
            <YAxis
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value: number) => `${formatNumber(value, lang, 0)}%`}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatPct(Number(value), lang, 1), ui.precision]}
            />
            <ReferenceLine
              y={p02.test.late_rate * 100}
              stroke={chartColors.muted}
              strokeDasharray="4 3"
            />
            <Bar isAnimationActive={false} dataKey="precision" fill={chartColors.onTime} radius={[2, 2, 0, 0]} maxBarSize={64}>
              <LabelList dataKey="label" position="top" fill="var(--ink-soft)" fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-rule pt-3">
        {data.map((row) => (
          <div key={row.capacity} className="text-xs leading-relaxed text-muted">
            <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
              {row.capacity} · {formatNumber(row.n, lang)} {ui.reviewed}
            </span>
            {ui.recall} {formatPct(row.recall, lang, 1)} · {ui.lift}{' '}
            {formatNumber(row.lift, lang, 2)}×
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

export function StabilityPlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const rolling = p02.rolling_origin.logistic.map((row) => ({
    cutoff: formatCutoff(row.cutoff, lang),
    logistic: row.average_precision,
    boosting:
      p02.rolling_origin.boosting.find((item) => item.cutoff === row.cutoff)?.average_precision ??
      0,
    logisticLabel: formatNumber(row.average_precision, lang, 3),
    boostingLabel: formatNumber(
      p02.rolling_origin.boosting.find((item) => item.cutoff === row.cutoff)?.average_precision ??
        0,
      lang,
      3,
    ),
    late: row.late_rate * 100,
  }))
  const monthly = p02.selected_model.monthly.map((row) => ({
    month: formatMonthLong(row.month, lang),
    auc: row.roc_auc,
    aucLabel: formatNumber(row.roc_auc, lang, 2),
    ap: row.average_precision,
    late: row.late_rate * 100,
    recall: row.top_decile_recall * 100,
  }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <Tabs
        label={ui.cutoff}
        tabs={[
          {
            id: 'rolling',
            label: ui.rollingTab,
            content: (
              <div className="h-[300px] w-full sm:h-[330px]">
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
                  <BarChart data={rolling} margin={{ top: 24, right: 12, bottom: 4, left: 0 }}>
                    <CartesianGrid stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="cutoff"
                      tick={axisTickSmall}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.rule }}
                    />
                    <YAxis
                      domain={[0, 0.22]}
                      ticks={[0, 0.05, 0.1, 0.15, 0.2]}
                      tick={axisTickSmall}
                      tickLine={false}
                      axisLine={false}
                      width={46}
                      tickFormatter={(value: number) => formatNumber(value, lang, 2)}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--surface-2)' }}
                      contentStyle={tooltipStyle}
                      itemStyle={tooltipItemStyle}
                      labelStyle={tooltipLabelStyle}
                      formatter={(value, name) => [
                        formatNumber(Number(value), lang, 3),
                        name === 'logistic' ? ui.logistic : ui.boosting,
                      ]}
                    />
                    <ReferenceLine
                      y={p02.test.late_rate}
                      stroke={chartColors.muted}
                      strokeDasharray="4 3"
                    />
                    <Bar isAnimationActive={false} dataKey="logistic" fill={chartColors.onTime} radius={[2, 2, 0, 0]} maxBarSize={42}>
                      <LabelList dataKey="logisticLabel" position="top" fill="var(--muted)" fontSize={9} />
                    </Bar>
                    <Bar isAnimationActive={false} dataKey="boosting" fill={chartColors.accent} radius={[2, 2, 0, 0]} maxBarSize={42}>
                      <LabelList dataKey="boostingLabel" position="top" fill="var(--muted)" fontSize={9} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ),
          },
          {
            id: 'monthly',
            label: ui.monthlyTab,
            content: (
              <div className="h-[300px] w-full sm:h-[330px]">
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
                  <LineChart data={monthly} margin={{ top: 24, right: 18, bottom: 4, left: 0 }}>
                    <CartesianGrid stroke={chartColors.grid} vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={axisTickSmall}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.rule }}
                    />
                    <YAxis
                      domain={[0.5, 0.9]}
                      ticks={[0.5, 0.6, 0.7, 0.8, 0.9]}
                      tick={axisTickSmall}
                      tickLine={false}
                      axisLine={false}
                      width={46}
                      tickFormatter={(value: number) => formatNumber(value, lang, 2)}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      itemStyle={tooltipItemStyle}
                      labelStyle={tooltipLabelStyle}
                      formatter={(value) => [formatNumber(Number(value), lang, 3), ui.monthlyAuc]}
                    />
                    <Line
                      type="monotone"
                      dataKey="auc"
                      stroke={chartColors.onTime}
                      strokeWidth={2}
                      dot={{ r: 4, fill: chartColors.onTime, stroke: 'var(--surface)' }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    >
                      <LabelList dataKey="aucLabel" position="top" fill="var(--ink-soft)" fontSize={10} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ),
          },
        ]}
      />
    </ChartFrame>
  )
}

export function ImportancePlate({ lang, copy, sourceLabel }: Props) {
  const ui = chartText[lang]
  const labels = featureLabels[lang]
  const data = p02.importance
    .filter((row) => row.importance > 0)
    .slice(0, 10)
    .map((row) => ({
      name: labels[row.feature] ?? row.feature,
      raw: row.feature,
      value: row.importance,
      label: formatNumber(row.importance, lang, 3),
    }))

  return (
    <ChartFrame copy={copy} sourceLabel={sourceLabel}>
      <div className="h-[340px] w-full sm:h-[370px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 760, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 42, bottom: 4, left: 6 }}
            barCategoryGap={7}
          >
            <CartesianGrid stroke={chartColors.grid} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 0.03]}
              ticks={[0, 0.01, 0.02, 0.03]}
              tick={axisTickSmall}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatNumber(value, lang, 2)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={132}
              tick={{ fill: 'var(--ink-soft)', fontSize: 10.5 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--surface-2)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={(value) => [formatNumber(Number(value), lang, 3), ui.importance]}
            />
            <Bar isAnimationActive={false} dataKey="value" fill={chartColors.brand} radius={[0, 2, 2, 0]} maxBarSize={14}>
              <LabelList dataKey="label" position="right" fill="var(--muted)" fontSize={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
