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
import LoginScreen from "./LoginScreen";
// import { GetUserTopicsRequest } from "@likeminds.community/feed-js-beta";
function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [counter, setCounter] = useState<number>(1);
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
  if (!showFeed && !localStorage.getItem("LOCAL_USER")) {
    return (
      <LoginScreen
        accessToken={accessToken}
        refreshToken={refreshToken}
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        apiKey={apiKey}
        setApiKey={setApiKey}
        username={username}
        uuid={uuid}
        setUUID={setUUID}
        setUsername={setUsername}
        login={login}
      />
    );
  }

  return (
    <>
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
        userDetails={{
          apiKey: "b1f10c5c-778c-4a07-b4ae-bd57d3d54da9",
          username: "user_name 2",
          uuid: "user_unique_id 2",
        }}
        isAnonymousPostAllowed
        PostCreationCustomCallbacks={{
          editPostCustomAction: async (store) => {
            const { defaultActions } = store;
            defaultActions.editPost([{ key: counter }]);
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
