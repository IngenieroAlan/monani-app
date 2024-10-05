import { appSchema, tableSchema } from '@nozbe/watermelondb'
import { TableName } from './types'

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: TableName.FEEDS,
      columns: [
        { name: 'name', type: 'string' },
        { name: 'feed_type', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.DIETS,
      columns: [
        { name: 'matter_amount', type: 'number' },
        { name: 'matter_proportion', type: 'string' }, // Porcentaje de peso | Fija | Sin definir
        { name: 'is_concentrate_excluded', type: 'boolean' },
        { name: 'water_amount', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.DIET_FEED,
      columns: [
        { name: 'feed_id', type: 'string' },
        { name: 'feed_proportion', type: 'string' }, // Fija | Por procentaje
        { name: 'amount', type: 'number' },
        { name: 'diet_id', type: 'string' },
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
        { name: 'entry_date', type: 'number' },
        { name: 'weight', type: 'number' },
        { name: 'birth_date', type: 'number' },
        { name: 'production_type', type: 'string' }, // Lechera | De carne
        { name: 'cattle_status', type: 'string' }, // Gestante | En producción | De reemplazo | De deshecho
        { name: 'pregnancy_date', type: 'number', isOptional: true },
        { name: 'quarantine_days_left', type: 'number', isOptional: true },
        { name: 'diet_id', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_archived', type: 'boolean' },
        { name: 'is_sold', type: 'boolean' },
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
      name: TableName.ARCHIVED_CATTLE,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'reason', type: 'string' }, // Muerte | Extravío | Otro
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'date', type: 'number' },
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
      ]
    }),
    tableSchema({
      name: TableName.MEDICATION_SCHEDULES,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'medication_id', type: 'string' },
        { name: 'next_dose', type: 'number' },
        { name: 'doses_per_year', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.WEIGHT_REPORTS,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'weight', type: 'number' },
        /* { name: 'weight_gain', type: 'number', isOptional: true },
        { name: 'days_passed', type: 'number' },
        { name: 'avg_daily_gain', type: 'number', isOptional: true }, */
        { name: 'date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_PRODUCTIONS,
      columns: [
        { name: 'liters', type: 'number' },
        { name: 'current_session', type: 'number' },
        { name: 'date', type: 'number' },
        { name: 'is_sold', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_REPORTS,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'liters', type: 'number' },
        { name: 'session_number', type: 'number' },
        { name: 'date', type: 'number' },
        { name: 'milk_production_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.CATTLE_SALES,
      columns: [
        { name: 'cattle_id', type: 'string' },
        { name: 'total', type: 'number' },
        { name: 'date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: TableName.MILK_SALES,
      columns: [
        { name: 'milk_production_id', type: 'string' },
        { name: 'total', type: 'number' },
        { name: 'milk_liters', type: 'number' },
        { name: 'date', type: 'number' },
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
        { name: 'date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    })
  ]
})
