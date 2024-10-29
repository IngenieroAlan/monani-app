import { FeedProportion } from "@/database/models/DietFeed";
import { z } from "zod";

const FeedProportionEnum = z.enum(['Por porcentaje', 'Fija']) satisfies z.ZodType<FeedProportion>;

const DietFeedSchema = z.object({
  feedId: z.string(),
  feedProportion: FeedProportionEnum,
  quantity: z.coerce.number()
})

export default DietFeedSchema;
export type DietFeedFields = z.infer<typeof DietFeedSchema>;