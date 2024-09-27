import { LMFeedClient } from "@likeminds.community/feed-js-beta";

export function initiateFeedClient() {
  const lmFeedClient = LMFeedClient.Builder()
    .setPlatformCode("rt")
    .setVersionCode(13)
    .build();
  return lmFeedClient;
}
