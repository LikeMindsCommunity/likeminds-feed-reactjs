/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import {
  InitiateUserRequest,
  LMFeedClient,
} from "@likeminds.community/feed-js";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
// import { UserDetails } from "./hooks/useLMUserProvider";

import { LMCoreCallbacks } from "./shared/LMSDKCoreCallbacks";
import { LMFeedAnalytics } from "./shared/analytics";

const customEventClient = new LMFeedCustomEvents();

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

const LMCORECALLBACKS = new LMCoreCallbacks(
  (a: string, b: string) => {
    console.log(a, b);
  },
  () => {
    return {
      accessToken: "sadf",
      refreshToken: "adsf",
    };
  },
);
export function ReactApp() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userDetails, setUserDetails] = useState({
    accessToken: "",
    refreshToken: "",
    uuid: "",
    username: "",
    isGuest: false,
    apiKey: "",
    //   Add api key
  });

  const client = LMFeedClient.Builder()

    .setPlatformCode("rt")
    .setVersionCode(2)
    .build();

  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={client}
        customEventClient={customEventClient}
        userDetails={userDetails}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
        analyticsCallback={(event: string, details: Record<string, string>) => {
          console.log("fired");
          return;
        }}
      ></LMFeed>
    </div>
  );
}
