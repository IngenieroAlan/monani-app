export const TableName = {
  FEEDS: 'feeds',
  DIETS: 'diets',
  DIET_FEED: 'diet_feed',
  CATTLE: 'cattle',
  GENEALOGY: 'genealogy',
  CATTLE_ARCHIVES: 'cattle_archives',
  MEDICATIONS: 'medications',
  MEDICATION_SCHEDULES: 'medication_schedules',
  WEIGHT_REPORTS: 'weight_reports',
  MILK_PRODUCTIONS: 'milk_productions',
  MILK_REPORTS: 'milk_reports',
  MILK_PRODUCTION_SUMMARY: 'milk_production_summary',
  DAILY_MILK_PRODUCTIONS: 'daily_milk_productions',
  MONTHLY_MILK_PRODUCTIONS: 'monthly_milk_productions',
  CATTLE_SALES: 'cattle_sales',
  MILK_SALES: 'milk_sales',
  EARNINGS_SUMMARY: 'earnings_summary',
  ANNUAL_EARNINGS: 'annual_earnings',
  SENT_NOTIFICATIONS: 'sent_notifications',
  PENDING_NOTIFICATIONS: 'pending_notifications'
} as const

export const FeedsCol = {
  NAME: 'name',
  FEED_TYPE: 'feed_type'
} as const

export const DietsCol = {
  WATER_AMOUNT: 'water_amount',
  MATTER_PROPORTION: 'matter_proportion',
  MATTER_AMOUNT: 'matter_amount',
  PERCENTAGE: 'percentage',
  IS_CONCENTRATE_EXCLUDED: 'is_concentrate_excluded'
} as const

export const DietFeedCol = {
  DIET_ID: 'diet_id',
  FEED_ID: 'feed_id',
  FEED_PROPORTION: 'feed_proportion',
  FEED_AMOUNT: 'feed_amount',
  PERCENTAGE: 'percentage'
} as const

export const CattleCol = {
  NAME: 'name',
  TAG_ID: 'tag_id',
  TAG_CATTLE_NUMBER: 'tag_cattle_number',
  WEIGHT: 'weight',
  PRODUCTION_TYPE: 'production_type',
  CATTLE_STATUS: 'cattle_status',
  PREGNANT_AT: 'pregnant_at',
  IS_ACTIVE: 'is_active',
  IS_ARCHIVED: 'is_archived',
  IS_SOLD: 'is_sold',
  DIET_ID: 'diet_id',
  BORN_AT: 'born_at',
  ADMITTED_AT: 'admitted_at',
  QUARANTINE_ENDS_AT: 'quarantine_ends_at'
} as const

export const GenealogyCol = {
  MOTHER_ID: 'mother_id',
  OFFSPRING_ID: 'offspring_id'
} as const

export const CattleArchivesCol = {
  CATTLE_ID: 'cattle_id',
  REASON: 'reason',
  NOTES: 'notes',
  ARCHIVED_AT: 'archived_at'
} as const

export const MedicationsCol = {
  NAME: 'name',
  MEDICATION_TYPE: 'medication_type'
} as const

export const MedicationSchedulesCol = {
  CATTLE_ID: 'cattle_id',
  MEDICATION_ID: 'medication_id',
  DOSES_PER_YEAR: 'doses_per_year',
  NEXT_DOSE_AT: 'next_dose_at'
} as const

export const WeightReportsCol = {
  CATTLE_ID: 'cattle_id',
  WEIGHT: 'weight',
  WEIGHT_DIFFERENCE: 'weight_difference',
  DAYS_PASSED: 'days_passed',
  AVG_DAILY_DIFFERENCE: 'avg_daily_difference',
  WEIGHED_AT: 'weighed_at'
} as const

export const MilkProductionsCol = {
  LITERS: 'liters',
  PRODUCTION_NUMBER: 'production_number',
  IS_SOLD: 'is_sold',
  PRODUCED_AT: 'produced_at'
} as const

export const MilkReportsCol = {
  CATTLE_ID: 'cattle_id',
  MILK_PRODUCTION_ID: 'milk_production_id',
  LITERS: 'liters',
  PRODUCTION_NUMBER: 'production_number',
  IS_SOLD: 'is_sold',
  REPORTED_AT: 'reported_at'
} as const

export const MilkProductionSummaryCol = {
  TOTAL_PRODUCTION: 'total_production'
} as const

export const MonthlyMilkProductionsCol = {
  YEAR: 'year',
  MONTH: 'month',
  LITERS: 'liters'
} as const

export const DailyMilkProductionsCol = {
  LITERS: 'liters',
  TOTAL_PRODUCTIONS: 'total_productions',
  PRODUCED_AT: 'produced_at'
} as const

export const CattleSalesCol = {
  DETAILS: 'details',
  KG: 'kg',
  SOLD_BY: 'sold_by',
  CATTLE_ID: 'cattle_id',
  SOLD_AT: 'sold_at'
} as const

export const MilkSalesCol = {
  DETAILS: 'details',
  LITERS: 'liters',
  SOLD_BY: 'sold_by',
  MILK_PRODUCTION_ID: 'milk_production_id',
  SOLD_AT: 'sold_at'
} as const

export const EarningsSummaryCol = {
  TOTAL_EARNINGS: 'total_earnings',
  TOTAL_CATTLE_SALES: 'total_cattle_sales',
  TOTAL_MILK_SALES: 'total_milk_sales'
} as const

export const AnnualEarningsCol = {
  YEAR: 'year',
  TOTAL_EARNINGS: 'total_earnings',
  TOTAL_CATTLE_SALES: 'total_cattle_sales',
  TOTAL_MILK_SALES: 'total_milk_sales'
} as const

export const SentNotificationsCol = {
  NOTIFEE_ID: 'notifee_id',
  CATTLE_ID: 'cattle_id',
  IS_MARKED_AS_READ: 'is_marked_as_read',
  TYPE: 'type',
  EXTRA_INFO: 'extra_info',
  EVENT_AT: 'event_at'
} as const

export const PendingNotificationsCol = {
  TYPE: 'type',
  FOREIGN_ID: 'foreign_id',
  CATTLE_ID: 'cattle_id'
} as const
