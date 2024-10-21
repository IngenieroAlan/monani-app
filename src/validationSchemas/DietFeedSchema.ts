import { z } from "zod";

const DietFeedSchema = z.object({
    feedId: z.string(),
    feedProportion: z.enum(['Por porcentaje', 'Por cantidad']),
    feedAmount: z.number()
})

export default DietFeedSchema;