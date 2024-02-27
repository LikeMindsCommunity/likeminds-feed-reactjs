import "./assets/scss/styles.scss";
import LMFeed from "./components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFlatFeed from "./components/LMFlatFeed";

function LMAppLayout() {
  return (
    <LMFeed
      client={LMFeedClient.Builder()
        .setApiKey("69edd43f-4a5e-4077-9c50-2b7aa740acce")
        .setPlatformCode("rt")
        .setVersionCode(2)
        .build()}
    >
      <LMFlatFeed />
    </LMFeed>
  );
}

export default LMAppLayout;
