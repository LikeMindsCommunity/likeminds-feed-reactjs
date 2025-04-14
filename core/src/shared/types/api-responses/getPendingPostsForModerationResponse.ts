import { GetReports as GetPendingPostModeration, LMResponseType } from "@likeminds.community/feed-js";

export interface GetPendingPostModerationResponse
  extends LMResponseType<GetPendingPostModeration> {}
