import { Database, Model, Q } from '@nozbe/watermelondb'
import { date, field, nochange, readonly } from '@nozbe/watermelondb/decorators'
import dayjs from 'dayjs'
import { MonthlyMilkProductionsCol as Column, TableName } from '../constants'

class MonthlyMilkProduction extends Model {
  static table = TableName.MONTHLY_MILK_PRODUCTIONS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @field(Column.YEAR) year!: number
  @nochange @field(Column.MONTH) month!: number

  @field(Column.LITERS) liters!: number

  static prepareCreate = (db: Database, { year, month, liters }: { year: number; month: number; liters: number }) =>
    db.get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTIONS).prepareCreate((record) => {
      record.year = year
      record.month = month
      record.liters = liters
    })

  static prepareUpdateOrCreate = async (
    db: Database,
    { producedAt }: { producedAt: Date },
    { liters }: { liters: number }
  ) => {
    const year = dayjs(producedAt).year()
    const month = dayjs(producedAt).month()
    const [monthlyMilkProduction] = await db
      .get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTIONS)
      .query(Q.where(Column.YEAR, year), Q.where(Column.MONTH, month))

    return monthlyMilkProduction !== undefined
      ? monthlyMilkProduction.prepareUpdate((record) => {
          record.liters += liters
        })
      : MonthlyMilkProduction.prepareCreate(db, { year, month, liters })
  }

  prepareUpdateOrDestroy(liters: number) {
    return this.liters - liters === 0
      ? this.prepareDestroyPermanently()
      : this.prepareUpdate((record) => {
          record.liters -= liters
        })
  }
}

export default MonthlyMilkProduction
