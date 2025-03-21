import { useEffect, useState } from "react";
import "./App.css";
import {
  LMSocialFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  initiateFeedClient,
  LMCoreCallbacks,
} from "@likeminds.community/likeminds-feed-reactjs";

import LoginScreen from "./LoginScreen";
import CustomLMFeedCreatePostDialog from "./CustomCreatePostComponent";

function App() {
  const customEventClient = new LMFeedCustomEvents();
  const lmCoreCallbacks = new LMCoreCallbacks(
    (a, b) => {},
    () => {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
  );

  const lmFeedClient = initiateFeedClient();

  return (
    <>
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMSocialFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        userDetails={{
          apiKey: "e7608d57-dcf1-42cd-b320-3d98b1a40cf3",
          username: "testuser",
          uuid: "testuser",
        }}
        CustomComponents={{
          CustomCreatePostDialog: <CustomLMFeedCreatePostDialog />,
        }}
        PostCreationCustomCallbacks={{
          postFeedCustomAction: async (store) => {
            store.defaultActions.postFeed([
              {
                content: "Hello, World!",
                topicIds: ["1"],
                attachments: [],
                isAnonymous: false,
              },
            ]);
          },
        }}
        // userDetails={userDetails}
        LMFeedCoreCallbacks={lmCoreCallbacks}
      ></LMSocialFeed>
    </>
  );
}

export default App;
