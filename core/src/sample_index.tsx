// /* eslint-disable @typescript-eslint/no-unused-vars */
// // /* eslint-disable @typescript-eslint/no-unused-vars */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import React, { useContext, useEffect, useState } from "react";
// // import ReactDOM from "react-dom/client";
// // import LMFeed from "./components/LMFeed";
// // import { LMFeedClient } from "@likeminds.community/feed-js";
// // import {
// //   FeedPostContext,
// //   LMCoreCallbacks,
// //   LMFeedCustomEvents,
// //   LMFeedNotificationHeader,
// // } from "./main_index";
// // import { LMCreatePostInitiateViewProps } from "./shared/types/customProps/customComponentsProps";

// // const customEventClient = new LMFeedCustomEvents();

// // ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);

// // const LMCORECALLBACKS = new LMCoreCallbacks(
// //   (a: string, b: string) => {
// //     console.log(a, b);
// //   },
// //   () => {
// //     return {
// //       accessToken: "sadf",
// //       refreshToken: "adsf",
// //     };
// //   },
// // );
// // export function ReactApp() {
// //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
// //   const [userDetails, setUserDetails] = useState({
// //     accessToken: "",
// //     refreshToken: "",
// //     uuid: "",
// //     username: "",
// //     isGuest: false,
// //     apiKey: "",
// //     //   Add api key
// //   });

// //   const client = LMFeedClient.Builder()

// //     .setPlatformCode("rt")
// //     .setVersionCode(2)
// //     .build();

// //   return (
// //     <div className="lm-wrapper">
// //       <LMFeedNotificationHeader customEventClient={customEventClient} />
// //       <LMFeed
// //         client={client}
// //         customEventClient={customEventClient}
// //         userDetails={userDetails}
// //         LMFeedCoreCallbacks={LMCORECALLBACKS}
// //         PostCreationCustomCallbacks={{
// //           postFeedCustomAction: async (store) => {
// //             const { defaultActions } = store;
// //             defaultActions.postFeed([
// //               {
// //                 enimen: "fat shady",
// //               },
// //             ]);
// //           },
// //         }}
// //         analyticsCallback={(event: string, details: Record<string, string>) => {
// //           console.log("fired");
// //           return;
// //         }}
// //         CustomComponents={{
// //           // CustomWidgetPostView: ,
// //           CustomPostView: <CustomPostView />,
// //         }}
// //       ></LMFeed>
// //     </div>
// //   );
// // }
// // const CustomPostViewA = ({
// //   setOpenCreatePostDialog,
// //   changeMediaUploadMode,
// // }: LMCreatePostInitiateViewProps) => {
// //   return <div className="lm-feed-wrapper__card lm-mb-2">asasad</div>;
// // };

// // const CustomPostView = () => {
// //   const { post } = useContext(FeedPostContext);
// //   return <div className="lm-feed-wrapper__card lm-mb-2">{post?.Id}</div>;
// // };
// import { useState } from "react";

// import {
//   LMFeed,
//   LMFeedNotificationHeader,
//   LMFeedCustomEvents,
// } from ".";
// import { LMFeedClient } from "@likeminds.community/feed-js";
// import ReactDOM from "react-dom/client";

// function ReactApp() {
//   const [userDetails, setUserDetails] = useState<{
//     uuid?: string;
//     username?: string;
//     isGuest?: boolean;
//     apiKey?: string;
//   }>({
//     uuid: "HELLO_USER",
//     username: "HELLO_USER",
//     isGuest: false, // Turn this flag to true in case you have a guest user
//     apiKey: "60a25588-837b-4e4f-be54-5ff0cfceb6e0",
//   });

//   // Initiated LMFeedClient
//   const lmFeedClient = LMFeedClient.Builder()
//     .setPlatformCode("rt")
//     .setVersionCode(2)
//     .build();

//   // Initiated LMFeedCustomEvents
//   const customEventClient = new LMFeedCustomEvents();

//   return (
//     <div className="lm-wrapper">
//       <LMFeedNotificationHeader customEventClient={customEventClient} />
//       <LMFeed
//         client={lmFeedClient}
//         customEventClient={customEventClient}
//         userDetails={userDetails}
//       ></LMFeed>
//     </div>
//   );
// }
// ReactDOM.createRoot(document.getElementById("root")!).render(<ReactApp />);
