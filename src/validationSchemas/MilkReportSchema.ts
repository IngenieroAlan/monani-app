import Cattle from '@/database/models/Cattle'
import { Q } from '@nozbe/watermelondb'
import { format } from 'date-fns'
import { z } from 'zod'

const createMilkReportSchema = (cattle: Cattle) => {
  return z.object({
    liters: z.coerce
      .number({
        required_error: 'Los litros de leche son requeridos',
        invalid_type_error: 'Se debe ingresar una cantidad de litros válida.'
      })
      .gt(0, { message: 'La cantidad de litros debe ser mayor a 0.' }),
    reportedAt: z
      .date({
        required_error: 'La fecha de reporte es requerida.',
        invalid_type_error: 'Se debe ingresar una fecha de reporte válida.'
      })
      .refine(
        async (date) => {
          const formattedDate = format(date, 'yyyy/MM/dd')
          const pendingMilkReport = await cattle.pendingMilkReports.extend(
            Q.unsafeSqlExpr(`strftime("%Y/%m/%d", datetime(reported_at / 1000, "unixepoch")) = '${formattedDate}'`)
          )

          return pendingMilkReport.length === 0
        },
        { message: 'La fecha ingresada tiene un reporte de leche sin vender.' }
      )
  })
}

export default createMilkReportSchema
