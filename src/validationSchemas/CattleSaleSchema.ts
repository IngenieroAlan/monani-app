import { z } from 'zod'

const CattleSaleSchema = z.object({
  soldBy: z.coerce
    .number({
      required_error: ' El monto de venta es requerido.',
      invalid_type_error: 'Se debe ingresar un monto válido.'
    })
    .gt(0, { message: 'El monto debe ser mayor a 0.' }),
  pricePerKg: z.coerce
    .number({
      invalid_type_error: 'Se debe ingresar un precio por kg. válido.'
    })
    .gt(0, { message: 'El precio por kg. debe ser mayor a 0.' }),
  soldAt: z.date({
    required_error: 'La fecha de venta es requerida.',
    invalid_type_error: 'Se debe ingresar una fecha de venta válida.'
  })
})

export default CattleSaleSchema
