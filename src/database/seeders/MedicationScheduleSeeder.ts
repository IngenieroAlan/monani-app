import { createMedicationNotification } from '@/notifee/constructors'
import { faker } from '@faker-js/faker/.'
import { DirtyRaw } from '@nozbe/watermelondb'
import database from '..'
import Cattle from '../models/Cattle'
import Medication from '../models/Medication'
import MedicationSchedule from '../models/MedicationSchedule'
import { TableName } from '../schema'

let NUM_OF_RECORDS = 0
const MIN_NUM_OF_MEDS = 2
const MAX_NUM_OF_MEDS = 4

const getMeds = (medications: Medication[]) => {
  const numOfMedications = faker.number.int({ min: MIN_NUM_OF_MEDS, max: MAX_NUM_OF_MEDS })
  let shuffled = faker.helpers.shuffle(medications)

  return shuffled.slice(0, numOfMedications)
}

const createMedicationScheduleRecords = async (cattle: Cattle, medicationsToSchedule: Medication[]) => {
  NUM_OF_RECORDS += medicationsToSchedule.length

  const medicationScheduleRecords: DirtyRaw[] = []

  for (const medicationToSchedule of medicationsToSchedule) {
    const dosesPerYear = faker.number.int({ min: 1, max: 3 })
    const nextDoseAt = new Date().setMonth(new Date().getMonth() + 12 / dosesPerYear)

    medicationScheduleRecords.push({
      cattle_id: cattle.id,
      medication_name: medicationToSchedule.name,
      medication_id: medicationToSchedule.id,
      next_dose_at: nextDoseAt,
      doses_per_year: dosesPerYear
    })
  }

  await database.write(async () => {
    medicationScheduleRecords.map(async (medicationSchedule) => {
      const createdMedicationSchedule = await database
        .get<MedicationSchedule>(TableName.MEDICATION_SCHEDULES)
        .create((record) => {
          record.cattle.set(cattle)

          record.medication.id = medicationSchedule.medication_id
          record.nextDoseAt = medicationSchedule.next_dose_at
          record.dosesPerYear = medicationSchedule.doses_per_year
        })

      createMedicationNotification(
        cattle,
        medicationSchedule.medication_name,
        createdMedicationSchedule.id,
        medicationSchedule.doses_per_year,
        medicationSchedule.next_dose_at
      )
    })
  })
}

const MedicationScheduleSeeder = async () => {
  const cattle = await database.get<Cattle>(TableName.CATTLE).query().fetch()
  const medications = await database.get<Medication>(TableName.MEDICATIONS).query().fetch()

  for (const cow of cattle) {
    const medicationsToSchedule = getMeds(medications)

    createMedicationScheduleRecords(cow, medicationsToSchedule)
  }

  console.log(`Medication schedules table seeded with ${NUM_OF_RECORDS} records.`)
}

export default MedicationScheduleSeeder
