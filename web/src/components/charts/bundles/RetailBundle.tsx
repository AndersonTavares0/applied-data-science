import type { ChartCopy, Lang } from '../../../content/types'
import { RevenueMonthlyPlate, CategoryRevenuePlate } from '../RetailRevenueCharts'
import {
  DeliveryOutcomePlate,
  LateByLanePlate,
  LateByStatePlate,
} from '../RetailDeliveryCharts'
import { CohortPlate, OrderStatusPlate, RepeatPurchasePlate } from '../RetailCustomerCharts'

interface BundleProps {
  lang: Lang
  copy: Record<string, ChartCopy>
  sourceLabel: string
  part: 1 | 2
}

export default function RetailCharts({ lang, copy, sourceLabel, part }: BundleProps) {
  const props = (key: string) => ({ lang, copy: copy[key], sourceLabel })
  return part === 1 ? (
    <>
      <RevenueMonthlyPlate {...props('revenue')} />
      <CategoryRevenuePlate {...props('categories')} />
      <OrderStatusPlate {...props('status')} />
    </>
  ) : (
    <>
      <DeliveryOutcomePlate {...props('delivery')} />
      <LateByStatePlate {...props('states')} />
      <LateByLanePlate {...props('lanes')} />
      <CohortPlate {...props('cohort')} />
      <RepeatPurchasePlate {...props('repeat')} />
    </>
  )
}
