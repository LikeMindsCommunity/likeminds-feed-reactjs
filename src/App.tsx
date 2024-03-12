import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import "./assets/scss/styles.scss";
import "./App.css";
import LMFeed from "./components/LMFeed";

import { LM_APP_CONFIG } from "./shared/constants/lmAppConstant";

function LMAppLayout() {
  const client = LMFeedClient.Builder()
    .setApiKey(LM_APP_CONFIG.API_KEY)
    .setPlatformCode(LM_APP_CONFIG.PLATFORM_CODE)
    .setVersionCode(LM_APP_CONFIG.VERSION_CODE)
    .build();
  return (
    <LMFeed
      topicBlocksWrapperStyles={{
        display: "flex",
        justifyContent: "flex-end",
      }}
      client={client}
      LMPostFooterStyles={{
        likesCountStyles: {
          color: "green",
        },
        likeButtonCustom: () => <></>,
      }}
    ></LMFeed>
  );
}

export default LMAppLayout;
