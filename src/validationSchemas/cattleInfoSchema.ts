import { CattleStatus, ProductionType } from '@/database/models/Cattle'
import { z } from 'zod'

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 255

const CattleStatusEnum = z.enum(["Gestante", "En producción", "De reemplazo", "De deshecho"]) satisfies z.ZodType<CattleStatus>
const ProductionTypeEnum = z.enum(["Lechera", "De carne"]) satisfies z.ZodType<ProductionType>

const CattleInfoSchema = z.object({
  name: z.string().optional(),
  tagId: z.string(),
  tagCattleNumber: z.string(),
  admittedAt: z.date(),
  weight: z.coerce.number(),
  bornAt: z.date(),
  cattleStatus: CattleStatusEnum,
  pregnantAt: z.date().optional(),
  productionType: ProductionTypeEnum,
  motherId: z.string().optional(),
  quarantineDaysLeft: z.coerce.number().optional(),
})

export default CattleInfoSchema;