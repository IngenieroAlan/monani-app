import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'

export const CattleSaleSnackbarId = {
  CATTLE_SOLD: 'cattleSoldSnackbar'
}

const CattleSaleSnackbarContainer = () => {
  return (
    <SnackbarContainer>
      <MSnackbar id={CattleSaleSnackbarId.CATTLE_SOLD}>Ganado vendido con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default CattleSaleSnackbarContainer
