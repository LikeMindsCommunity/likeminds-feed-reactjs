/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  LMCoreCallbacks,
} from "likeminds-feed-reactjs-beta";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LoginScreen from "./LoginScreen";

function App() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [uuid, setUUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [showFeed, setShowFeed] = useState<boolean>(false);
  function login() {
    if (accessToken.length && refreshToken.length) {
      setUserDetails((userDetails) => {
        userDetails.accessToken = accessToken;
        userDetails.refreshToken = refreshToken;
        console.log(userDetails);
        return userDetails;
      });
      setShowFeed(true);
    } else if (uuid.length && apiKey.length) {
      setUserDetails((userDetails) => {
        userDetails.apiKey = apiKey;
        userDetails.username = username;
        userDetails.uuid = uuid;
        console.log(userDetails);
        return userDetails;
      });
      setShowFeed(true);
    } else {
      alert(
        "Please provide either API key and UUID OR Access and Refresh Token"
      );
    }
  }
  const customEventClient = new LMFeedCustomEvents();

  const [userDetails, setUserDetails] = useState<{
    accessToken?: string;
    refreshToken?: string;
    uuid?: string;
    username?: string;
    isGuest?: boolean;
    apiKey?: string;
  }>({});

  const LMCORECALLBACKS = new LMCoreCallbacks(
    (a: string, b: string) => {
      console.log("Running access token expired and refreshed");
      console.log(a);
      console.log(b);
      setUserDetails((userDetails) => {
        userDetails.accessToken = a;
        userDetails.refreshToken = b;
        return userDetails;
      });
    },
    async () => {
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", "69edd43f-4a5e-4077-9c50-2b7aa740acce");
      myHeaders.append("x-platform-code", "rt");
      myHeaders.append("x-version-code", "1");
      myHeaders.append("x-sdk-source", "feed");
      myHeaders.append("Content-Type", "application/json");

      interface RequestBody {
        user_name: string;
        user_unique_id: string;
        token_expiry_beta: number;
        rtm_token_expiry_beta: number;
      }

      const raw: RequestBody = {
        user_name: "GuestOP",
        user_unique_id: "123456789987654321",
        token_expiry_beta: 2,
        rtm_token_expiry_beta: 4,
      };

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://betaauth.likeminds.community/sdk/initiate",
          requestOptions
        );
        const result_1 = await response.json();
        console.log(result_1);
        return {
          accessToken: result_1.data.access_token,
          refreshToken: result_1.data.refresh_token,
        };
      } catch (error) {
        return {
          accessToken: "sadf",
          refreshToken: "adsf",
        };
      }
    }
  );

  async function proceedWithout() {
    // console.log("refresh triggered");
    // return {
    //   accessToken: "sadf",
    //   refreshToken: "adsf",
    // };
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "69edd43f-4a5e-4077-9c50-2b7aa740acce");
    myHeaders.append("x-platform-code", "rt");
    myHeaders.append("x-version-code", "1");
    myHeaders.append("x-sdk-source", "feed");
    myHeaders.append("Content-Type", "application/json");

    interface RequestBody {
      user_name: string;
      user_unique_id: string;
      token_expiry_beta: number;
      rtm_token_expiry_beta: number;
    }

    const raw: RequestBody = {
      user_name: "GuestOP",
      user_unique_id: "123456789987654321",
      token_expiry_beta: 2,
      rtm_token_expiry_beta: 4,
    };

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://betaauth.likeminds.community/sdk/initiate",
        requestOptions
      );
      const result_1 = await response.json();
      console.log(result_1);
      return {
        accessToken: result_1.data.access_token,
        refreshToken: result_1.data.refresh_token,
      };
    } catch (error) {
      return {
        accessToken: "sadf",
        refreshToken: "adsf",
      };
    }
  }

  if (!showFeed) {
    return (
      <LoginScreen
        accessToken={accessToken}
        refreshToken={refreshToken}
        setAccessToken={setAccessToken}
        setRefreshToken={setRefreshToken}
        apiKey={apiKey}
        setApiKey={setApiKey}
        username={username}
        uuid={uuid}
        setUUID={setUUID}
        setUsername={setUsername}
        login={login}
      />
    );
  }
  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={LMFeedClient.Builder()
          .setPlatformCode("rt")
          .setVersionCode(2)
          .build()}
        customEventClient={customEventClient}
        analyticsCallback={() => {
          console.log("callback fired");
        }}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
        userDetails={userDetails}
      ></LMFeed>
    </div>
  );
}

export default App;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
