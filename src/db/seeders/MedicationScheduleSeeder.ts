import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import Cattle from '../model/Cattle'
import Medication from '../model/Medication'
import MedicationSchedule from '../model/MedicationSchedule'
import { TableName } from '../schema'

let NUM_OF_RECORDS = 0
const MIN_NUM_OF_MEDS = 2
const MAX_NUM_OF_MEDS = 4

const getMeds = (medications: Medication[]) => {
  const numOfMedications = faker.number.int({ min: MIN_NUM_OF_MEDS, max: MAX_NUM_OF_MEDS })
  let shuffled = faker.helpers.shuffle(medications)

  return shuffled.slice(0, numOfMedications)
}

const createMedicationScheduleRecords = async (cattleId: string, medicationsToSchedule: Medication[]) => {
  NUM_OF_RECORDS += medicationsToSchedule.length

  const medicationScheduleRecords: DirtyRaw[] = []

  for (const medicationToSchedule of medicationsToSchedule) {
    const dosesPerYear = faker.number.int({ min: 1, max: 3 })
    const nextDoseAt = new Date()

    medicationScheduleRecords.push({
      cattle_id: cattleId,
      medication_id: medicationToSchedule.id,
      next_dose_at: nextDoseAt.setMonth(nextDoseAt.getMonth() + 12 / dosesPerYear),
      doses_per_year: dosesPerYear
    })
  }

  await database.write(async () => {
    await database.batch(
      medicationScheduleRecords.map((medicationSchedule) => {
        return database
          .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
          .prepareCreateFromDirtyRaw(medicationSchedule)
      })
    )
  })
}

const MedicationScheduleSeeder = async () => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const medications = await database.get<Medication>(TableName.MEDICATIONS).query().fetch()

  for (const cow of cattle) {
    const medicationsToSchedule = getMeds(medications)

    createMedicationScheduleRecords(cow.id, medicationsToSchedule)
  }

  console.log(`Medication schedules table seeded with ${NUM_OF_RECORDS} records.`)
}

export default MedicationScheduleSeeder
