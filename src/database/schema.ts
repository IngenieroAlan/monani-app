import { appSchema, tableSchema } from '@nozbe/watermelondb'
import {
  AnnualEarningsCol,
  CattleArchivesCol,
  CattleCol,
  CattleSalesCol,
  DailyMilkProductionsCol,
  DietFeedCol,
  DietsCol,
  EarningsSummaryCol,
  FeedsCol,
  GenealogyCol,
  MedicationSchedulesCol,
  MedicationsCol,
  MilkProductionsCol,
  MilkProductionSummaryCol,
  MilkReportsCol,
  MilkSalesCol,
  MonthlyMilkProductionsCol,
  PendingNotificationsCol,
  SentNotificationsCol,
  TableName,
  WeightReportsCol
} from './constants'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableName.FEEDS,
      columns: [
        { name: FeedsCol.NAME, type: 'string' },
        { name: FeedsCol.FEED_TYPE, type: 'string' }, // Alimento | Concentrado de engorda | Concentrado lechero
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ],
      unsafeSql: (sql) => sql.replace(`'${FeedsCol.NAME}',`, `'${FeedsCol.NAME}' collate nocase,`)
    }),
    tableSchema({
      name: TableName.DIETS,
      columns: [
        { name: DietsCol.WATER_AMOUNT, type: 'number' },
        { name: DietsCol.MATTER_PROPORTION, type: 'string' }, // Porcentaje de peso | Fija | Sin definir
        { name: DietsCol.MATTER_AMOUNT, type: 'number', isOptional: true },
        { name: DietsCol.PERCENTAGE, type: 'number', isOptional: true },
        { name: DietsCol.IS_CONCENTRATE_EXCLUDED, type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.DIET_FEED,
      columns: [
        { name: DietFeedCol.DIET_ID, type: 'string' },
        { name: DietFeedCol.FEED_ID, type: 'string' },
        { name: DietFeedCol.FEED_PROPORTION, type: 'string' }, // Fija | Por procentaje
        { name: DietFeedCol.FEED_AMOUNT, type: 'number' },
        { name: DietFeedCol.PERCENTAGE, type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE,
      columns: [
        { name: CattleCol.NAME, type: 'string', isOptional: true },
        { name: CattleCol.TAG_ID, type: 'string', isIndexed: true },
        { name: CattleCol.TAG_CATTLE_NUMBER, type: 'string' },
        { name: CattleCol.WEIGHT, type: 'number' },
        { name: CattleCol.PRODUCTION_TYPE, type: 'string' }, // Lechera | De carne
        { name: CattleCol.CATTLE_STATUS, type: 'string' }, // Gestante | En producción | De reemplazo | De deshecho
        { name: CattleCol.PREGNANT_AT, type: 'number', isOptional: true },
        { name: CattleCol.IS_ACTIVE, type: 'boolean' },
        { name: CattleCol.IS_ARCHIVED, type: 'boolean' },
        { name: CattleCol.IS_SOLD, type: 'boolean' },
        { name: CattleCol.DIET_ID, type: 'string' },
        { name: CattleCol.BORN_AT, type: 'number' },
        { name: CattleCol.ADMITTED_AT, type: 'number' },
        { name: CattleCol.QUARANTINE_ENDS_AT, type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.GENEALOGY,
      columns: [
        { name: GenealogyCol.MOTHER_ID, type: 'string', isIndexed: true },
        { name: GenealogyCol.OFFSPRING_ID, type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE_ARCHIVES,
      columns: [
        { name: CattleArchivesCol.CATTLE_ID, type: 'string' },
        { name: CattleArchivesCol.REASON, type: 'string' }, // Muerte | Extravío | Otro
        { name: CattleArchivesCol.NOTES, type: 'string', isOptional: true },
        { name: CattleArchivesCol.ARCHIVED_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MEDICATIONS,
      columns: [
        { name: MedicationsCol.NAME, type: 'string' },
        { name: MedicationsCol.MEDICATION_TYPE, type: 'string' }, // Desparasitante | Vitaminas | Suplemento mineral | Otro
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ],
      unsafeSql: (sql) => sql.replace(`'${MedicationsCol.NAME}',`, `'${MedicationsCol.NAME}' collate nocase,`)
    }),
    tableSchema({
      name: TableName.MEDICATION_SCHEDULES,
      columns: [
        { name: MedicationSchedulesCol.CATTLE_ID, type: 'string' },
        { name: MedicationSchedulesCol.MEDICATION_ID, type: 'string' },
        { name: MedicationSchedulesCol.DOSES_PER_YEAR, type: 'number' },
        { name: MedicationSchedulesCol.NEXT_DOSE_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.WEIGHT_REPORTS,
      columns: [
        { name: WeightReportsCol.CATTLE_ID, type: 'string' },
        { name: WeightReportsCol.WEIGHT, type: 'number' },
        { name: WeightReportsCol.WEIGHT_DIFFERENCE, type: 'number' },
        { name: WeightReportsCol.DAYS_PASSED, type: 'number' },
        { name: WeightReportsCol.AVG_DAILY_DIFFERENCE, type: 'number' },
        { name: WeightReportsCol.WEIGHED_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_PRODUCTIONS,
      columns: [
        { name: MilkProductionsCol.LITERS, type: 'number' },
        { name: MilkProductionsCol.PRODUCTION_NUMBER, type: 'number' },
        { name: MilkProductionsCol.IS_SOLD, type: 'boolean' },
        { name: MilkProductionsCol.PRODUCED_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_REPORTS,
      columns: [
        { name: MilkReportsCol.CATTLE_ID, type: 'string' },
        { name: MilkReportsCol.MILK_PRODUCTION_ID, type: 'string' },
        { name: MilkReportsCol.LITERS, type: 'number' },
        { name: MilkReportsCol.PRODUCTION_NUMBER, type: 'number' },
        { name: MilkReportsCol.IS_SOLD, type: 'boolean' },
        { name: MilkReportsCol.REPORTED_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_PRODUCTION_SUMMARY,
      columns: [
        { name: MilkProductionSummaryCol.TOTAL_PRODUCTION, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.DAILY_MILK_PRODUCTIONS,
      columns: [
        { name: DailyMilkProductionsCol.LITERS, type: 'number' },
        { name: DailyMilkProductionsCol.TOTAL_PRODUCTIONS, type: 'number' },
        { name: DailyMilkProductionsCol.PRODUCED_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MONTHLY_MILK_PRODUCTIONS,
      columns: [
        { name: MonthlyMilkProductionsCol.YEAR, type: 'number' },
        { name: MonthlyMilkProductionsCol.MONTH, type: 'number' },
        { name: MonthlyMilkProductionsCol.LITERS, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE_SALES,
      columns: [
        { name: CattleSalesCol.DETAILS, type: 'string' },
        { name: CattleSalesCol.KG, type: 'number' },
        { name: CattleSalesCol.SOLD_BY, type: 'number' },
        { name: CattleSalesCol.CATTLE_ID, type: 'string' },
        { name: CattleSalesCol.SOLD_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_SALES,
      columns: [
        { name: MilkSalesCol.DETAILS, type: 'string' },
        { name: MilkSalesCol.LITERS, type: 'number' },
        { name: MilkSalesCol.SOLD_BY, type: 'number' },
        { name: MilkSalesCol.MILK_PRODUCTION_ID, type: 'string' },
        { name: MilkSalesCol.SOLD_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.EARNINGS_SUMMARY,
      columns: [
        { name: EarningsSummaryCol.TOTAL_EARNINGS, type: 'number' },
        { name: EarningsSummaryCol.TOTAL_CATTLE_SALES, type: 'number' },
        { name: EarningsSummaryCol.TOTAL_MILK_SALES, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.ANNUAL_EARNINGS,
      columns: [
        { name: AnnualEarningsCol.YEAR, type: 'number' },
        { name: AnnualEarningsCol.TOTAL_EARNINGS, type: 'number' },
        { name: AnnualEarningsCol.TOTAL_CATTLE_SALES, type: 'number' },
        { name: AnnualEarningsCol.TOTAL_MILK_SALES, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.SENT_NOTIFICATIONS,
      columns: [
        { name: SentNotificationsCol.NOTIFEE_ID, type: 'string', isIndexed: true },
        { name: SentNotificationsCol.CATTLE_ID, type: 'string', isIndexed: true },
        { name: SentNotificationsCol.IS_MARKED_AS_READ, type: 'boolean' },
        { name: SentNotificationsCol.TYPE, type: 'string' },
        { name: SentNotificationsCol.EXTRA_INFO, type: 'string', isOptional: true },
        { name: SentNotificationsCol.EVENT_AT, type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.PENDING_NOTIFICATIONS,
      columns: [
        { name: PendingNotificationsCol.TYPE, type: 'string' },
        { name: PendingNotificationsCol.FOREIGN_ID, type: 'string', isOptional: true },
        { name: PendingNotificationsCol.CATTLE_ID, type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    })
  ]
})
