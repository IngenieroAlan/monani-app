import { z } from 'zod'

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 255
const MEDICATION_TYPES = ['Desparasitante', 'Vitaminas', 'Suplemento mineral', 'Otro'] as const

const MedicationSchema = z.object({
  name: z
    .string({ message: 'El nombre es requerido.' })
    .min(NAME_MIN_LENGTH, { message: `El nombre debe contener mínimo ${NAME_MIN_LENGTH} caracteres.` })
    .max(NAME_MAX_LENGTH, { message: `El nombre debe contener máximo ${NAME_MAX_LENGTH} caracteres.` }),
  medicationType: z.enum(MEDICATION_TYPES, { message: 'El tipo de medicamento es requerido.' })
})

export default MedicationSchema
