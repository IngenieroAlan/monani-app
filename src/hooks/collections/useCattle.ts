import Cattle, { CattleStatus, ProductionType } from '@/database/models/Cattle'
import Diet, { MatterProportion } from '@/database/models/Diet'
import DietFeed, { FeedProportion } from '@/database/models/DietFeed'
import Feed from '@/database/models/Feed'
import Genealogy from '@/database/models/Genealogy'
import Medication from '@/database/models/Medication'
import MedicationSchedule from '@/database/models/MedicationSchedule'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { addDays } from 'date-fns'
import { useEffect, useState } from 'react'

// TODO: Replace these types by some type infered by zod (z.infer<FormFields>).
type CattleFields = {
  name?: string
  tagId: string
  tagCattleNumber: string
  admittedAt: Date
  bornAt: Date
  pregnantAt?: Date
  weight: number
  quarantineDays?: number
  productionType: ProductionType
  cattleStatus: CattleStatus
  motherId?: string
}

type DietFields = {
  waterAmount: number
  matterAmount?: number
  percentage?: number
  matterProportion: MatterProportion
  isConcentrateExcluded: boolean
}

export type DietFeedFields = {
  feed: Feed
  feedAmount: number
  percentage?: number
  feedProportion: FeedProportion
}

export type MedicationScheduleFields = {
  medication: Medication
  nextDoseAt: Date
  dosesPerYear: number
}

type UseCattleProps = {
  cattleStatus?: CattleStatus[] | Set<CattleStatus>
  productionType?: ProductionType | null
  take?: number
}

const useCattle = ({ cattleStatus, productionType, take }: UseCattleProps = {}) => {
  const database = useDatabase()
  const [cattleRecords, setCattleRecords] = useState<Cattle[]>([])

  let cattleQuery = database.collections.get<Cattle>(TableName.CATTLE).query()

  if (take) {
    cattleQuery = cattleQuery.extend(Q.take(take))
  }
  if (cattleStatus && Array.from(cattleStatus).length) {
    cattleQuery = cattleQuery.extend(Q.where('cattle_status', Q.oneOf(Array.from(cattleStatus))))
  }
  if (productionType) {
    cattleQuery = cattleQuery.extend(Q.where('production_type', productionType))
  }

  useEffect(() => {
    const subscription = cattleQuery.observe().subscribe((data) => {
      setCattleRecords(data)
    })

    return () => subscription.unsubscribe()
  }, [database, cattleStatus, productionType, take])

  const createCattle = async (
    cattleData: CattleFields,
    dietData: DietFields,
    dietFeedData: DietFeedFields[],
    medicationScheduleData: MedicationScheduleFields[]
  ) => {
    const createdCattle = await database.write(async () => {
      const diet = await database.collections
        .get<Diet>(TableName.DIETS)
        .create((record) => {
          record.waterAmount = dietData.waterAmount
          record.matterAmount = dietData.matterAmount
          record.percentage = dietData.percentage
          record.matterProportion = dietData.matterProportion
          record.isConcentrateExcluded = dietData.isConcentrateExcluded
        })
      const cattle = await database.collections
        .get<Cattle>(TableName.CATTLE)
        .create((record) => {
          record.diet.set(diet)

          record.name = cattleData.name
          record.tagId = cattleData.tagId
          record.tagCattleNumber = cattleData.tagCattleNumber
          record.admittedAt = cattleData.admittedAt
          record.bornAt = cattleData.bornAt
          record.pregnantAt = cattleData.pregnantAt
          record.weight = cattleData.weight
          record.quarantineEndsAt = cattleData.quarantineDays ? addDays(new Date(), cattleData.quarantineDays) : undefined
          record.productionType = cattleData.productionType
          record.cattleStatus = cattleData.cattleStatus
          record.isActive = true
          record.isArchived = false
          record.isSold = false
        })

      let preparedGenealogyRecord: Genealogy | null = null

      if (cattleData.motherId) {
        preparedGenealogyRecord = database.collections
          .get<Genealogy>(TableName.GENEALOGY)
          .prepareCreate((record) => {
            record.motherId = cattleData.motherId!
            record.offspringId = cattle.id
          })
      }

      await database.batch(
        ...dietFeedData.map((dietFeed) => {
          return database.collections
            .get<DietFeed>(TableName.DIET_FEED)
            .prepareCreate((record) => {
              record.diet.set(diet)
              record.feed.set(dietFeed.feed)

              record.feedAmount = dietFeed.feedAmount
              record.percentage = dietFeed.percentage
              record.feedProportion = dietFeed.feedProportion
            })
        }),
        ...medicationScheduleData.map((medicationSchedule) => {
          return database.collections
            .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
            .prepareCreate((record) => {
              record.cattle.set(cattle)
              record.medication.set(medicationSchedule.medication)

              record.nextDoseAt = medicationSchedule.nextDoseAt
              record.dosesPerYear = medicationSchedule.dosesPerYear
            })
        }),
        preparedGenealogyRecord
      )
    })

    return createdCattle
  }

  const getCattle = async (extend: Q.Clause[]) => {
    return await database.collections
      .get<Cattle>(TableName.CATTLE)
      .query()
      .extend(extend)
      .fetch()
  }

  return {
    cattleRecords,
    getCattle,
    createCattle
  }
}

export default useCattle
