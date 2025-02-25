import { useEffect, useState } from "react";
import "./App.css";
import {
  LMSocialFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  initiateFeedClient,
} from "@likeminds.community/likeminds-feed-reactjs";

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
      setShowFeed(true);
    }
  }, []);

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
    <>
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMSocialFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={userDetails}
      ></LMSocialFeed>
    </>
  );
}

export default App;
