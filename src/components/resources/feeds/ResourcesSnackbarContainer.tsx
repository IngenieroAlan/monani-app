import { memo } from 'react'
import MSnackbar from '../../MSnackbar'
import SnackbarContainer from '../../SnackbarContainer'

export const ResourcesSnackbarId = {
  FEED_IN_USE: 'feedInUseSnackbar',
  STORED_FEED: 'storedFeedSnackbar',
  DELETED_FEED: 'deletedFeedSnackbar',
  UPDATED_FEED: 'updatedFeedSnackbar'
}

const ResourcesSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbar>
      <MSnackbar id={ResourcesSnackbarId.FEED_IN_USE}>El alimento está actualmente en uso.</MSnackbar>
      <MSnackbar id={ResourcesSnackbarId.STORED_FEED}>Alimento guardado con éxito.</MSnackbar>
      <MSnackbar id={ResourcesSnackbarId.DELETED_FEED}>Alimento eliminado con éxito.</MSnackbar>
      <MSnackbar id={ResourcesSnackbarId.UPDATED_FEED}>Alimento actualizado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(ResourcesSnackbarContainer)
