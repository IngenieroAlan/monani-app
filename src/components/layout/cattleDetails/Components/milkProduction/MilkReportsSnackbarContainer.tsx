import MSnackbar from '@/components/MSnackbar'
import SnackbarContainer from '@/components/SnackbarContainer'
import { memo } from 'react'

export const MilkReportsSnackbarId = {
  MILK_REPORT_CREATED: 'milkReportStoredSnackbar',
  MILK_REPORT_UPDATED: 'milkReportUpdatedSnackbar',
  MILK_REPORT_DELETED: 'milkReportDeletedSnackbar',
  MILK_REPORT_DISMISSED: 'milkReportDismissedSnackbar'
}

const MilkReportsSnackbarContainer = () => {
  return (
    <SnackbarContainer dismissSnackbarId={MilkReportsSnackbarId.MILK_REPORT_DISMISSED}>
      <MSnackbar id={MilkReportsSnackbarId.MILK_REPORT_CREATED}>Reporte de leche creado con éxito.</MSnackbar>
      <MSnackbar id={MilkReportsSnackbarId.MILK_REPORT_UPDATED}>Reporte de leche actualizado con éxito.</MSnackbar>
      <MSnackbar id={MilkReportsSnackbarId.MILK_REPORT_DELETED}>Reporte de leche eliminado con éxito.</MSnackbar>
    </SnackbarContainer>
  )
}

export default memo(MilkReportsSnackbarContainer)
