import { MatterProportion } from "@/database/models/Diet";
import { z } from "zod";

const MatterProportionEnum = z.enum(["Porcentaje de peso", "Fija", "Sin definir"]) as z.ZodType<MatterProportion>;

const ACDietSchema = z.object({
  waterAmount: z.coerce.number(),
  matterProportion: MatterProportionEnum,
  matterAmount: z.coerce.number().optional(),
  isConcentrateExcluded: z.boolean()
})

export default ACDietSchema;
export type ACDietFields = z.infer<typeof ACDietSchema>;