import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'
import { memo } from 'react'

export const GenealogySnackbarId = {
  ASSIGNED_MOTHER: 'storedMotherSnackbar',
  REMOVED_MOTHER: 'deletedMotherSnackbar',
  UPDATED_MOTHER: 'updatedMotherSnackbar',
  UPDATED_OFFSPRING: 'updatedOffspringSnackbar',
  // SAME_MOTHER: 'sameMotherSnackbar',
  SAME_CATTLE: 'sameCattleSnackbar',
  GENEALOGY_DISMISS: 'genealogyDismissSnackbar'
}

const GenealogySnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbarId={GenealogySnackbarId.GENEALOGY_DISMISS}>
      <MSnackbar id={GenealogySnackbarId.ASSIGNED_MOTHER}>Madre asignada con éxito.</MSnackbar>
      <MSnackbar id={GenealogySnackbarId.REMOVED_MOTHER}>Madre eliminada con éxito.</MSnackbar>
      <MSnackbar id={GenealogySnackbarId.UPDATED_MOTHER}>Madre actualizada con éxito.</MSnackbar>
      <MSnackbar id={GenealogySnackbarId.UPDATED_OFFSPRING}>Descendencia actualizado con éxito.</MSnackbar>
      {/* <MSnackbar id={GenealogySnackbarId.SAME_MOTHER}>No puedes seleccionar al mismo ganado como madre.</MSnackbar> */}
      <MSnackbar id={GenealogySnackbarId.SAME_CATTLE}>
        No puedes seleccionar a un ganado ya listado en descendencia.
      </MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(GenealogySnackbarContainer)
