import { FeedProportion } from "@/database/models/DietFeed";
import Feed from "@/database/models/Feed";
import { z } from "zod";

const FeedProportionEnum = z.enum(['Por porcentaje', 'Fija']) satisfies z.ZodType<FeedProportion>;

const DietFeedSchema = z.object({
  feed: z.string(),
  feedProportion: FeedProportionEnum,
  quantity: z.coerce.number()
})

export default DietFeedSchema;
export type DietFeedFields = z.infer<typeof DietFeedSchema>;