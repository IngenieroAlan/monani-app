import { Database, Model, Q } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import dayjs from 'dayjs'
import { DailyMilkProductionsCol as Column, TableName } from '../constants'

class DailyMilkProduction extends Model {
  static table = TableName.DAILY_MILK_PRODUCTIONS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @date(Column.PRODUCED_AT) producedAt!: Date

  @field(Column.LITERS) liters!: number
  @field(Column.TOTAL_PRODUCTIONS) totalProductions!: number

  static prepareCreate = (db: Database, { liters, producedAt }: { liters: number; producedAt: Date }) =>
    db.get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS).prepareCreate((record) => {
      record.liters = liters
      record.totalProductions = 1
      record.producedAt = producedAt
    })

  static prepareUpdateOrCreate = async (
    db: Database,
    { producedAt }: { producedAt: Date },
    { liters, totalProductions }: { liters: number; totalProductions: number }
  ) => {
    const producedAtDate = dayjs(producedAt).format('YYYY-MM-DD')
    const [dailyMilkProduction] = await db
      .get<DailyMilkProduction>(TableName.DAILY_MILK_PRODUCTIONS)
      .query(Q.unsafeSqlExpr(`date(${Column.PRODUCED_AT} / 1000, 'unixepoch') = '${producedAtDate}'`))

    return dailyMilkProduction !== undefined
      ? dailyMilkProduction.prepareUpdate((record) => {
          record.liters += liters
          record.totalProductions = totalProductions
        })
      : DailyMilkProduction.prepareCreate(db, { liters, producedAt: producedAt })
  }

  prepareUpdateOrDestroy(liters: number) {
    return this.liters - liters === 0
      ? this.prepareDestroyPermanently()
      : this.prepareUpdate((record) => {
          record.liters -= liters
        })
  }
}

export default DailyMilkProduction
