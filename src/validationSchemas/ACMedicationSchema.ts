import Medication from "@/database/models/Medication";
import { z } from "zod";

const ACMedicationSchema = z.object({
  medication: z.string(),
  nextDoseAt: z.date(),
  dosesPerYear: z.coerce.number(),
})

export default ACMedicationSchema;
export type ACMedication = z.infer<typeof ACMedicationSchema>;