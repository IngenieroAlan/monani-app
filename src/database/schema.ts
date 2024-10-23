import { appSchema, tableSchema } from '@nozbe/watermelondb'

export enum TableName {
  FEEDS = 'feeds',
  DIETS = 'diets',
  DIET_FEED = 'diet_feed',
  CATTLE = 'cattle',
  GENEALOGY = 'genealogy',
  CATTLE_ARCHIVES = 'cattle_archives',
  MEDICATIONS = 'medications',
  MEDICATION_SCHEDULES = 'medication_schedules',
  WEIGHT_REPORTS = 'weight_reports',
  MILK_PRODUCTIONS = 'milk_productions',
  MILK_REPORTS = 'milk_reports',
  MILK_PRODUCTION_SUMMARY = 'milk_production_summary',
  MONTHLY_MILK_PRODUCTION = 'monthly_milk_production',
  CATTLE_SALES = 'cattle_sales',
  MILK_SALES = 'milk_sales',
  EARNINGS_SUMMARY = 'earnings_summary',
  ANNUAL_EARNINGS = 'annual_earnings',
  NOTIFICATIONS = 'notifications'
}

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableName.FEEDS,
      columns: [
        { name: 'name', type: 'string' },
        { name: 'feed_type', type: 'string' }, // Alimento | Concentrado de engorda | Concentrado lechero
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ],
      unsafeSql: (sql) => sql.replace('"name",', '"name" collate nocase,')
    }),
    tableSchema({
      name: TableName.DIETS,
      columns: [
        { name: 'water_amount', type: 'number' },
        { name: 'matter_proportion', type: 'string' }, // Porcentaje de peso | Fija | Sin definir
        { name: 'matter_amount', type: 'number', isOptional: true },
        { name: 'percentage', type: 'number', isOptional: true },
        { name: 'is_concentrate_excluded', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.DIET_FEED,
      columns: [
        { name: 'diet_id', type: 'string' },
        { name: 'feed_id', type: 'string' },
        { name: 'feed_proportion', type: 'string' }, // Fija | Por procentaje
        { name: 'feed_amount', type: 'number' },
        { name: 'percentage', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE,
      columns: [
        { name: 'name', type: 'string', isOptional: true },
        { name: 'tag_id', type: 'string', isIndexed: true },
        { name: 'tag_cattle_number', type: 'string' },
        { name: 'weight', type: 'number' },
        { name: 'production_type', type: 'string' }, // Lechera | De carne
        { name: 'cattle_status', type: 'string' }, // Gestante | En producción | De reemplazo | De deshecho
        { name: 'pregnant_at', type: 'number', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_archived', type: 'boolean' },
        { name: 'is_sold', type: 'boolean' },
        { name: 'diet_id', type: 'string' },
        { name: 'born_at', type: 'number' },
        { name: 'admitted_at', type: 'number' },
        { name: 'quarantine_ends_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.GENEALOGY,
      columns: [
        { name: 'mother_id', type: 'string', isIndexed: true },
        { name: 'offspring_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE_ARCHIVES,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'reason', type: 'string' }, // Muerte | Extravío | Otro
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'archived_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MEDICATIONS,
      columns: [
        { name: 'name', type: 'string' },
        { name: 'medication_type', type: 'string' }, // Desparasitante | Vitaminas | Suplemento mineral | Otro
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ],
      unsafeSql: (sql) => sql.replace('"name",', '"name" collate nocase,')
    }),
    tableSchema({
      name: TableName.MEDICATION_SCHEDULES,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'medication_id', type: 'string' },
        { name: 'doses_per_year', type: 'number' },
        { name: 'next_dose_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.WEIGHT_REPORTS,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'weight', type: 'number' },
        { name: 'weight_difference', type: 'number' },
        { name: 'days_passed', type: 'number' },
        { name: 'avg_daily_difference', type: 'number' },
        { name: 'weighed_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_PRODUCTIONS,
      columns: [
        { name: 'liters', type: 'number' },
        { name: 'production_number', type: 'number' },
        { name: 'is_sold', type: 'boolean' },
        { name: 'produced_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_REPORTS,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'milk_production_id', type: 'string' },
        { name: 'liters', type: 'number' },
        { name: 'reported_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_PRODUCTION_SUMMARY,
      columns: [
        { name: 'total_production', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MONTHLY_MILK_PRODUCTION,
      columns: [
        { name: 'year', type: 'number' },
        { name: 'month', type: 'number' },
        { name: 'liters', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE_SALES,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'sold_by', type: 'number' },
        { name: 'sold_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_SALES,
      columns: [
        { name: 'milk_production_id', type: 'string' },
        { name: 'sold_by', type: 'number' },
        { name: 'sold_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.EARNINGS_SUMMARY,
      columns: [
        { name: 'total_earnings', type: 'number' },
        { name: 'total_cattle_sales', type: 'number' },
        { name: 'total_milk_sales', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.ANNUAL_EARNINGS,
      columns: [
        { name: 'year', type: 'number' },
        { name: 'total_earnings', type: 'number' },
        { name: 'total_cattle_sales', type: 'number' },
        { name: 'total_milk_sales', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.NOTIFICATIONS,
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'icon_name', type: 'string' },
        { name: 'is_marked_as_read', type: 'boolean' },
        { name: 'event_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    })
  ]
})
