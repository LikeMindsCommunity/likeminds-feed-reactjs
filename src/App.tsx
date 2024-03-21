import { LMFeedClient } from "@likeminds.community/feed-js";
import "./assets/scss/styles.scss";
import "./App.css";
import LMFeed from "./components/LMFeed";

import { LM_APP_CONFIG } from "./shared/constants/lmAppConstant";
// import LMFeedUniversalFeed from "./components/LMFeedUniversalFeed";
// import LMFeedDetails from "./components/LMFeedDetails";
// import { HelmetProvider } from "react-helmet-async";
// import LMFeedUniversalFeed from "./components/LMFeedUniversalFeed";

function LMAppLayout() {
  const client = LMFeedClient.Builder()
    // .setApiKey(LM_APP_CONFIG.API_KEY)
    .setApiKey("539375f3-7b54-4600-b190-fd9efe7ceaf8")
    .setPlatformCode(LM_APP_CONFIG.PLATFORM_CODE)
    .setVersionCode(LM_APP_CONFIG.VERSION_CODE)
    .build();
  return <LMFeed userId="" username="" client={client}></LMFeed>;
}

export default LMAppLayout;
