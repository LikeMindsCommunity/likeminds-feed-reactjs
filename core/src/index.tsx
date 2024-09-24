/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { LMFeed } from "./old_index";

import { LMFeedNotificationHeader } from "./old_index";
import { LMFeedCustomEvents } from "./old_index";
// import { UserDetails } from "./hooks/useLMUserProvider";

import { LMCoreCallbacks } from "./shared/LMSDKCoreCallbacks";
import { initiateFeedClient } from "./old_index";

const customEventClient = new LMFeedCustomEvents();

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

export function ReactApp() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const client = initiateFeedClient();

  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={client}
        customEventClient={customEventClient}
        userDetails={
          {
            // uuid: "sdefrgthyju",
            // username: "asdf",
            // isGuest: false,
            // apiKey: "c142bc84-4c40-4412-ad09-c7e59b93a2ca",
          }
        }
      ></LMFeed>
    </div>
  );
}
