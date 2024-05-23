import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
import { UserDetails } from "./hooks/useLMUserProvider";

import { LMCoreCallbacks } from "./shared/LMSDKCoreCallbacks";

const customEventClient = new LMFeedCustomEvents();

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);
const userDetails: UserDetails = {
  accessToken: undefined,
  refreshToken: undefined,
  uuid: undefined,
  username: undefined,
  isGuest: undefined,
  apiKey: undefined,
  //   Add api key
};

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
  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={LMFeedClient.Builder()
          .setPlatformCode("rt")
          .setVersionCode(2)
          .build()}
        customEventClient={customEventClient}
        userDetails={userDetails}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
      ></LMFeed>
    </div>
  );
}
