import { faker } from '@faker-js/faker/.'
import database from '..'
import Cattle from '../model/Cattle'
import Genealogy from '../model/Genealogy'
import { TableName } from '../schema'

type GenealogyRecord = { mother_id: string; offspring_id: string }

const FRACTION_OF_MOTHERS = 4

const MIN_OFFSPRINGS = 1
const MAX_OFFSPRINGS = FRACTION_OF_MOTHERS - 1

const GenealogySeeder = async () => {
  const genealogyRecords: GenealogyRecord[] = []
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const shuffledCattle = faker.helpers.shuffle(cattle)
  const mothers = shuffledCattle.slice(0, Math.floor(cattle.length / FRACTION_OF_MOTHERS))
  const offsprings = shuffledCattle.slice(Math.floor(cattle.length / FRACTION_OF_MOTHERS), cattle.length)

  for (const mother of mothers) {
    const numOfOffsprings = faker.number.int({ min: MIN_OFFSPRINGS, max: MAX_OFFSPRINGS })

    for (let i = 0; i < numOfOffsprings; i++) {
      const offspring = offsprings.shift()!
      genealogyRecords.push({ mother_id: mother.id, offspring_id: offspring.id })
    }
  }

  await database.write(async () => {
    await database.batch(
      ...genealogyRecords.map((genealogy) => {
        return database.get<Genealogy>(TableName.GENEALOGY).prepareCreateFromDirtyRaw(genealogy)
      })
    )
  })

  console.log(`Genealogy table seeded with ${genealogyRecords.length} records.`)
}

export default GenealogySeeder
