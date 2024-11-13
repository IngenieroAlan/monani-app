import { memo } from 'react'
import SnackbarContainer from '../SnackbarContainer'
import MSnackbar from '../MSnackbar'

export const DietSnackbarId = {
  UPDATED_DIET: 'updatedDietSnackbar',
  STORED_DIETFEED: 'storedDietFeedSnackbar',
  REMOVED_DIETFEED: 'deletedDietFeedSnackbar',
  UPDATED_DIETFEED: 'updatedDietFeedSnackbar',
  SAME_DIETFEED: 'sameDietFeedSnackbar',
}

const DietSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbar>
      <MSnackbar id={DietSnackbarId.UPDATED_DIET}>Dieta actualizada con éxito.</MSnackbar>
      <MSnackbar id={DietSnackbarId.STORED_DIETFEED}>Alimento guardado con éxito.</MSnackbar>
      <MSnackbar id={DietSnackbarId.REMOVED_DIETFEED}>Alimento eliminado con éxito.</MSnackbar>
      <MSnackbar id={DietSnackbarId.UPDATED_DIETFEED}>Alimento actualizado con éxito.</MSnackbar>
      <MSnackbar id={DietSnackbarId.SAME_DIETFEED}>No puedes seleccionar un alimento ya listado en la dieta.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(DietSnackbarContainer)
