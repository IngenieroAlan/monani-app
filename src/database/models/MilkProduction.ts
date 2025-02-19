import { Database, Model, Q, Query } from '@nozbe/watermelondb'
import { children, date, field, lazy, nochange, readonly } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model'
import dayjs from 'dayjs'
import { MilkProductionsCol as Column, MilkReportsCol, MilkSalesCol, TableName } from '../constants'
import MilkReport from './MilkReport'
import MilkSale from './MilkSale'

class MilkProduction extends Model {
  static table = TableName.MILK_PRODUCTIONS

  static associations: Associations = {
    [TableName.MILK_REPORTS]: { type: 'has_many', foreignKey: MilkReportsCol.MILK_PRODUCTION_ID },
    [TableName.MILK_SALES]: { type: 'has_many', foreignKey: MilkSalesCol.MILK_PRODUCTION_ID }
  }

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @nochange @date(Column.PRODUCED_AT) producedAt!: Date
  @nochange @field(Column.PRODUCTION_NUMBER) productionNumber!: number

  @field(Column.LITERS) liters!: number
  @field(Column.IS_SOLD) isSold!: boolean

  @children(TableName.MILK_REPORTS) milkReports!: Query<MilkReport>
  @children(TableName.MILK_SALES) sale!: Query<MilkSale>

  static prepareCreate = (
    db: Database,
    {
      liters,
      productionNumber,
      producedAt
    }: {
      liters: number
      productionNumber: number
      producedAt: Date
    }
  ) =>
    db.get<MilkProduction>(TableName.MILK_PRODUCTIONS).prepareCreate((record) => {
      record.producedAt = producedAt
      record.liters = liters
      record.productionNumber = productionNumber
      record.isSold = false
    })

  static prepareUpdateOrCreate = async (
    db: Database,
    { producedAt }: { producedAt: Date },
    { liters }: { liters: number }
  ) => {
    const producedAtDate = dayjs(producedAt).format('YYYY-MM-DD')
    const milkProductions = await db
      .get<MilkProduction>(TableName.MILK_PRODUCTIONS)
      .query(
        Q.unsafeSqlExpr(`date(${Column.PRODUCED_AT} / 1000, 'unixepoch') = '${producedAtDate}'`),
        Q.sortBy(Column.PRODUCTION_NUMBER, Q.asc)
      )
    const latestMilkProduction = milkProductions[milkProductions.length - 1]

    return milkProductions.length > 0 && !latestMilkProduction.isSold
      ? latestMilkProduction.prepareUpdate((record) => {
          record.liters += liters
        })
      : MilkProduction.prepareCreate(db, {
          liters,
          productionNumber: ++milkProductions.length,
          producedAt: producedAt
        })
  }

  prepareUpdateOrDestroy(liters: number) {
    return this.liters - liters === 0
      ? this.prepareDestroyPermanently()
      : this.prepareUpdate((record) => {
          record.liters -= liters
        })
  }
}

export default MilkProduction
