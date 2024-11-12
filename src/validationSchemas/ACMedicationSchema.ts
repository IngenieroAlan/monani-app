import { z } from "zod";

const ACMedicationSchema = z.object({
  medication: z.any(),
  nextDoseAt: z.date(),
  dosesPerYear: z.coerce.number(),
})

export default ACMedicationSchema;
export type ACMedication = z.infer<typeof ACMedicationSchema>;