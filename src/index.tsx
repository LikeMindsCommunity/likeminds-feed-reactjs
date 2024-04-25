import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";

import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";

const customEventClient = new LMFeedCustomEvents();

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

export function ReactApp() {
  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        topicComponentClickCustomCallback={(store, e) => {
          console.log(store);
          console.log(e);
        }}
        postComponentClickCustomCallback={(store, e) => {
          console.log(store);
          console.log(e);
        }}
        memberComponentClickCustomCallback={(e) => {
          console.log(e);
        }}
        createPostComponentClickCustomCallback={(store, e) => {
          console.log(store);
          console.log(e);
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
