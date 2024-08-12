/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import {
  FeedPostContext,
  LMCoreCallbacks,
  LMFeedCustomEvents,
  LMFeedNotificationHeader,
} from "./main_index";

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
    uuid: "Hello_user",
    username: "Hello_user",
    isGuest: false,
    apiKey: "6b11d5f6-19fc-48aa-9140-0f59c88b0d0a",
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
        PostCreationCustomCallbacks={{
          postFeedCustomAction: async (store) => {
            const { defaultActions } = store;
            defaultActions.postFeed();
          },
        }}
        analyticsCallback={(event: string, details: Record<string, string>) => {
          console.log("fired");
          return;
        }}
        // CustomComponents={{
        //   CustomPostView: <CustomPostView />,
        // }}
      ></LMFeed>
    </div>
  );
}

const CustomPostView = () => {
  const { post } = useContext(FeedPostContext);
  return <p>{post?.Id}</p>;
};
