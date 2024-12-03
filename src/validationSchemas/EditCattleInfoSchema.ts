import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { z } from 'zod'

const CattleStatusEnum = z.enum(["Gestante", "En producción", "De reemplazo", "De deshecho"]) satisfies z.ZodType<CattleStatus>
const ProductionTypeEnum = z.enum(["Lechera", "De carne"]) satisfies z.ZodType<ProductionType>

const EditCattleInfoSchema = z.object({
  name: z.string().optional(),
  tagId: z.string().length(4),
  tagCattleNumber: z.string().regex(/^\d{2}\s\d{2}\s\d{4}$/),
  admittedAt: z.date(),
  weight: z.coerce.number().lte(9999),
  bornAt: z.date(),
  cattleStatus: CattleStatusEnum,
  pregnantAt: z.date().optional(),
  productionType: ProductionTypeEnum,
  quarantineDays: z.coerce.number().optional(),
})

export default EditCattleInfoSchema;
