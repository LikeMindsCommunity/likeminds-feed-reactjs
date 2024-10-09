/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
// import "./App.css";
import {
  LMSocialFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  LMCoreCallbacks,
  initiateFeedClient,
  LMQNAFeed,
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
      <LMQNAFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={{
          uuid: "sdefrgthyju",
          username: "asdf",
          isGuest: false,
          apiKey: "c142bc84-4c40-4412-ad09-c7e59b93a2ca",
        }}
      ></LMQNAFeed>
      {/* <LMSocialFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={{
          uuid: "sdefrgthyju",
          username: "asdf",
          isGuest: false,
          apiKey: "c142bc84-4c40-4412-ad09-c7e59b93a2ca",
        }}
      ></LMSocialFeed> */}
    </>
  );
}

export default App;
