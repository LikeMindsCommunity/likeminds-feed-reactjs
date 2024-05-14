import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
import { UserDetails } from "./hooks/useLMUserProvider";

const customEventClient = new LMFeedCustomEvents();

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);
const userDetails: UserDetails = {
  accessToken: undefined,
  refreshToken: undefined,
  uuid: undefined,
  username: undefined,
  isGuest: undefined,
  //   Add api key
};
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
