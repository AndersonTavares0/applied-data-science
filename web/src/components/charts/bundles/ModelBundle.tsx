import type { ChartCopy, Lang } from '../../../content/types'
import {
  CalibrationPlate,
  CapacityPlate,
  ImportancePlate,
  StabilityPlate,
} from '../ModelCharts'

interface BundleProps {
  lang: Lang
  copy: Record<string, ChartCopy>
  sourceLabel: string
  part: 1 | 2
}

export default function ModelCharts({ lang, copy, sourceLabel, part }: BundleProps) {
  const props = (key: string) => ({ lang, copy: copy[key], sourceLabel })
  return part === 1 ? (
    <>
      <CalibrationPlate {...props('calibration')} />
      <CapacityPlate {...props('capacity')} />
    </>
  ) : (
    <>
      <StabilityPlate {...props('stability')} />
      <ImportancePlate {...props('importance')} />
    </>
  )
}
