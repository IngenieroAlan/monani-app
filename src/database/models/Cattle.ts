import {
  createMedicationNotification,
  createPregnancyNotification,
  createQuarantineNotification
} from '@/notifee/constructors'
import notifee from '@notifee/react-native'
import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { children, date, field, immutableRelation, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model'
import { addDays, differenceInCalendarDays, format, getYear, isAfter } from 'date-fns'
import dayjs from 'dayjs'
import {
  AnnualEarningsCol,
  CattleArchivesCol,
  CattleCol,
  CattleSalesCol,
  DietFeedCol,
  GenealogyCol,
  MedicationSchedulesCol,
  MilkProductionsCol,
  MilkReportsCol,
  PendingNotificationsCol,
  SentNotificationsCol,
  TableName,
  WeightReportsCol
} from '../constants'
import AnnualEarnings from './AnnualEarnings'
import CattleArchive, { ArchiveReason } from './CattleArchive'
import CattleSale from './CattleSale'
import Diet from './Diet'
import DietFeed from './DietFeed'
import Genealogy from './Genealogy'
import Medication from './Medication'
import MedicationSchedule from './MedicationSchedule'
import MilkProduction from './MilkProduction'
import MilkReport from './MilkReport'
import PendingNotification from './PendingNotification'
import SentNotification from './SentNotification'
import WeightReport from './WeightReport'

export type ProductionType = 'Lechera' | 'De carne'
export type CattleStatus = 'Gestante' | 'En producción' | 'De reemplazo' | 'De deshecho'

export type UpdateCattleData = {
  name?: string
  tagId: string
  tagCattleNumber: string
  admittedAt: Date
  bornAt: Date
  pregnantAt?: Date
  quarantineDays?: number
  weight?: number
  productionType: ProductionType
  cattleStatus: CattleStatus
}

class Cattle extends Model {
  static table = TableName.CATTLE

  static associations: Associations = {
    [TableName.DIETS]: { type: 'belongs_to', key: CattleCol.DIET_ID },
    [TableName.CATTLE_ARCHIVES]: { type: 'has_many', foreignKey: CattleArchivesCol.CATTLE_ID },
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many', foreignKey: MedicationSchedulesCol.CATTLE_ID },
    [TableName.WEIGHT_REPORTS]: { type: 'has_many', foreignKey: WeightReportsCol.CATTLE_ID },
    [TableName.MILK_REPORTS]: { type: 'has_many', foreignKey: MilkReportsCol.CATTLE_ID },
    [TableName.CATTLE_SALES]: { type: 'has_many', foreignKey: CattleSalesCol.CATTLE_ID },
    [TableName.SENT_NOTIFICATIONS]: { type: 'has_many', foreignKey: SentNotificationsCol.CATTLE_ID },
    [TableName.GENEALOGY]: { type: 'has_many', foreignKey: GenealogyCol.OFFSPRING_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text(CattleCol.NAME) name?: string
  @text(CattleCol.TAG_ID) tagId!: string
  @text(CattleCol.TAG_CATTLE_NUMBER) tagCattleNumber!: string
  @date(CattleCol.ADMITTED_AT) admittedAt!: Date
  @date(CattleCol.BORN_AT) bornAt!: Date
  @date(CattleCol.PREGNANT_AT) pregnantAt?: Date
  @date(CattleCol.QUARANTINE_ENDS_AT) quarantineEndsAt?: Date
  @field(CattleCol.WEIGHT) weight!: number
  @field(CattleCol.PRODUCTION_TYPE) productionType!: ProductionType
  @field(CattleCol.CATTLE_STATUS) cattleStatus!: CattleStatus
  @field(CattleCol.IS_ACTIVE) isActive!: boolean
  @field(CattleCol.IS_ARCHIVED) isArchived!: boolean
  @field(CattleCol.IS_SOLD) isSold!: boolean

  @immutableRelation(TableName.DIETS, CattleCol.DIET_ID) diet!: Relation<Diet>

  @children(TableName.WEIGHT_REPORTS) weightReports!: Query<WeightReport>
  @children(TableName.MILK_REPORTS) milkReports!: Query<MilkReport>
  @children(TableName.MEDICATION_SCHEDULES) medicationSchedules!: Query<MedicationSchedule>
  @children(TableName.SENT_NOTIFICATIONS) notifications!: Query<SentNotification>

  @lazy
  latestWeightReport = this.weightReports
    .extend(
      Q.sortBy(WeightReportsCol.WEIGHED_AT, Q.desc),
      Q.take(1)
    )

  @lazy
  sale = this.collections
    .get<CattleSale>(TableName.CATTLE_SALES)
    .query(Q.where(CattleSalesCol.CATTLE_ID, this.id), Q.take(1))

  @lazy
  archive = this.collections
    .get<CattleArchive>(TableName.CATTLE_ARCHIVES)
    .query(Q.where(CattleArchivesCol.CATTLE_ID, this.id), Q.take(1))

  @lazy
  dietFeeds = this.collections
    .get<DietFeed>(TableName.DIET_FEED)
    .query(Q.where(DietFeedCol.DIET_ID, this.diet.id))

  @lazy
  motherRelation = this.collections
    .get<Genealogy>(TableName.GENEALOGY)
    .query(Q.where(GenealogyCol.OFFSPRING_ID, this.id))

  @lazy
  offsprings = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.on(TableName.GENEALOGY, GenealogyCol.MOTHER_ID, this.id))

  @lazy
  pendingMilkReports = this.milkReports
    .extend(Q.where(MilkReportsCol.IS_SOLD, false))

  // May not be needed.
  @writer
  async setQuarantine(days: number) {
    const quarantineEndsAt = addDays(Date.now(), days)

    await this.update((record) => {
      record.quarantineEndsAt = quarantineEndsAt
    })
  }

  @writer
  async markAsArchived({ reason, archivedAt, notes }: { reason: ArchiveReason; archivedAt: Date; notes?: string }) {
    await this.batch(
      this.prepareUpdate((record) => {
        record.isActive = false
        record.isArchived = true
      }),
      this.collections
        .get<CattleArchive>(TableName.CATTLE_ARCHIVES)
        .prepareCreate((record) => {
          record.cattle.set(this)

          record.reason = reason
          record.archivedAt = archivedAt
          record.notes = notes
        })
    )
  }

  @writer
  async unarchive() {
    const archive = (await this.archive)[0]

    await this.batch(
      this.prepareUpdate((record) => {
        record.isActive = true
        record.isArchived = false
      }),
      archive.prepareDestroyPermanently()
    )
  }

  /**
   * Checks if there are already sales in the current year, if there are, just updates the
   * totalEarnings and totalCattleSales, otherwise it creates a new entry.
   */
  @writer
  async sell({ soldBy, soldAt }: { soldBy: number, soldAt: Date }) {
    const year = getYear(soldAt)

    const annualEarnings = (await this.collections
      .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
      .query(Q.where(AnnualEarningsCol.YEAR, year), Q.take(1))
      .fetch())

    let annualEarningsBatch: AnnualEarnings

    if (annualEarnings.length === 0) {
      annualEarningsBatch = this.collections
        .get<AnnualEarnings>(TableName.ANNUAL_EARNINGS)
        .prepareCreate((record) => {
          record.year = year
          record.totalEarnings = soldBy
          record.totalCattleSales = soldBy
          record.totalMilkSales = 0
        })
    } else {
      annualEarningsBatch = annualEarnings[0].prepareUpdate((record) => {
        record.totalEarnings += soldBy
        record.totalCattleSales += soldBy
      })
    }

    const latestWeightReport = (await this.latestWeightReport)[0]

    await this.batch(
      this.prepareUpdate((record) => {
        record.isActive = false,
          record.isSold = true
      }),
      this.collections.get<CattleSale>(TableName.CATTLE_SALES)
        .prepareCreate((record) => {
          record.cattle.set(this)

          record.kg = latestWeightReport ? latestWeightReport.weight : this.weight
          record.details = `No. ${this.tagId}${this.name ? `: ${this.name}` : ''}`,
            record.soldBy = soldBy
          record.soldAt = soldAt
        }),
      annualEarningsBatch
    )
  }

  /**
   * Creates a new weight report based on the next record and updates the previous record. If there is no next record.
   * it will be created based on cattle weight and admitted at date.
   */
  @writer
  async weigh({ weight, weighedAt }: { weight: number, weighedAt: Date }) {
    if (isAfter(weighedAt, this.admittedAt)) {
      throw new Error(
        `A weight report can't have a date after ${format(this.admittedAt, 'yyyy/MM/dd')}.`
      )
    }

    const weighedAtDate = format(weighedAt, 'yyyy/MM/dd')
    const existingReport = await this.weightReports
      .extend(
        Q.where(WeightReportsCol.CATTLE_ID, this.id),
        Q.unsafeSqlExpr(`strftime('%Y/%m/%d', datetime(${WeightReportsCol.WEIGHED_AT} / 1000, 'unixepoch')) = ${weighedAtDate}`),
        Q.take(1)
      )
      .fetch()

    if (existingReport.length === 1) throw new Error(`There is already a weight report with the date ${weighedAtDate}.`)

    const previousReport = (await this.weightReports
      .extend(
        Q.where(WeightReportsCol.CATTLE_ID, this.id),
        Q.where(WeightReportsCol.WEIGHED_AT, Q.gt(weighedAt.getTime())),
        Q.sortBy(WeightReportsCol.WEIGHED_AT, Q.asc),
        Q.take(1)
      )
      .fetch())[0]
    const nextReport = (await this.weightReports
      .extend(
        Q.where(WeightReportsCol.CATTLE_ID, this.id),
        Q.where(WeightReportsCol.WEIGHED_AT, Q.lt(weighedAt.getTime())),
        Q.sortBy(WeightReportsCol.WEIGHED_AT, Q.desc),
        Q.take(1)
      )
      .fetch())[0]

    let preparedPreviousReportUpdate: WeightReport | null = null
    if (previousReport) {
      preparedPreviousReportUpdate = previousReport.prepareUpdate((record) => {
        record.weightDifference = +(previousReport.weight - weight).toFixed(3)
        record.daysPassed = differenceInCalendarDays(previousReport.weighedAt, weighedAt)
        record.avgDailyDifference = +(record.weightDifference / record.daysPassed).toFixed(3)
      })
    }

    const nextWeight = nextReport ? nextReport.weight : this.weight
    const nextWeighedAt = nextReport ? nextReport.weighedAt : this.admittedAt

    const preapredCreate = this.collections.get<WeightReport>(TableName.WEIGHT_REPORTS)
      .prepareCreate((record) => {
        record.cattle.set(this)

        record.weighedAt = weighedAt
        record.weight = weight
        record.weightDifference = +(weight - nextWeight).toFixed(3)
        record.daysPassed = differenceInCalendarDays(weighedAt, nextWeighedAt)
        record.avgDailyDifference = +(record.weightDifference / record.daysPassed).toFixed(3)
      })

    await this.batch(preparedPreviousReportUpdate, preapredCreate)
  }

  /**
   * Creates a new milk report only if there are no milk reports in that same day (belonging to this specific cattle)
   * that belongs to a milk production which hasn't been sold yet. If all milk productions related to the same day
   * are sold, it will also create a new milk production record.
   */
  @writer
  async createMilkReport({ liters, reportedAt }: { liters: number, reportedAt: Date }) {
    const reportedAtDate = dayjs(reportedAt).format('YYYY-MM-DD')
    const milkReports = await this.milkReports.extend(
      Q.unsafeSqlExpr(`date(${MilkReportsCol.REPORTED_AT} / 1000, 'unixepoch') = '${reportedAtDate}'`),
    )

    if (!milkReports.every((record) => record.isSold)) {
      throw new Error(`Can't create a new milk report with the date ${reportedAtDate}. There is a report that belongs to a milk production that hasn't been sold yet.`)
    }

    const milkProductions = await this.db.get<MilkProduction>(TableName.MILK_PRODUCTIONS)
      .query(
        Q.unsafeSqlExpr(`date(${MilkProductionsCol.PRODUCED_AT} / 1000, 'unixepoch') = '${reportedAtDate}'`),
        Q.sortBy(MilkProductionsCol.PRODUCTION_NUMBER, Q.asc)
      )
    const latestMilkProduction = milkProductions[milkProductions.length - 1]
    let milkProductionBatch: MilkProduction

    if (milkProductions.length > 0 && !latestMilkProduction.isSold) {
      milkProductionBatch = latestMilkProduction.prepareUpdate((record) => {
        record.liters += liters
      })
    } else {
      milkProductionBatch = this.db.get<MilkProduction>(TableName.MILK_PRODUCTIONS).prepareCreate((record) => {
        record.producedAt = reportedAt
        record.liters = liters
        record.productionNumber = milkProductions.length + 1
        record.isSold = false
      })
    }

    await this.batch(
      this.db.get<MilkReport>(TableName.MILK_REPORTS).prepareCreate((record) => {
        record.cattle.set(this)
        record.milkProduction.set(milkProductionBatch)

        record.reportedAt = reportedAt
        record.liters = liters
        record.productionNumber = milkProductionBatch.productionNumber
        record.isSold = false
      }),
      milkProductionBatch
    )
  }

  @writer
  async setMother(mother: Cattle) {
    const genealogyRecord = await this.collections.get<Genealogy>(TableName.GENEALOGY)
      .query(Q.where(GenealogyCol.OFFSPRING_ID, this.id))
      .fetch()

    if (genealogyRecord.length) throw new Error('This cattle already has a mother set.')

    await this.collections.get<Genealogy>(TableName.GENEALOGY)
      .create((record) => {
        record.mother.set(mother)
        record.offspring.set(this)
      })
  }

  @writer
  async removeMother() {
    const genealogyRecord = await this.collections.get<Genealogy>(TableName.GENEALOGY)
      .query(
        Q.where(GenealogyCol.OFFSPRING_ID, this.id),
        Q.take(1)
      )
      .fetch()

    if (!genealogyRecord.length) {
      throw new Error("Cannot delete a mother that doesn't exists.")
    }

    await genealogyRecord[0].destroyPermanently()
  }

  @writer
  async setOffsprings(offsprings: Cattle[]) {
    this.collections.get<Genealogy>(TableName.GENEALOGY)
      .query(Q.where(GenealogyCol.MOTHER_ID, this.id))
      .destroyAllPermanently()

    await this.batch(
      ...offsprings.map((offspring) => {
        return this.collections.get<Genealogy>(TableName.GENEALOGY)
          .prepareCreate((record) => {
            record.mother.set(this)
            record.offspring.set(offspring)
          })
      })
    )
  }

  @writer
  async addMedicationSchedule(
    { medication, nextDoseAt, dosesPerYear }: { medication: Medication, nextDoseAt: Date, dosesPerYear: number }
  ) {
    const medicationSchedule = await this.collections
      .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
      .query(
        Q.where(MedicationSchedulesCol.CATTLE_ID, this.id),
        Q.where(MedicationSchedulesCol.MEDICATION_ID, medication.id),
        Q.take(1)
      )
      .fetch()

    if (medicationSchedule.length > 0) {
      throw new Error(`Ya existe una programación para el medicamento ${medication.name}.`)
    }

    const createdMedicationSchedule = await this.collections
      .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
      .create((record) => {
        record.cattle.set(this)
        record.medication.set(medication)

        record.nextDoseAt = nextDoseAt
        record.dosesPerYear = dosesPerYear
      })

    await createMedicationNotification(
      this,
      medication.name,
      createdMedicationSchedule.id,
      dosesPerYear,
      nextDoseAt.getTime()
    )
  }

  @writer
  async updateCattle({
    name,
    tagId,
    tagCattleNumber,
    admittedAt,
    bornAt,
    pregnantAt,
    quarantineDays,
    weight,
    productionType,
    cattleStatus
  }: UpdateCattleData) {
    if (weight) {
      const weightReports = await this.collections
        .get<WeightReport>(TableName.WEIGHT_REPORTS)
        .query(Q.where(WeightReportsCol.CATTLE_ID, this.id))
        .count

      if (weightReports > 0) {
        throw new Error(
          "Can't update weight. There are already weight reports. Instead, create a new weight report."
        )
      }
    }

    await this.update((record) => {
      record.name = name
      record.tagId = tagId
      record.tagCattleNumber = tagCattleNumber
      record.admittedAt = admittedAt
      record.bornAt = bornAt
      record.productionType = productionType
      record.cattleStatus = cattleStatus

      if (weight) record.weight = weight

      record.pregnantAt = pregnantAt

      if (quarantineDays && quarantineDays > 0) {
        const quarantineEndsAt = addDays(Date.now(), quarantineDays)
        record.quarantineEndsAt = quarantineEndsAt
      } else {
        record.quarantineEndsAt = undefined
      }
    })

    const pendingPregnancyNotification = (
      await this.collections
        .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
        .query(
          Q.where(PendingNotificationsCol.CATTLE_ID, this.id),
          Q.where(PendingNotificationsCol.TYPE, 'birth')
        )
    )[0]

    if (pregnantAt) {
      await createPregnancyNotification(this, addDays(pregnantAt, 283).getTime(), pendingPregnancyNotification?.id || undefined)
    } else {
      if (pendingPregnancyNotification) {
        await notifee.cancelTriggerNotification(pendingPregnancyNotification.id)
      }
    }

    const pendingQuarantineNotification = (
      await this.collections
        .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
        .query(
          Q.where(PendingNotificationsCol.CATTLE_ID, this.id),
          Q.where(PendingNotificationsCol.TYPE, 'quarantine')
        )
    )[0]

    if (quarantineDays && quarantineDays > 0) {
      const quarantineEndsAt = addDays(Date.now(), quarantineDays)

      await createQuarantineNotification(this, quarantineEndsAt.getTime(), pendingQuarantineNotification?.id || undefined)
    } else {
      if (pendingQuarantineNotification) {
        await notifee.cancelTriggerNotification(pendingQuarantineNotification.id)
      }
    }
  }

  @writer
  async delete() {
    if (this.isSold) throw new Error("Can't delete a cattle that has been sold.")

    await this.medicationSchedules.destroyAllPermanently()

    if (this.isArchived) await this.archive.destroyAllPermanently()

    await this.collections
      .get<Genealogy>(TableName.GENEALOGY)
      .query(
        Q.or(
          Q.where(GenealogyCol.MOTHER_ID, this.id),
          Q.where(GenealogyCol.OFFSPRING_ID, this.id)
        )
      )
      .destroyAllPermanently()

    await this.destroyPermanently()

    const diet = await this.diet
    await this.callWriter(() => diet.delete())

    const pendingNotificationsIdsQuery = this.collections
      .get<PendingNotification>(TableName.PENDING_NOTIFICATIONS)
      .query(Q.where(PendingNotificationsCol.CATTLE_ID, this.id))

    await notifee.cancelTriggerNotifications(await pendingNotificationsIdsQuery.fetchIds())
    await pendingNotificationsIdsQuery.destroyAllPermanently()
  }
}

export default Cattle
