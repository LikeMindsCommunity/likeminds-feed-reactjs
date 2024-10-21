/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  LMCoreCallbacks,
  initiateFeedClient,
  LMFeedUniversalFeed,
} from "./old_index";
import { GetUserTopicsRequest } from "@likeminds.community/feed-js-beta";
function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [showFeed, setShowFeed] = useState<boolean>(false);
  function login() {
    if (accessToken.length && refreshToken.length) {
      setUserDetails((userDetails) => {
        userDetails.accessToken = accessToken;
        userDetails.refreshToken = refreshToken;

        return userDetails;
      });
      setShowFeed(true);
    } else if (uuid.length && apiKey.length) {
      setUserDetails((userDetails) => {
        userDetails.apiKey = apiKey;
        userDetails.username = username;
        userDetails.uuid = uuid;

        return userDetails;
      });
      setShowFeed(true);
    } else {
      alert(
        "Please provide either API key and UUID OR Access and Refresh Token",
      );
    }
  }
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

  const LMCORECALLBACKS = new LMCoreCallbacks(
    (a: string, b: string) => {
      console.log(
        "hello buddy how do u do from accessTokenRefreshedAndExpired",
      );
    },
    async () => {
      console.log("hello buddy how do u do from onRefreshToken expired");
      return {
        accessToken: "",
        refreshToken: "",
      };
    },
  );

  return (
    <>
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
        userDetails={{
          uuid: "James Joy",
          username: "James Joy",
          apiKey: "7d6374e0-9d07-4d85-9a8d-773ae8bbdd4e",
        }}
        CustomComponents={{
          CustomUniversalFeed: <CustomUniversalFeed />,
        }}
        PostCreationCustomCallbacks={{
          postFeedCustomAction: async (store) => {
            store.postCreationDataStore.setSelectedTopicIds([
              "asdfgb",
              "dsafg",
            ]);
            store.defaultActions.postFeed();
          },
        }}
      ></LMFeed>
    </>
  );
}

export default App;

function CustomUniversalFeed() {
  useEffect(() => {
    alert("Custom Alert");
  });
  return (
    <div>
      <LMFeedUniversalFeed />
    </div>
  );
}
