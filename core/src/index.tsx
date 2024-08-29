/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  initiateFeedClient,
} from "./old_index";

import ReactDOM from "react-dom/client";

function ReactApp() {
  const [userDetails, setUserDetails] = useState<{
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({
    uuid: "HELLO_USER",
    username: "HELLO_USER",
    isGuest: false, // Turn this flag to true in case you have a guest user
    apiKey: "c142bc84-4c40-4412-ad09-c7e59b93a2ca",
  });

  const lmFeedClient = initiateFeedClient();

  // Initiated LMFeedCustomEvents
  const customEventClient = new LMFeedCustomEvents();

  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={userDetails}
      ></LMFeed>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);
