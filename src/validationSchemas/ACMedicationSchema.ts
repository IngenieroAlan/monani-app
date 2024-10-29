/**AC = add cattle ~ */
import { z } from "zod";

const ACMedicationSchema = z.object({
  medicationId: z.string(),
  nextDoseAt: z.date(),
  dosesPerYear: z.coerce.number(),
})

export default ACMedicationSchema;
export type ACMedication = z.infer<typeof ACMedicationSchema>;