import { MedicationFields } from '@/components/forms/MedicationForm'
import Medication from '@/database/models/Medication'
import { TableName } from '@/database/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'

const useMedications = () => {
  const database = useDatabase()

  const getMedications = async () => {
    return await database.collections
      .get<Medication>(TableName.MEDICATIONS)
      .query(Q.sortBy('name', Q.asc))
      .fetch()
  }

  const createMedication = async (data: MedicationFields) => {
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

  const updateMedication = async (medicationToUpdate: Medication, data: MedicationFields) => {
    const updatedMedication = await database.write(async () => {
      return medicationToUpdate.update(medication => {
        medication.name = data.name
        medication.medicationType = data.medicationType
      })
    })

    return updatedMedication
  }

  const deleteMedication = async (medication: Medication) => {
    await database.write(async () => {
      await medication.destroyPermanently()
    })
  }

  return {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
  }
}

export default useMedications
