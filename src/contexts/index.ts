import MilkReport from '@/database/models/MilkReport'
import { createModelContext } from './ModelContextFactory'

export const {
  useModelContext: useMilkReportContext,
  ModelProvider: MilkReportProvider
} = createModelContext<MilkReport>()
