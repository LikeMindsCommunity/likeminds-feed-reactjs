import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";

import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
import { feedListCustomActionCallback } from "./shared/types/cutomCallbacks/callbacks";
import { FeedListActionsAndDataStore } from "./shared/types/cutomCallbacks/dataProvider";
const customEventClient = new LMFeedCustomEvents();

const likePostCustomCallback: feedListCustomActionCallback = async (
  _store,
  // _id,
) => {
  console.log(_store);
  // const feedCopy = [..._store.feedListDataStore.feedList]
  // _store.defaultActions.pinPost(_id as string);
  // _store.feedListDataStore.setFeedList([]);

  _store.applicationGeneralsStore.generalDataStore.displaySnackbarMessage!(
    "hello",
  );
  // _store.defaultActions.pinPost(_id as string);
};
const customClickFunction = (
  arg1: FeedListActionsAndDataStore,
  e: React.MouseEvent<HTMLDivElement>,
) => {
  // lm-feed-post-wrapper-yzabc-6626163603a62c83c4e3d08a
  const clickedElementAttribute = (e.target as HTMLElement).getAttribute(
    "lm-feed-component-id",
  );
  console.log(clickedElementAttribute);
  const isPinIcon = clickedElementAttribute?.split("-")[4];
  console.log(isPinIcon);
  if (isPinIcon === "yzabc") {
    console.log("Target Element Clickejd");
  }
};
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <div className="lm-wrapper">
//     <LMFeedNotificationHeader customEventClient={customEventClient} />
//     <LMFeed
//       FeedPostDetailsCustomActions={{
//         likePostCustomAction: async (store, _argTwo) => {
//           console.log(_argTwo);
//           console.log(store);
//         },
//       }}
//       FeedListCustomActions={{
//         likePostCustomAction: likePostCustomCallback,
//       }}
//       client={LMFeedClient.Builder()
//         .setPlatformCode("rt")
//         .setVersionCode(2)
//         .build()}
//       customEventClient={customEventClient}
//       accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2oxa0I0aVVUSzhMUVl4QlZZU1IzOUJNaTB3SWVlUVBaOXBOYTEvcEsxaXl1TFh1ampuYWEvT2hTQzdjaS9RajNvMUU3L1JDdjZnVWRhM2tGbjZnQkNNdkZKWFNmd2tHb1ZPeTZPZStoYmlhT09tZHkrdmVabnViQ0NOVlNzc0ROTlBaOERmbE1wbEdFRnpuakUyKzV3ZFdGYS9hbXRvTWZUSWtRZ3lPRDRSODk3RTZ2ZmsycHJkcWNrd2VPb21QYmgvTzNBWjdaZ2YrSVNYUkMzWnlGYXFKSk5OM0hNVmh5TlpMcmFiSnptU09qTVVWK3l2aG9YcEpMMWhUNXpvcUk0RkdETlBpdmJwT25EdUsiLCJleHAiOjE3MTM0NDkxMzh9.eS2-aHp6xF12l0ZhzCjAqbtOcapfZppowsLny3iFYoA"
//       refreshToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiT0g3RlE3YWIvWmlHU1NJb3k0WDdtNmZXQzliWVV2eWpmeVYrUENJdXlqOVJTUCtMY205SnU1MlhaWUtCbVMvQ1VUYkVPbUtJV0c5RDQzVVY0SHB5T3ExdmZWUTdya2V5N1U0bUNSRWcrQ1RGaUpUUklmTzlIRXJuSWFjK1BHY05wMms1bjFVbmRzcEE5VVkwZ2M3U0Zjb1A2ZkZBQ29obWJWcWR3bFNxSTVXcXVaMzJQNGtndmJIYXBuTWQyN3pSb1IvQ3o4Y25IeEZhRjMzK0R6RXBLeGZaUzE4MUFYbkEwaU9OWkZhUFA0UzU4NWJIQXAvanpNL0h1RjVsVUlMQnlkTnZabko2UU1aYnFqT2VoYXBVT3VicFBJZ1EzdFBablQzSENzcUgifQ.tLk9EOs6bGCfNrNzNyMZUP0BGhrgw5w7PLfsBXiCCvE"
//     ></LMFeed>
//   </div>,
// );
ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

export function ReactApp() {
  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        // FeedPostDetailsCustomActions={{
        //   likePostCustomAction: async (store, _argTwo) => {
        //     console.log(_argTwo);
        //     console.log(store);
        //   },
        // }}

        postComponentClickCustomCallback={customClickFunction}
        FeedListCustomActions={{
          likePostCustomAction: likePostCustomCallback,
        }}
        client={LMFeedClient.Builder()
          .setPlatformCode("rt")
          .setVersionCode(2)
          .build()}
        customEventClient={customEventClient}
        accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2oxa0I0aVVUSzhMUVl4QlZZU1IzOUJNaTB3SWVlUVBaOXBOYTEvcEsxaXl1TFh1ampuYWEvT2hTQzdjaS9RajNvMUU3L1JDdjZnVWRhM2tGbjZnQkNNdkZKWFNmd2tHb1ZPeTZPZStoYmlhT09tZHkrdmVabnViQ0NOVlNzc0ROTlBaOERmbE1wbEdFRnpuakUyKzV3ZFdGYS9hbXRvTWZUSWtRZ3lPRDRSODk3RTZ2ZmsycHJkcWNrd2VPb21QYmgvTzNBWjdaZ2YrSVNYUkMzWnlGYXFKSk5OM0hNVmh5TlpMcmFiSnptU09qTVVWK3l2aG9YcEpMMWhUNXpvcUk0RkdETlBpdmJwT25EdUsiLCJleHAiOjE3MTM0NDkxMzh9.eS2-aHp6xF12l0ZhzCjAqbtOcapfZppowsLny3iFYoA"
        refreshToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiT0g3RlE3YWIvWmlHU1NJb3k0WDdtNmZXQzliWVV2eWpmeVYrUENJdXlqOVJTUCtMY205SnU1MlhaWUtCbVMvQ1VUYkVPbUtJV0c5RDQzVVY0SHB5T3ExdmZWUTdya2V5N1U0bUNSRWcrQ1RGaUpUUklmTzlIRXJuSWFjK1BHY05wMms1bjFVbmRzcEE5VVkwZ2M3U0Zjb1A2ZkZBQ29obWJWcWR3bFNxSTVXcXVaMzJQNGtndmJIYXBuTWQyN3pSb1IvQ3o4Y25IeEZhRjMzK0R6RXBLeGZaUzE4MUFYbkEwaU9OWkZhUFA0UzU4NWJIQXAvanpNL0h1RjVsVUlMQnlkTnZabko2UU1aYnFqT2VoYXBVT3VicFBJZ1EzdFBablQzSENzcUgifQ.tLk9EOs6bGCfNrNzNyMZUP0BGhrgw5w7PLfsBXiCCvE"
      ></LMFeed>
    </div>
  );
}
