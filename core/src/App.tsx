/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  LMCoreCallbacks,
  initiateFeedClient,
} from "./old_index";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [showFeed, setShowFeed] = useState<boolean>(false);

  const customEventClient = new LMFeedCustomEvents();

  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({});
  const lmFeedClient = initiateFeedClient();

  return (
    <>
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={{
          uuid: "James Joy",
          apiKey: "c142bc84-4c40-4412-ad09-c7e59b93a2ca",
          username: "James Joy",
        }}
        PostCreationCustomCallbacks={{
          postFeedCustomAction: async (store) => {
            const {
              defaultActions: { postFeed },
            } = store;
            // postFeed([
            //   {
            //     customData: "hello this is a custom data",
            //   },
            // ]);
            postFeed();
          },
        }}
      ></LMFeed>
    </>
  );
}

export default App;
