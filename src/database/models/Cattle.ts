import { Model, Q, Query, Relation } from '@nozbe/watermelondb'
import { children, date, field, immutableRelation, lazy, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import { addDays, differenceInCalendarDays, format, getYear, isAfter } from 'date-fns'
import { TableName } from '../schema'
import AnnualEarnings from './AnnualEarnings'
import CattleArchive, { ArchiveReason } from './CattleArchive'
import CattleSale from './CattleSale'
import Diet from './Diet'
import Genealogy from './Genealogy'
import MedicationSchedule from './MedicationSchedule'
import MilkProduction from './MilkProduction'
import MilkReport from './MilkReport'
import Notification from './Notification'
import WeightReport from './WeightReport'

export type ProductionType = 'Lechera' | 'De carne'
export type CattleStatus = 'Gestante' | 'En producción' | 'De reemplazo' | 'De deshecho'

type UpdateCattleData = {
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

  static associations = {
    [TableName.DIETS]: { type: 'belongs_to' as const, key: 'diet_id' },
    [TableName.CATTLE_ARCHIVES]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.MEDICATION_SCHEDULES]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.WEIGHT_REPORTS]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.MILK_REPORTS]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.CATTLE_SALES]: { type: 'has_many' as const, foreignKey: 'cattle_id' },
    [TableName.NOTIFICATIONS]: { type: 'has_many' as const, foreignKey: 'cattle_id' }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('name') name?: string
  @text('tag_id') tagId!: string
  @text('tag_cattle_number') tagCattleNumber!: string
  @date('admitted_at') admittedAt!: Date
  @date('born_at') bornAt!: Date
  @date('pregnant_at') pregnantAt?: Date
  @date('quarantine_ends_at') quarantineEndsAt?: Date
  @field('weight') weight!: number
  @field('production_type') productionType!: ProductionType
  @field('cattle_status') cattleStatus!: CattleStatus
  @field('is_active') isActive!: boolean
  @field('is_archived') isArchived!: boolean
  @field('is_sold') isSold!: boolean

  @immutableRelation(TableName.DIETS, 'diet_id') diet!: Relation<Diet>

  @children(TableName.WEIGHT_REPORTS) weightReports!: Query<WeightReport>
  @children(TableName.MILK_REPORTS) milkReports!: Query<MilkReport>
  @children(TableName.MEDICATION_SCHEDULES) medicationSchedules!: Query<MedicationSchedule>
  @children(TableName.NOTIFICATIONS) notifications!: Query<Notification>

  @lazy
  latestWeightReport = this.weightReports
    .extend(
      Q.sortBy('weighed_at', Q.desc),
      Q.take(1)
    )

  @lazy
  sale = this.collections
    .get<CattleSale>(TableName.CATTLE_SALES)
    .query(Q.where('cattle_id', this.id), Q.take(1))

  @lazy
  archive = this.collections
    .get<CattleArchive>(TableName.CATTLE_ARCHIVES)
    .query(Q.where('cattle_id', this.id), Q.take(1))

  @lazy
  mother = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.unsafeSqlQuery(
      `SELECT ${TableName.CATTLE}.* ` +
      `FROM ${TableName.GENEALOGY} ` +
      `LEFT JOIN ${TableName.CATTLE} ON ${TableName.GENEALOGY}.mother_id = ${TableName.CATTLE}.id ` +
      `WHERE ${TableName.GENEALOGY}.offspring_id = '${this.id}'`
    ))

  @lazy
  offsprings = this.collections
    .get<Cattle>(TableName.CATTLE)
    .query(Q.unsafeSqlQuery(
      `SELECT ${TableName.CATTLE}.* ` +
      `FROM ${TableName.GENEALOGY} ` +
      `LEFT JOIN ${TableName.CATTLE} ON ${TableName.GENEALOGY}.offspring_id = ${TableName.CATTLE}.id ` +
      `WHERE ${TableName.GENEALOGY}.mother_id = '${this.id}'`
    ))

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
      archive.prepareDestroyPermanently(),
      this.prepareUpdate((record) => {
        record.isActive = true
        record.isArchived = false
      })
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
      .query(Q.where('year', year), Q.take(1))
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
    if (isAfter(weighedAt, this.admittedAt)){
      throw new Error(
        `A weight report can't have a date after ${format(this.admittedAt, 'yyyy/MM/dd')}.`
      )
    }

    const weighedAtDate = format(weighedAt, 'yyyy/MM/dd')
    const existingReport = await this.weightReports
      .extend(
        Q.where('cattle_id', this.id),
        Q.unsafeSqlExpr(`strftime('%Y-%m-%d', datetime(weighed_at / 1000, 'unixepoch')) = ${weighedAtDate}`),
        Q.take(1)
      )
      .fetch()

    if (existingReport.length === 1) throw new Error(`There is already a weight report with the date ${weighedAtDate}.`)

    const previousReport = (await this.weightReports
      .extend(
        Q.where('cattle_id', this.id),
        Q.where('weighed_at', Q.gt(weighedAt.getTime())),
        Q.sortBy('weighed_at', Q.asc),
        Q.take(1)
      )
      .fetch())[0]
    const nextReport = (await this.weightReports
      .extend(
        Q.where('cattle_id', this.id),
        Q.where('weighed_at', Q.lt(weighedAt.getTime())),
        Q.sortBy('weighed_at', Q.desc),
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
    const reportedAtDate = format(reportedAt, 'yyyy/MM/dd')
    const milkReports = await this.milkReports.extend(
      Q.unsafeSqlExpr(`strftime("%Y-%m-%d", datetime(reported_at / 1000, "unixepoch")) = '${reportedAtDate}'`)
    )

    for (const milkReport of milkReports) {
      const milkProduction = await milkReport.milkProduction

      if (!milkProduction.isSold) {
        throw new Error(`Can't create a new milk report with the date ${reportedAtDate}. There is a report that belongs to a milk production that hasn't been sold yet.`)
      }
    }

    const milkProductionsDate = await this.collections.get<MilkProduction>(TableName.MILK_PRODUCTIONS)
      .query(
        Q.unsafeSqlExpr(`strftime("%Y-%m-%d", datetime(produced_at / 1000, "unixepoch")) = '${reportedAtDate}'`),
        Q.sortBy('production_number', Q.asc)
      )
      .fetch()

    let createdMilkProduction: MilkProduction | null = null
    if (milkProductionsDate.length > 0 && !milkProductionsDate[milkProductionsDate.length - 1].isSold) {
      await milkProductionsDate[milkProductionsDate.length - 1].update((record) => {
        record.liters += liters
      })
    } else {
      createdMilkProduction = await this.collections.get<MilkProduction>(TableName.MILK_PRODUCTIONS)
        .create((record) => {
          record.producedAt = reportedAt
          record.liters = liters
          record.productionNumber = milkProductionsDate.length + 1
          record.isSold = false
        })
    }

    await this.collections.get<MilkReport>(TableName.MILK_REPORTS)
      .create((record) => {
        record.cattle.set(this)
        record.milkProduction.set(createdMilkProduction ? createdMilkProduction : milkProductionsDate[milkProductionsDate.length - 1])

        record.reportedAt = reportedAt
        record.liters = liters
      })
  }

  @writer
  async setMother(motherId: string) {
    await this.collections.get<Genealogy>(TableName.GENEALOGY)
      .create((record) => {
        record.motherId = motherId
        record.offspringId = this.id
      })
  }

  @writer
  async setOffsprings(offspringsIds: string[]) {
    await this.batch(
      ...offspringsIds.map((offspringId) => {
        return this.collections.get<Genealogy>(TableName.GENEALOGY)
          .prepareCreate((record) => {
            record.motherId = this.id
            record.offspringId = offspringId
          })
      })
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
        .query(Q.where('cattle_id', this.id))
        .fetchCount()

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
      record.pregnantAt = pregnantAt
      record.productionType = productionType
      record.cattleStatus = cattleStatus
      
      if (weight) record.weight = weight

      if (quarantineDays) {
        const quarantineEndsAt = addDays(Date.now(), quarantineDays)
        record.quarantineEndsAt = quarantineEndsAt
      }
    })
  }

  @writer
  async delete() {
    if (this.isSold) throw new Error("Can't delete a cattle that has been sold.")

    await this.medicationSchedules.destroyAllPermanently()
  
    if (this.isArchived) await this.archive.destroyAllPermanently()

    await this.destroyPermanently()

    const diet = await this.diet
    await this.callWriter(() => diet.delete())
  }
}

export default Cattle
