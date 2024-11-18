import { ArchiveReason } from '@/database/models/CattleArchive'
import { z } from 'zod'

const MAX_NOTES_LENGTH = 500

const ArchiveReasonEnum = z.enum(['Muerte', 'Extravío', 'Otro'], {
  required_error: 'El motivo de archivo es requerido.',
  invalid_type_error: 'Se debe seleccionar un motivo válido.'
}) satisfies z.ZodType<ArchiveReason>

const CattleArchiveSchema = z.object({
  reason: ArchiveReasonEnum,
  archivedAt: z.date({ message: 'Se debe ingresar una fecha válida.' }),
  notes: z
    .string()
    .max(MAX_NOTES_LENGTH, { message: `Las notas deben contener como máximo ${MAX_NOTES_LENGTH} caracteres.` })
    .optional()
})

export default CattleArchiveSchema
