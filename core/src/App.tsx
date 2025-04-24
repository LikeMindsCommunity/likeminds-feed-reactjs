import { useState } from "react";
import {
  LMSocialFeed,
  LMFeedNotificationHeader,
  LMFeedUniversalFeed,
  LMFeedModerationScreen,
  LMFeedCustomEvents,
  initiateFeedClient,
  LMCoreCallbacks,
} from "./old_index";

import SideNavbar from "./SideNavbar";
import DrawerList from "./DrawerList";
import "./App.css";
// import WarningIcon from "./warning-circle-dashboard.svg";

function App() {
  const [userDetails] = useState<{
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({
    uuid: "1e5af4c4-b4a6-4f88-a71d-b82589e65003",
    username: "yash-test1",
    isGuest: false, // Turn this flag to true in case you have a guest user
    apiKey: "d3e431f9-8c92-4c57-b226-a413a5d8b6eb",
    // apiKey: "500f73a0-0be6-40d2-a705-78c31861323c",
  });

  // Initiated LMFeedClient
  const lmFeedClient = initiateFeedClient();

  // Initiated LMFeedCustomEvents
  const customEventClient = new LMFeedCustomEvents();
  const lmCoreCallbacks = new LMCoreCallbacks(
    () => {},
    () => {
      return {
        accessToken: "",
        refreshToken: "",
      };
    },
  );



  const isModerationRoute = window.location.pathname === "/moderation";
  return (
    <>
      <DrawerList />
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <div className="lm-wrapper">
        <SideNavbar />
        <LMSocialFeed
          client={lmFeedClient}
          customEventClient={customEventClient}
          userDetails={userDetails}
          LMFeedCoreCallbacks={lmCoreCallbacks}
        >
          {isModerationRoute ? (
            <LMFeedModerationScreen />
          ) : (
            <LMFeedUniversalFeed />
          )}
        </LMSocialFeed>
      </div>
    </>
  );
}
export default App;
