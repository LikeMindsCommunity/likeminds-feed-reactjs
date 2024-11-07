import { useState } from "react";
import {
  LMSocialFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  initiateFeedClient,
} from "./old_index";

function App() {
  const [userDetails, setUserDetails] = useState<{
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({
    uuid: "yash-test1",
    username: "yash-test1",
    isGuest: false, // Turn this flag to true in case you have a guest user
    apiKey: "500f73a0-0be6-40d2-a705-78c31861323c",
  });

  // Initiated LMFeedClient
  const lmFeedClient = initiateFeedClient();

  // Initiated LMFeedCustomEvents
  const customEventClient = new LMFeedCustomEvents();

  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMSocialFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={userDetails}
      ></LMSocialFeed>
    </div>
  );
}
export default App;
