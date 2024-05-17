import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";

// import { LMSDKCallbacks } from "@likeminds.community/feed-js-beta/dist/LMCallback";

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
      ></LMFeed>
    </div>
  );
}
