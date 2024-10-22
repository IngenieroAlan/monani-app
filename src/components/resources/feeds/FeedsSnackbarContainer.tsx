import { memo } from 'react'
import MSnackbar from '../../MSnackbar'
import SnackbarContainer from '../../SnackbarContainer'

export const FeedsSnackbarId = {
  FEED_IN_USE: 'feedInUseSnackbar',
  STORED_FEED: 'storedFeedSnackbar',
  DELETED_FEED: 'deletedFeedSnackbar',
  UPDATED_FEED: 'updatedFeedSnackbar'
}

const FeedsSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbar>
      <MSnackbar id={FeedsSnackbarId.FEED_IN_USE}>El alimento está actualmente en uso.</MSnackbar>
      <MSnackbar id={FeedsSnackbarId.STORED_FEED}>Alimento guardado con éxito.</MSnackbar>
      <MSnackbar id={FeedsSnackbarId.DELETED_FEED}>Alimento eliminado con éxito.</MSnackbar>
      <MSnackbar id={FeedsSnackbarId.UPDATED_FEED}>Alimento actualizado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(FeedsSnackbarContainer)
