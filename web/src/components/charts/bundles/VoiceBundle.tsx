import type { ChartCopy, Lang } from '../../../content/types'
import {
  CoherencePlate,
  ComplaintGroupsPlate,
  MixedDocumentsPlate,
  TopicDumbbellPlate,
} from '../VoiceCharts'

interface BundleProps {
  lang: Lang
  copy: Record<string, ChartCopy>
  sourceLabel: string
  part: 1 | 2
}

export default function VoiceCharts({ lang, copy, sourceLabel, part }: BundleProps) {
  const props = (key: string) => ({ lang, copy: copy[key], sourceLabel })
  return part === 1 ? (
    <>
      <ComplaintGroupsPlate {...props('groups')} />
      <TopicDumbbellPlate {...props('topics')} />
    </>
  ) : (
    <>
      <CoherencePlate {...props('coherence')} />
      <MixedDocumentsPlate {...props('mixed')} />
    </>
  )
}
