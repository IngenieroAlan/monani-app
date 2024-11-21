import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'

export const InfoSnackbarId = {
  CATTLE_ARCHIVED: 'cattleArchivedSnackbar',
  CATTLE_UNARCHIVED: 'cattleUnarchivedSnackbar',
  CATTLE_ARCHIVE_UPDATED: 'cattleArchiveUpdatedSnackbar',
  CATTLE_ARCHIVE_DISMISS: 'cattleArchiveDismissSnackbar'
}

const InfoSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbarId={InfoSnackbarId.CATTLE_ARCHIVE_DISMISS}>
      <MSnackbar id={InfoSnackbarId.CATTLE_ARCHIVED}>Ganado archivado con éxito.</MSnackbar>
      <MSnackbar id={InfoSnackbarId.CATTLE_UNARCHIVED}>Ganado desarchivado con éxito.</MSnackbar>
      <MSnackbar id={InfoSnackbarId.CATTLE_ARCHIVE_UPDATED}>Archivo actualizado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default InfoSnackbarContainer
