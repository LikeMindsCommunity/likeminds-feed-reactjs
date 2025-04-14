import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  LMSocialFeed,
  LMFeedNotificationHeader,
  LMFeedUniversalFeed,
  LMFeedModerationScreen,
  LMFeedCustomEvents,
  initiateFeedClient,
  LMCoreCallbacks,
  LMFeedCustomActionEvents,
  LMFeedCurrentUserState,
} from "@likeminds.community/likeminds-feed-reactjs-beta";

import LoginScreen from "./LoginScreen";
import SideNavbar from "./SideNavbar";
import DrawerList from "./DrawerList";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [noShowScreen, setNoShowScreen] = useState<boolean>(true);
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(false);
  const [isCM, setIsCM] = useState(
    JSON.parse(localStorage.getItem("LOCAL_USER") || "{}")?.state ===
      LMFeedCurrentUserState.CM || false
  );

  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.CURRENT_USER_CM,
      (e: Event) => {
        const id = (e as CustomEvent).detail.isCM;
        setIsCM(id);
      }
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.CURRENT_USER_CM);
  });

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
  const lmCoreCallbacks = new LMCoreCallbacks(
    (a, b) => {},
    () => {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
  );
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
    <Router>
      <DrawerList />
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <div className="lm-wrapper">
        <SideNavbar customEventClient={customEventClient} />
        <LMSocialFeed
          client={lmFeedClient}
          customEventClient={customEventClient}
          userDetails={userDetails}
          LMFeedCoreCallbacks={lmCoreCallbacks}
        >
          <Routes>
            {isCM && (
              <Route path="/moderation" element={<LMFeedModerationScreen />} />
            )}
            <Route path="/" element={<LMFeedUniversalFeed />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LMSocialFeed>
      </div>
    </Router>
  );
}

export default App;
