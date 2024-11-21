import { memo } from 'react'
import MSnackbar from '../../MSnackbar'
import SnackbarContainer from '../../SnackbarContainer'

export const MedicationsSnackbarId = {
  MEDICATION_IN_USE: 'medicationInUseSnackbar',
  STORED_MEDICATION: 'storedMedicationSnackbar',
  DELETED_MEDICATION: 'deletedMedicationSnackbar',
  UPDATED_MEDICATION: 'updatedMedicationSnackbar',
  MEDICATION_DISMISS: 'medicationDismissSnackbar'
}

const MedicationsSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbarId={MedicationsSnackbarId.MEDICATION_DISMISS} bottom={72}>
      <MSnackbar id={MedicationsSnackbarId.MEDICATION_IN_USE}>El medicamento está actualmente en uso.</MSnackbar>
      <MSnackbar id={MedicationsSnackbarId.STORED_MEDICATION}>Medicamento guardado con éxito.</MSnackbar>
      <MSnackbar id={MedicationsSnackbarId.DELETED_MEDICATION}>Medicamento eliminado con éxito.</MSnackbar>
      <MSnackbar id={MedicationsSnackbarId.UPDATED_MEDICATION}>Medicamento actualizado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(MedicationsSnackbarContainer)
