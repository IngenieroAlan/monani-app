import { memo } from 'react'
import MSnackbar from '../../../../MSnackbar'
import SnackbarContainer from '../../../../SnackbarContainer'

export const MedicationSnackbarId = {
  STORED_MEDICATION: 'storedMedicationSnackbar',
  REMOVED_MEDICATION: 'deletedMedicationSnackbar',
  UPDATED_MEDICATION: 'updatedMedicationSnackbar',
  SAME_MEDICATION: 'sameMedicationSnackbar',
}

const MedicationSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbar>
      <MSnackbar id={MedicationSnackbarId.STORED_MEDICATION}>Medicación guardada con éxito.</MSnackbar>
      <MSnackbar id={MedicationSnackbarId.REMOVED_MEDICATION}>Medicación eliminada con éxito.</MSnackbar>
      <MSnackbar id={MedicationSnackbarId.UPDATED_MEDICATION}>Medicación actualizada con éxito.</MSnackbar>
      <MSnackbar id={MedicationSnackbarId.SAME_MEDICATION}>No puedes seleccionar una medicación ya listado en la medicación.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(MedicationSnackbarContainer)
