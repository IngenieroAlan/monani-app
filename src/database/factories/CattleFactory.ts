import { faker } from '@faker-js/faker'
import { DirtyRaw } from '@nozbe/watermelondb'
import { addDays, subMonths, subYears } from 'date-fns'
import { CattleStatus, ProductionType } from '../models/Cattle'

const PROBABILITY_OF_NAME = 0.3
const PROBABILITY_OF_PREGNANCY = 0.2

const PROBABILITY_OF_QUARANTINE = 0.2
const MIN_QUARANTINE_DAYS = 1
const MAX_QUARANTINE_DAYS = 40

const MIN_DATE_ADMITTED_AT = subYears(new Date(), 2)
const MAX_DATE_ADMITTED_AT = subMonths(new Date(), 6)

const MIN_WEIGHT = 600
const MAX_WEIGHT = 800

const setProductionType = () => {
  const types: ProductionType[] = ['De carne', 'Lechera']

  return faker.helpers.arrayElement(types)
}

const setCattleStatus = () => {
  const status: CattleStatus[] = ['De deshecho', 'De reemplazo', 'En producción', 'Gestante']

  return faker.helpers.arrayElement(status)
}

const setQuarantine = () => {
  const days = faker.helpers.maybe(() => faker.number.int({ min: MIN_QUARANTINE_DAYS, max: MAX_QUARANTINE_DAYS }), {
    probability: PROBABILITY_OF_QUARANTINE
  })

  if (days) return addDays(new Date(), days).getTime()
}

const CattleFactory = (numOfRecords: number = 1) => {
  const records: DirtyRaw[] = Array.from({ length: numOfRecords }, () => ({
    name: faker.helpers.maybe(() => faker.person.firstName('female'), { probability: PROBABILITY_OF_NAME }),
    tag_id: faker.string.numeric(4),
    tag_cattle_number: faker.helpers.replaceSymbols('## ## ####'),
    weight: faker.number.float({ min: MIN_WEIGHT, max: MAX_WEIGHT, fractionDigits: faker.number.int(3) }),
    quarantine_ends_at: setQuarantine(),
    admitted_at: faker.date.between({ from: MIN_DATE_ADMITTED_AT, to: MAX_DATE_ADMITTED_AT }).getTime(),
    born_at: faker.date.past({ years: 4 }).getTime(),
    pregnant_at: faker.helpers.maybe(() => faker.date.past().getTime(), { probability: PROBABILITY_OF_PREGNANCY }),
    production_type: setProductionType(),
    cattle_status: setCattleStatus(),
    is_active: true,
    is_archived: false,
    is_sold: false
  }))

  return records
}

export default CattleFactory
