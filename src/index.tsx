import React from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
// import "./index.css";
console.log("asdf");
// import { LMFeed } from ".";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LMFeed
    client={LMFeedClient.Builder()
      .setPlatformCode("rt")
      .setVersionCode(2)
      .build()}
    accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNU5VRmRiREJ0NjhPenhyb0tZMFB4K2cwSU91U25xS1RxRE5vUmZxZnQ4QTZBeXlualNyUkRORm4vRWcxdG0vSmNxckd1WUIwc3ZySFNBM1Vyb1k4WFpYVXhBRWh2TlBnekZEejZnVWF1N2pOSkp3a3IzUDV4ZkNsOE1WcDZ2ZjlsWGhyeGVxTkE0SmM3b0R4azB0S3MzcWRxWUpMZDc5QzdnZjZiUDd3N0RkM2pVYUNOQ2d0Ums5aTJrcFFwekx0SmZydDFML3N2Z0thRWFuYklEZFd3L05lOWFBSEtRTUtjQ25xWEtjeGtaMlJSK0hoS0pLemlXYlBKK2ROOTl3K2JEeG5JRzhGV3VSczFBenpTMjRZcU5tQWF5YkxkNXRFL05OTTVFaz0ifQ.rDgichiJ2Z4ZxTBZv32l2lkx_FjD6Mra_EVLB2fYf7o"
    refreshToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiT0g3RlE3YWIvWmlHU1NJb3k0WDdtNmZXQzliWVV2eWpmeVYrUENJdXlqOVJTUCtMY205SnU1MlhaWUtCbVMvQ1VUYkVPbUtJV0c5RDQzVVY0SHB5T3ExdmZWUTdya2V5N1U0bUNSRWcrQ1RGaUpUUklmTzlIRXJuSWFjK1BHY05wMms1bjFVbmRzcEE5VVkwZ2M3U0Zjb1A2ZkZBQ29obWJWcWR3bFNxSTVXcXVaMzJQNGtndmJIYXBuTWQyN3pSb1IvQ3o4Y25IeEZhRjMzK0R6RXBLeGZaUzE4MUFYbkEwaU9OWkZhUFA0UzU4NWJIQXAvanpNL0h1RjVsVUlMQnlkTnZabko2UU1aYnFqT2VoYXBVT3VicFBJZ1EzdFBablQzSENzcUgifQ.tLk9EOs6bGCfNrNzNyMZUP0BGhrgw5w7PLfsBXiCCvE"
  ></LMFeed>,
);
