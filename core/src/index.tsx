/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import LMFeed from "./components/LMFeed";
import {
  InitiateUserRequest,
  LMFeedClient,
} from "@likeminds.community/feed-js-beta";
import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
import { LMFeedCustomEvents } from "./shared/customEvents";
// import { UserDetails } from "./hooks/useLMUserProvider";

import { LMCoreCallbacks } from "./shared/LMSDKCoreCallbacks";

const customEventClient = new LMFeedCustomEvents();

export function ReactApp() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userDetails, setUserDetails] = useState({
    // accessToken:
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHdHeU01N0Z6Uy9EMkJ6U25YSlk4WXpUeWtnQmpUelVYRlhSekNQblpVcWN0TTEraEV5ZnBkeXpPbUpkL0szR0JyeHdXeU1sNVM0SHgxT25xdDZNN216WGFCV1NQT3orWHJTQzN2Y25yYlFkRW9wQVVhZytiUnp5WkN6eWZFUFdHOUNUYzBOT3FiWm5jcGtESmpCblNvd0JrV2t6VGVlQkgwMTlsQmJob0JmdUlncDBEcXF5UStZRDlrMjBIZWVqRWxPRmpOVGE2cjM0U2tmOVUzU0ZUL3dmZ29qYUxSVEtQRHNYaE9LY1lBc2JQZ1BYeFZ2c3Zab0Y0aThpS3BDWGRselNYNm5kVkI5a2ZKbHEiLCJleHAiOjE3MTc1NzI2NjB9.3pcXB5RppnSDttVZcwJyLrmDz2XFLycd_XQVOxPGR1U",
    // refreshToken:
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiWFVGZ3p4SGpBRGVsNU9BWFBYTHYrK3FSOUtSRWRXSnRsTmhobzlHaGFSMUlSUXZQMkFEQnM3NkhhWWQ4S1I0TEp4OEpzbUg2UlluTEhqdG1zRkxXOFZxbGYrOVdZb0tYMHBuMklRQmt5YmxLRWNmOU8wMy9WbkJvek43cXpZR3VKdGVpbnpSNEpMR2ZIOUFoanZsNUd6MFV0cVFjNWs3WmxMTFErbi9Ua0p3cFVtWW9vcmtnWDJoV3dNZ1FEMUFIY1RCekN4K3BRVFh6Q0wyNG1EbldRdFJEbVhEWDdvSmw5MGVWZW1JQmNxeEpXVFYyTjh2ckljbDdPeHpLUm83MFBRR09yd1Y3VjdKS3c5Ykh6QT09IiwiZXhwIjoxNzE3NTcyNzgwfQ.LcI8Xp3YPXMGuCU2M0pO1vTRHIT5U2THFOlFw6cwGdc",
    // accessToken: "",
    // refreshToken: "",
    uuid: "feedthumbid",
    username: "feed user",
    isGuest: false,
    apiKey: "d4356d31-306e-406d-aa4a-cd49f1b88f19",
    //   Add api key
  });

  const client = LMFeedClient.Builder()
    // .setApiKey("d66cfee8-070a-47da-b705-d98cf812630f")
    .setPlatformCode("rt")
    .setVersionCode(2)
    .build();
  // useEffect(() => {
  //   localStorage.setItem("xApiKey", "69edd43f-4a5e-4077-9c50-2b7aa740acce");
  //   console.log(client);
  //   client
  //     .initiateUser(
  //       InitiateUserRequest.builder()
  //         .setApiKey("69edd43f-4a5e-4077-9c50-2b7aa740acce")
  //         .setUUID("new")
  //         .setUserName("new")
  //         .setIsGuest(false)
  //         .build(),
  //     )
  //     .then((res: any) => {
  //       console.log(res);
  //       setUserDetails((details) => {
  //         const newDetails = { ...details };
  //         newDetails.accessToken = res.data.accessToken;
  //         newDetails.refreshToken = res.data.refreshToken;
  //         return newDetails;
  //       });
  //     })
  //     .catch((e) => console.log(e));
  // }, []);
  // if (!userDetails?.accessToken.length) {
  //   return null;
  // }
  const yourAnalyticsCallbackFunction = () => {
    // Your analytics callback function logic here
  };

  return (
    <div className="lm-wrapper">
      <LMFeedNotificationHeader customEventClient={customEventClient} />
      <LMFeed
        client={client}
        customEventClient={customEventClient}
        userDetails={userDetails}
        // LMFeedCoreCallbacks={LMCORECALLBACKS}
        analyticsCallback={yourAnalyticsCallbackFunction}
      ></LMFeed>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);
