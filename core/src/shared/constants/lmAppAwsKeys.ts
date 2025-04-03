import { LMFeedClient } from "@likeminds.community/feed-js";

export const LMAppAwsKeys = {
  identityPoolId: LMFeedClient.getIdentityPoolId(),

  bucketName: LMFeedClient.getBucketId(),

  region: LMFeedClient.getRegion(),
} as const;
