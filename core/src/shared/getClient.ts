import { LMFeedClient } from "@likeminds.community/feed-js-beta";

export function initiateFeedClient() {
  const lmFeedClient = LMFeedClient.Builder()
    .setPlatformCode("rt")
    .setVersionCode(11)
    .build();
  return lmFeedClient;
}
