import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import "./assets/scss/styles.scss";

import LMFeed from "./components/LMFeed";
import LMFlatFeed from "./components/LMFlatFeed";
import { LM_APP_CONFIG } from "./shared/constants/app.constant";
import { LMLikeAction } from "./shared/actions";

function LMAppLayout() {
  function customCallbackforlike() {
    LMLikeAction();
    alert("this is the custom callback");
  }
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
      likeActionCall={customCallbackforlike}
    >
      <LMFlatFeed />
    </LMFeed>
  );
}

export default LMAppLayout;
