import { FeedProportion } from "@/database/models/DietFeed";
import { z } from "zod";

const DietFeedSchema = z.object({
    feedId: z.string(),
    feedProportion: z.enum(['Por porcentaje', 'Fija']),
    quantity: z.coerce.number()
})

export default DietFeedSchema;