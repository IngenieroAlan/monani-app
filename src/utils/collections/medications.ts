import { MedicationFields } from '@/components/forms/MedicationForm'
import database from '@/database'
import Medication from '@/database/models/Medication'
import { TableName } from '@/database/constants'

export const createMedication = async (data: MedicationFields) => {
  const createdMedication = await database.write(async () => {
    return await database.collections
      .get<Medication>(TableName.MEDICATIONS)
      .create((medication) => {
        medication.name = data.name
        medication.medicationType = data.medicationType
      })
  })

  return createdMedication
}