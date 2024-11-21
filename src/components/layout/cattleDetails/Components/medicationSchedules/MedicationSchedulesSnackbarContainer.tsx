import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'
import { memo } from 'react'

export const MedicationSchedulesSnackbarId = {
  STORED_MEDICATION_SCHEDULE: 'storedMedicationScheduleSnackbar',
  REMOVED_MEDICATION_SCHEDULE: 'deletedMedicationScheduleSnackbar',
  UPDATED_MEDICATION_SCHEDULE: 'updatedMedicationScheduleSnackbar',
  SAME_MEDICATION: 'sameMedicationSnackbar',
  MEDICATION_SCHEDULE_DISMISS: 'medicationScheduleDismissSnackbar'
}

const MedicationSchedulesSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbarId={MedicationSchedulesSnackbarId.MEDICATION_SCHEDULE_DISMISS}>
      <MSnackbar id={MedicationSchedulesSnackbarId.STORED_MEDICATION_SCHEDULE}>
        Medicación guardada con éxito.
      </MSnackbar>
      <MSnackbar id={MedicationSchedulesSnackbarId.REMOVED_MEDICATION_SCHEDULE}>
        Medicación eliminada con éxito.
      </MSnackbar>
      <MSnackbar id={MedicationSchedulesSnackbarId.UPDATED_MEDICATION_SCHEDULE}>
        Medicación actualizada con éxito.
      </MSnackbar>
      <MSnackbar id={MedicationSchedulesSnackbarId.SAME_MEDICATION}>
        No puedes seleccionar una medicación ya listado en la medicación.
      </MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(MedicationSchedulesSnackbarContainer)
