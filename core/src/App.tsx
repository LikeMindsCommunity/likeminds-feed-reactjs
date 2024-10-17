/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import {
  LMFeed,
  LMFeedNotificationHeader,
  LMFeedCustomEvents,
  LMCoreCallbacks,
  initiateFeedClient,
} from "./old_index";

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

        return userDetails;
      });
      setShowFeed(true);
    } else if (uuid.length && apiKey.length) {
      setUserDetails((userDetails) => {
        userDetails.apiKey = apiKey;
        userDetails.username = username;
        userDetails.uuid = uuid;

        return userDetails;
      });
      setShowFeed(true);
    } else {
      alert(
        "Please provide either API key and UUID OR Access and Refresh Token",
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
  const lmFeedClient = initiateFeedClient();
  const LMCORECALLBACKS = new LMCoreCallbacks(
    (a: string, b: string) => {
      setUserDetails((userDetails) => {
        userDetails.accessToken = a;
        userDetails.refreshToken = b;
        return userDetails;
      });
    },
    async () => {
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", "");
      myHeaders.append("x-platform-code", "rt");
      myHeaders.append("x-version-code", "1");
      myHeaders.append("x-sdk-source", "feed");
      myHeaders.append("Content-Type", "application/json");

      interface RequestBody {
        user_name: string;
        user_unique_id: string;
      }

      const requestBody: RequestBody = {
        user_name: "",
        user_unique_id: "",
      };

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://auth.likeminds.community/sdk/initiate",
          requestOptions,
        );
        const result_1 = await response.json();

        return {
          accessToken: result_1.data.access_token,
          refreshToken: result_1.data.refresh_token,
        };
      } catch (error) {
        console.log(error);
        alert(`Error occoured: ${error}`);
        return {
          accessToken: "",
          refreshToken: "",
        };
      }
    },
  );

  async function proceedWithout() {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "");
    myHeaders.append("x-platform-code", "rt");
    myHeaders.append("x-version-code", "9");
    myHeaders.append("x-sdk-source", "feed");
    myHeaders.append("Content-Type", "application/json");

    interface RequestBody {
      user_name: string;
      user_unique_id: string;
    }

    const requestBody: RequestBody = {
      user_name: "",
      user_unique_id: "",
    };

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(requestBody),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://auth.likeminds.community/sdk/initiate",
        requestOptions,
      );
      const result_1 = await response.json();

      return {
        accessToken: result_1.data.access_token,
        refreshToken: result_1.data.refresh_token,
      };
    } catch (error) {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
  }

  return (
    <>
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={lmFeedClient}
        customEventClient={customEventClient}
        LMFeedCoreCallbacks={LMCORECALLBACKS}
        userDetails={{
          uuid: "James Joy",
          username: "James Joy",
          apiKey: "b1f10c5c-778c-4a07-b4ae-bd57d3d54da9",
        }}
      ></LMFeed>
    </>
  );
}

export default App;
