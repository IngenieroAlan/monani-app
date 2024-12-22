import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'
import { memo } from 'react'

export const FeedsSnackbarId = {
  FEED_IN_USE: 'feedInUseSnackbar',
  STORED_FEED: 'storedFeedSnackbar',
  DELETED_FEED: 'deletedFeedSnackbar',
  UPDATED_FEED: 'updatedFeedSnackbar',
  FEED_DISMISS: 'feedDismissSnackbar'
}

const FeedsSnackbarContainer = () => {
  return (
    <SnackbarContainer
      dismissSnackbarId={FeedsSnackbarId.FEED_DISMISS}
      bottom={72}
    >
      <MSnackbar id={FeedsSnackbarId.FEED_IN_USE}>El alimento está actualmente en uso.</MSnackbar>
      <MSnackbar id={FeedsSnackbarId.STORED_FEED}>Alimento guardado con éxito.</MSnackbar>
      <MSnackbar id={FeedsSnackbarId.DELETED_FEED}>Alimento eliminado con éxito.</MSnackbar>
      <MSnackbar id={FeedsSnackbarId.UPDATED_FEED}>Alimento actualizado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(FeedsSnackbarContainer)
