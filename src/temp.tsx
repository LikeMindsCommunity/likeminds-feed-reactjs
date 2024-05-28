/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import {
  InitiateUserRequest,
  LMFeedClient,
} from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
// import { UserDetails } from "./hooks/useLMUserProvider";

import { LMCoreCallbacks } from "./shared/LMSDKCoreCallbacks";
import { LMFeedAnalytics } from "./shared/analytics";

const customEventClient = new LMFeedCustomEvents();

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

// class LMSDKCallbackImpl implements LMSDKCallbacks{
//   setRefreshTokenExpired(callback: any): void {
//     throw new Error("Method not implemented.");
//   }
//   setAccessTokenExpiredAndRefreshed(callback: any): void {
//     throw new Error("Method not implemented.");
//   }
//   accessTokenExpiredAndRefreshed(accessToken: string, refreshToken: string): void {
//     lmCoreCallback.accessTokenExpiredAndRefreshed()
//   }
//   refreshTokenExpired(): { accessToken: string; refreshToken: string; } {
//     throw new Error("Method not implemented.");
//     //get API Key from LS
//     return
//   }

// }
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
    uuid: "sdefrgthyju",
    username: "asdf",
    isGuest: false,
    apiKey: "69edd43f-4a5e-4077-9c50-2b7aa740acce",
    //   Add api key
  });

  const client = LMFeedClient.Builder()
    // .setApiKey("d66cfee8-070a-47da-b705-d98cf812630f")
    .setPlatformCode("rt")
    .setVersionCode(2)
    .build();
  // useEffect(() => {
  //   localStorage.setItem("xApiKey", "69edd43f-4a5e-4077-9c50-2b7aa740acce");
  //   console.log(client);
  //   client
  //     .initiateUser(
  //       InitiateUserRequest.builder()
  //         .setApiKey("69edd43f-4a5e-4077-9c50-2b7aa740acce")
  //         .setUUID("new")
  //         .setUserName("new")
  //         .setIsGuest(false)
  //         .build(),
  //     )
  //     .then((res: any) => {
  //       console.log(res);
  //       setUserDetails((details) => {
  //         const newDetails = { ...details };
  //         newDetails.accessToken = res.data.accessToken;
  //         newDetails.refreshToken = res.data.refreshToken;
  //         return newDetails;
  //       });
  //     })
  //     .catch((e) => console.log(e));
  // }, []);
  // if (!userDetails.accessToken.length) {
  //   return null;
  // }
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
