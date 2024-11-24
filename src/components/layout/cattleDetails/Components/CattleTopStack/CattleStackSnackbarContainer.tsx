import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'

export const CattleStackSnackbarId = {
  CATTLE_ARCHIVED: 'cattleArchivedSnackbar',
  CATTLE_UNARCHIVED: 'cattleUnarchivedSnackbar',
  CATTLE_ARCHIVE_UPDATED: 'cattleArchiveUpdatedSnackbar',
  CATTLE_STACK_DISMISS: 'cattleStackDismissSnackbar'
}

const CattleStackSnackbarContainer = () => {
  return (
    <SnackbarContainer
      dismissSnackbarId={CattleStackSnackbarId.CATTLE_STACK_DISMISS}
      bottom={80}
    >
      <MSnackbar id={CattleStackSnackbarId.CATTLE_ARCHIVED}>Ganado archivado con éxito.</MSnackbar>
      <MSnackbar id={CattleStackSnackbarId.CATTLE_UNARCHIVED}>Ganado desarchivado con éxito.</MSnackbar>
      <MSnackbar id={CattleStackSnackbarId.CATTLE_ARCHIVE_UPDATED}>Archivo actualizado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default CattleStackSnackbarContainer
