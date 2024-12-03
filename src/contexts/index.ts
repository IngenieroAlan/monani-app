import Feed from '@/database/models/Feed'
import MilkReport from '@/database/models/MilkReport'
import { createModelContext } from './ModelContextFactory'
import Medication from '@/database/models/Medication'

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
