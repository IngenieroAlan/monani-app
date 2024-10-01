export enum TableName {
  FEEDS = 'feeds',
  DIETS = 'diets',
  DIET_FEED = 'diet_feed',
  CATTLE = 'cattle',
  GENEALOGY = 'genealogy',
  ARCHIVED_CATTLE = 'archived_cattle',
  MEDICATIONS = 'medications',
  MEDICATION_SCHEDULES = 'medication_schedules',
  WEIGHT_REPORTS = 'weight_reports',
  MILK_PRODUCTIONS = 'milk_productions',
  MILK_REPORTS = 'milk_reports',
  CATTLE_SALES = 'cattle_sales',
  MILK_SALES = 'milk_sales',
  NOTIFICATIONS = 'notifications'
}

export type MatterProportion = 'Procentaje de peso' | 'Fija' | 'Sin definir'
export type FeedProportion = 'Fija' | 'Por porcentaje'
export type ProductionType = 'Lechera' | 'De carne'
export type CattleStatus = 'Gestante' | 'En producción' | 'De reemplazo' | 'De deshecho'
export type ArchiveReason = 'Muerte' | 'Extravío' | 'Otro'
export type MedicationType = 'Desparasitante' | 'Vitaminas' | 'Suplemento mineral' | 'Otro'
