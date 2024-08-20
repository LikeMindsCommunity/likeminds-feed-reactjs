// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom/client";
// import LMFeed from "./components/LMFeed";
// import {
//   InitiateUserRequest,
//   LMFeedClient,
// } from "@likeminds.community/feed-js";
// import LMFeedNotificationHeader from "./shared/components/LMFeedNotificationHeader";
// import { LMFeedCustomEvents } from "./shared/customEvents";
// // import { UserDetails } from "./hooks/useLMUserProvider";

// import { LMCoreCallbacks } from "./shared/LMSDKCoreCallbacks";

// const customEventClient = new LMFeedCustomEvents();

// ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

// export function ReactApp() {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [userDetails, setUserDetails] = useState({
//     accessToken:
//       "",
//     refreshToken:
//       "",
//     // accessToken: "",
//     // refreshToken: "",
//     uuid: "sdefrgthyju",
//     username: "asdf",
//     isGuest: false,
//     apiKey: "",
//     //   Add api key
//   });
//   const LMCORECALLBACKS = new LMCoreCallbacks(
//     (a: string, b: string) => {
//       console.log("Running access token expired and refreshed");
//       console.log(a);
//       console.log(b);
//       setUserDetails((userDetails) => {
//         userDetails.accessToken = a;
//         userDetails.refreshToken = b;
//         return userDetails;
//       });
//     },
//     async () => {
//       console.log("refresh triggered");
//       return {
//         accessToken: "sadf",
//         refreshToken: "adsf",
//       };
//       // const myHeaders = new Headers();
//       // myHeaders.append("x-api-key", "");
//       // myHeaders.append("x-platform-code", "rt");
//       // myHeaders.append("x-version-code", "1");
//       // myHeaders.append("x-sdk-source", "feed");
//       // myHeaders.append("Content-Type", "application/json");

//       // interface RequestBody {
//       //   user_name: string;
//       //   user_unique_id: string;
//       //   token_expiry_beta: number;
//       //   rtm_token_expiry_beta: number;
//       // }

//       // const raw: RequestBody = {
//       //   user_name: "GuestOP",
//       //   user_unique_id: "123456789987654321",
//       //   token_expiry_beta: 2,
//       //   rtm_token_expiry_beta: 4,
//       // };

//       // const requestOptions: RequestInit = {
//       //   method: "POST",
//       //   headers: myHeaders,
//       //   body: JSON.stringify(raw),
//       //   redirect: "follow",
//       // };

//       // try {
//       //   const response = await fetch(
//       //     "https://betaauth.likeminds.community/sdk/initiate",
//       //     requestOptions,
//       //   );
//       //   const result_1 = await response.json();
//       //   console.log(result_1);
//       //   return {
//       //     accessToken: result_1.data.access_token,
//       //     refreshToken: result_1.data.refresh_token,
//       //   };
//       // } catch (error) {
//       //   return {
//       //     accessToken: "sadf",
//       //     refreshToken: "adsf",
//       //   };
//       // }
//     },
//   );
//   const client = LMFeedClient.Builder()
//     // .setApiKey("d66cfee8-070a-47da-b705-d98cf812630f")
//     .setPlatformCode("rt")
//     .setVersionCode(2)
//     .build();
//   // useEffect(() => {
//   //   localStorage.setItem("xApiKey", "");
//   //   console.log(client);
//   //   client
//   //     .initiateUser(
//   //       InitiateUserRequest.builder()
//   //         .setApiKey("")
//   //         .setUUID("new")
//   //         .setUserName("new")
//   //         .setIsGuest(false)
//   //         .build(),
//   //     )
//   //     .then((res: any) => {
//   //       console.log(res);
//   //       setUserDetails((details) => {
//   //         const newDetails = { ...details };
//   //         newDetails.accessToken = res.data.accessToken;
//   //         newDetails.refreshToken = res.data.refreshToken;
//   //         return newDetails;
//   //       });
//   //     })
//   //     .catch((e) => console.log(e));
//   // }, []);
//   // if (!userDetails?.accessToken.length) {
//   //   return null;
//   // }
//   const yourAnalyticsCallbackFunction = () => {
//     // Your analytics callback function logic here
//   };

//   return (
//     <div className="lm-wrapper">
//       <LMFeedNotificationHeader customEventClient={customEventClient} />
//       <LMFeed
//         client={client}
//         customEventClient={customEventClient}
//         userDetails={userDetails}
//         LMFeedCoreCallbacks={LMCORECALLBACKS}
//         analyticsCallback={yourAnalyticsCallbackFunction}
//       ></LMFeed>
//     </div>
//   );
// }
