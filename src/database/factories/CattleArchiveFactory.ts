import { faker } from '@faker-js/faker'
import { subMonths } from 'date-fns'
import { ArchiveReason } from '../models/CattleArchive'

const PROBABILITY_OF_NOTES = 0.5

const MIN_ARCHIVED_AT = subMonths(new Date(), 6)
const MAX_ARCHIVED_AT = new Date()

const setReason = () => {
  const reasons: ArchiveReason[] = ['Extravío', 'Muerte', 'Otro']

  return faker.helpers.arrayElement(reasons)
}

const CattleArchiveFactory = (cattleId: string) => {
  return {
    cattle_id: cattleId,
    reason: setReason(),
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: PROBABILITY_OF_NOTES }),
    archived_at: faker.date.between({ from: MIN_ARCHIVED_AT, to: MAX_ARCHIVED_AT }).getTime()
  }
}

export default CattleArchiveFactory
