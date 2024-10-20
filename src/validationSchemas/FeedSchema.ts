import { z } from 'zod'

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 255
const FEED_TYPES = ['Alimento', 'Concentrado de engorda', 'Concentrado lechero'] as const

const FeedSchema = z.object({
  name: z
    .string({ message: 'El nombre es requerido.' })
    .min(NAME_MIN_LENGTH, { message: `El nombre debe contener mínimo ${NAME_MIN_LENGTH} caracteres.` })
    .max(NAME_MAX_LENGTH, { message: `El nombre debe contener máximo ${NAME_MAX_LENGTH} caracteres.` }),
  feedType: z.enum(FEED_TYPES, { message: 'El tipo de alimento es requerido.' })
})

export default FeedSchema
