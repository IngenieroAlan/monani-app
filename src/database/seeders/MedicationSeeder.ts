import database from '..'
import medications from '../factories/MedicationFactory'
import Medication from '../models/Medication'
import { TableName } from '../schema'

const MedicationSeeder = async () => {
  await database.write(async () => {
    await database.batch(
      medications.map((medication) => {
        return database.get<Medication>(TableName.MEDICATIONS).prepareCreateFromDirtyRaw(medication)
      })
    )
  })

  console.log(`Medications table seeded with ${medications.length} records.`)
}

export default MedicationSeeder
