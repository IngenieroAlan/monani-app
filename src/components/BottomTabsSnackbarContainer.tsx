import { memo } from 'react'
import MSnackbar from './MSnackbar'
import SnackbarContainer from './SnackbarContainer'

export const BottomTabsSnackbarId = {
  CATTLE_DELETED: 'cattleDeletedSnackbar'
}

const BottomTabsSnackbarContainer = () => {
  return (
    <SnackbarContainer bottom={150}>
      <MSnackbar id={BottomTabsSnackbarId.CATTLE_DELETED}>Ganado eliminado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(BottomTabsSnackbarContainer)
