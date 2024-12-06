/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropsWithChildren, useEffect } from "react";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import UserProviderContext from "../contexts/LMFeedUserProviderContext";
import useUserProvider, { UserDetails } from "../hooks/useLMUserProvider";
import {
  CustomAgentProviderContext,
  CustomAgentProviderInterface,
} from "../contexts/LMFeedCustomAgentProviderContext";
import { LMFeedCustomAppRoutes } from "../shared/types/customProps/routes";
import "../assets/scss/styles.scss";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { pdfjs } from "react-pdf";
import { useLMFeedGeneralContextProvider } from "../hooks/useLMFeedGeneralContextProvider";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import LMFeedListDataContextProvider from "./LMFeedDataContextProvider";
import { Snackbar } from "@mui/material";
import { AnalyticsCallback } from "../shared/types/analyticsCallback";
import { LMFeedAnalytics } from "../shared/analytics";
import {
  LMCoreCallbacks,
  LMSDKCallbacksImplementations,
} from "../shared/LMSDKCoreCallbacks";
import LMFeedPostCreationProgressBar from "./LMFeedPostCreationProgressBar";

export interface LMFeedProps<T> extends CustomAgentProviderInterface {
  client: T;
  showMember?: boolean;
  routes?: LMFeedCustomAppRoutes;
  userDetails: UserDetails;
  customEventClient: LMFeedCustomEvents;
  analyticsCallback?: AnalyticsCallback | undefined;
  LMFeedCoreCallbacks?: LMCoreCallbacks;
  allowThumbnail?: boolean;
}

function LMSocialFeed({
  LMFeedCoreCallbacks,
  userDetails,
  client,
  routes,
  customEventClient,
  analyticsCallback = (_event: string, _details: Record<string, string>) => {
    return;
  },
  LMPostHeaderStyles,
  LMFeedCustomIcons,
  CustomComponents,
  FeedListCustomActions,
  FeedPostDetailsCustomActions,
  GeneralCustomCallbacks,
  TopicsCustomCallbacks,
  RepliesCustomCallbacks,
  PostCreationCustomCallbacks,
  PollCreationCustomCallbacks,
  allowThumbnail = false,
  postComponentClickCustomCallback,
  createPostComponentClickCustomCallback,
  topicComponentClickCustomCallback,
  memberComponentClickCustomCallback,
  hintTextForAnonymous,
  isAnonymousPostAllowed,
}: PropsWithChildren<LMFeedProps<LMClient>>) {
  const { lmFeedUser, logoutUser, lmFeedUserCurrentCommunity } =
    useUserProvider(client, customEventClient, userDetails);
  const {
    showSnackbar,
    message,
    closeSnackbar,
    displaySnackbarMessage,
    openPostCreationProgressBar,
    setOpenPostCreationProgressBar,
  } = useLMFeedGeneralContextProvider();
  useEffect(() => {
    const workerRrl = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = workerRrl;
  }, []);
  useEffect(() => {
    if (LMFeedCoreCallbacks) {
      client.setLMSDKCallbacks(
        new LMSDKCallbacksImplementations(
          LMFeedCoreCallbacks,
          client,
          customEventClient,
        ),
      );
    }
  }, [LMFeedCoreCallbacks, client, customEventClient]);

  if (!lmFeedUser) {
    return null;
  }

  return (
    <div className="lm-wrapper">
      <GlobalClientProviderContext.Provider
        value={{
          lmFeedclient: client,
          customEventClient: customEventClient,
          lmfeedAnalyticsClient: new LMFeedAnalytics(analyticsCallback),
        }}
      >
        <CustomAgentProviderContext.Provider
          value={{
            LMPostHeaderStyles,
            LMFeedCustomIcons,
            CustomComponents,
            FeedListCustomActions,
            FeedPostDetailsCustomActions,
            GeneralCustomCallbacks,
            postComponentClickCustomCallback,
            topicComponentClickCustomCallback,
            createPostComponentClickCustomCallback,
            memberComponentClickCustomCallback,
            TopicsCustomCallbacks,
            RepliesCustomCallbacks,
            PostCreationCustomCallbacks,
            PollCreationCustomCallbacks,
            isAnonymousPostAllowed,
            hintTextForAnonymous,
          }}
        >
          <GeneralContext.Provider
            value={{
              message,
              showSnackbar,
              closeSnackbar,
              displaySnackbarMessage,
              routes,
              allowThumbnail,
              openPostCreationProgressBar,
              setOpenPostCreationProgressBar,
            }}
          >
            <UserProviderContext.Provider
              value={{
                currentUser: lmFeedUser,
                currentCommunity: lmFeedUserCurrentCommunity,
                logoutUser: logoutUser,
              }}
            >
              <LMFeedListDataContextProvider />
            </UserProviderContext.Provider>
          </GeneralContext.Provider>
        </CustomAgentProviderContext.Provider>
        <Snackbar
          open={showSnackbar}
          message={message}
          onClose={closeSnackbar}
          autoHideDuration={3000}
        />
        <LMFeedPostCreationProgressBar open={openPostCreationProgressBar} />
      </GlobalClientProviderContext.Provider>
    </div>
  );
}

export default LMSocialFeed;