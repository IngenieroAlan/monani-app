import Feed from '@/database/models/Feed'
import Medication from '@/database/models/Medication'
import MilkReport from '@/database/models/MilkReport'
import { createModelContext } from './ModelContextFactory'

export const {
  useModelContext: useMilkReportContext,
  ModelProvider: MilkReportProvider
} = createModelContext<MilkReport>()

export const {
  useModelContext: useFeedContext,
  ModelProvider: FeedProvider
} = createModelContext<Feed>()

export const {
  useModelContext: useMedicationContext,
  ModelProvider: MedicationProvider
} = createModelContext<Medication>()
