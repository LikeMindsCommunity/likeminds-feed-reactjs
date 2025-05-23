import { useEffect, useState } from "react";
import "./App.css";
import {
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  initiateFeedClient,
  LMQNAFeed,
} from "@likeminds.community/likeminds-feed-reactjs";

import LoginScreen from "./LoginScreen";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [noShowScreen, setNoShowScreen] = useState<boolean>(true);
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(false);
  function login() {
    if (accessToken.length && refreshToken.length) {
      setUserDetails((userDetails) => {
        userDetails.accessToken = accessToken;
        userDetails.refreshToken = refreshToken;

        return userDetails;
      });
      setShowLoginScreen(false);
    } else if (uuid.length && apiKey.length) {
      setUserDetails((userDetails) => {
        userDetails.apiKey = apiKey;
        userDetails.username = username;
        userDetails.uuid = uuid;

        return userDetails;
      });
      setShowLoginScreen(false);
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
  const lmFeedClient = initiateFeedClient();

  useEffect(() => {
    const getLocalUser = localStorage.getItem("LOCAL_USER");
    if (getLocalUser) {
      const user = JSON.parse(getLocalUser);
      const { uuid } = user.sdkClientInfo;
      const { name } = user;
      const apiKey = localStorage.getItem("LOCAL_API_KEY");
      const details = {
        uuid,
        username: name,
        apiKey: apiKey || "",
        isGuest: false,
      };
      setUserDetails(details);
      setNoShowScreen(false);
    } else {
      setNoShowScreen(false);
      setShowLoginScreen(true);
    }
  }, []);

  if (noShowScreen) {
    return null;
  }

  if (showLoginScreen) {
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
      <LMQNAFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={userDetails}
        postComponentClickCustomCallback={(store, eventObject) => {
          const target = eventObject.target as EventTarget & Element;
          if (!target) {
            return;
          }
          const className = target.className;
          if (className.includes("lm-feed-wrapper__card__body__heading")) {
            const lmFeedComponentId = eventObject.currentTarget.getAttribute(
              "lm-feed-component-id"
            );
            const lmFeedComponentIdSplitArr =
              lmFeedComponentId?.split("-") || [];
            const arrLength = lmFeedComponentIdSplitArr?.length || 0;
            const postId = lmFeedComponentIdSplitArr[arrLength - 1];
            const currentURL = window.location.href;
            const params = new URL(currentURL).searchParams;
            if (!params.has("id")) {
              window.location.search = `id=${postId}`;
            }
          }
        }}
      ></LMQNAFeed>
    </>
  );
}

export default App;
