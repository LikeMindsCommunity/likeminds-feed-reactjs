import React, { useState } from "react";
import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
} from "@likeminds.community/likeminds-feed-reactjs";
import { LMFeedClient } from "@likeminds.community/feed-js";
import LoginScreen from "./LoginScreen";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [showFeed, setShowFeed] = useState<boolean>(false);
  function login() {
    if (accessToken.length && refreshToken.length) setShowFeed(true);
    else alert("Please provide the Refresh and Access Token");
  }
  const customEventClient = new LMFeedCustomEvents();
  if (!showFeed) {
    return (
      <LoginScreen
        accessToken={accessToken}
        refreshToken={refreshToken}
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
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
        accessToken={accessToken}
        refreshToken={refreshToken}
      ></LMFeed>
    </div>
  );
}

export default App;
