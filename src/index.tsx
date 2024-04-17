import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";

import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
const customEventClient = new LMFeedCustomEvents();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <LMFeedNotificationHeader />
    <LMFeed
      client={LMFeedClient.Builder()
        .setPlatformCode("rt")
        .setVersionCode(2)
        .build()}
      customEventClient={customEventClient}
      accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiV29BQ2pEUHZDMkdUK3NEZXNRNmwreHl0LzBabHJmZFVUdFBIeEpqaXNwTHl3dFY5Y2tMM3pvMDIyUmw4QWhKZis1NHZSSjB3Q1hROTNaRVZCVU9jRU11Z09Nc256NXduMGg2ZDR1aFJLV1lrcExUSnZDZGpqNWEzOThyQ2prNVFRVUw1US9nc21OTWN6M2hvcVNJY1BRVkJ6b3FPNkJyOXF1aXhwdGJpWHNzRlNCVHRzL1hiVCtwSjRpRWRMYXRTTzNhTi9VTnM0am1JVGdzYzgzVElNaVRRblMxQzRtWHFLa01rbFM4UUNGWGNNRHR4TkNDeGFyYnkydmZhL2licStudnVBWmFDTm1mZjE3akEiLCJleHAiOjE3MTMzMTA3MDh9.DPO2Gyo55ZpBkODga6mk7dWNh5h4mG2plpmFlsu8GX0"
      refreshToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiT0g3RlE3YWIvWmlHU1NJb3k0WDdtNmZXQzliWVV2eWpmeVYrUENJdXlqOVJTUCtMY205SnU1MlhaWUtCbVMvQ1VUYkVPbUtJV0c5RDQzVVY0SHB5T3ExdmZWUTdya2V5N1U0bUNSRWcrQ1RGaUpUUklmTzlIRXJuSWFjK1BHY05wMms1bjFVbmRzcEE5VVkwZ2M3U0Zjb1A2ZkZBQ29obWJWcWR3bFNxSTVXcXVaMzJQNGtndmJIYXBuTWQyN3pSb1IvQ3o4Y25IeEZhRjMzK0R6RXBLeGZaUzE4MUFYbkEwaU9OWkZhUFA0UzU4NWJIQXAvanpNL0h1RjVsVUlMQnlkTnZabko2UU1aYnFqT2VoYXBVT3VicFBJZ1EzdFBablQzSENzcUgifQ.tLk9EOs6bGCfNrNzNyMZUP0BGhrgw5w7PLfsBXiCCvE"
    ></LMFeed>
  </>,
);
