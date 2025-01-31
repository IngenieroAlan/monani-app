import SnackbarContainer from '@/components/SnackbarContainer'

export const HomeSnackbarId = {
  CREATE_CATTLE_DISMISS: 'createCattleDismissSnackbar'
}

const HomeSnackbarContainer = () => {
  return (
    <SnackbarContainer
      dismissSnackbarId='createCattleDismissSnackbar'
      bottom={72}
    />
  )
}

export default HomeSnackbarContainer
