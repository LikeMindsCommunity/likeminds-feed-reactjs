/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  LMCoreCallbacks,
} from "likeminds-feed-reactjs-beta";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LoginScreen from "./LoginScreen";

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
        console.log(userDetails);
        return userDetails;
      });
      setShowFeed(true);
    } else if (uuid.length && apiKey.length) {
      setUserDetails((userDetails) => {
        userDetails.apiKey = apiKey;
        userDetails.username = username;
        userDetails.uuid = uuid;
        console.log(userDetails);
        return userDetails;
      });
      setShowFeed(true);
    } else {
      alert(
        "Please provide either API key and UUID OR Access and Refresh Token"
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
  useEffect(() => {
    console.log("Things updated");
  });
  const LMCORECALLBACKS = new LMCoreCallbacks(
    (a: string, b: string) => {
      console.log(a, b);
    },
    () => {
      return {
        accessToken: "sadf",
        refreshToken: "adsf",
      };
    }
  );

  if (!showFeed) {
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
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={LMFeedClient.Builder()
          .setPlatformCode("rt")
          .setVersionCode(2)
          .build()}
        customEventClient={customEventClient}
        analyticsCallback={() => {
          console.log("callback fired");
        }}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
        userDetails={userDetails}
      ></LMFeed>
    </div>
  );
}

export default App;
