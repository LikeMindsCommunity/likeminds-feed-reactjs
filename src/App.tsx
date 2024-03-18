import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import "./assets/scss/styles.scss";
import "./App.css";
import LMFeed from "./components/LMFeed";

import { LM_APP_CONFIG } from "./shared/constants/lmAppConstant";
// import LMFeedUniversalFeed from "./components/LMFeedUniversalFeed";

function LMAppLayout() {
  const client = LMFeedClient.Builder()
    .setApiKey(LM_APP_CONFIG.API_KEY)
    // .setApiKey("f24b9522-a612-4f1e-8551-ffce88a52c76")
    .setPlatformCode(LM_APP_CONFIG.PLATFORM_CODE)
    .setVersionCode(LM_APP_CONFIG.VERSION_CODE)
    .build();
  return (
    <LMFeed
      userId="testUser1"
      username="testUser1"
      topicBlocksWrapperStyles={{
        display: "flex",
        justifyContent: "flex-end",
      }}
      client={client}
      LMPostFooterStyles={{
        likesCountStyles: {
          color: "green",
        },
      }}
      LMPostTopicStyles={{
        topicStyles: {
          backgroundColor: "#E5F3F2",
          color: "#00897B",
        },
      }}
    ></LMFeed>
  );
}

export default LMAppLayout;
