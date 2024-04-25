import { PropsWithChildren, useEffect } from "react";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import UserProviderContext from "../contexts/LMFeedUserProviderContext";
import useUserProvider from "../hooks/useLMUserProvider";
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
import { BrowserRouter } from "react-router-dom";

export interface LMFeedProps<T> extends CustomAgentProviderInterface {
  client: T;
  showMember?: boolean;
  routes?: LMFeedCustomAppRoutes;
  useParentRouter?: boolean;
  accessToken: string;
  refreshToken: string;
  customEventClient: LMFeedCustomEvents;
}

function LMFeed({
  accessToken,
  refreshToken,
  client,
  likeActionCall,

  LMPostHeaderStyles,
  LMFeedCustomIcons: LMPostFooterStyles,

  routes,

  CustomComponents,

  useParentRouter = false,
  customEventClient,
  FeedListCustomActions,
  FeedPostDetailsCustomActions,
  GeneralCustomCallbacks,
  postComponentClickCustomCallback,
}: PropsWithChildren<LMFeedProps<LMClient>>) {
  const { lmFeedUser, logoutUser, lmFeedUserCurrentCommunity } =
    useUserProvider(accessToken, refreshToken, client, customEventClient);
  const { showSnackbar, message, closeSnackbar, displaySnackbarMessage } =
    useLMFeedGeneralContextProvider();
  useEffect(() => {
    const workerRrl = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = workerRrl;
  }, []);
  if (!lmFeedUser) {
    return null;
  }

  return (
    <GlobalClientProviderContext.Provider
      value={{
        lmFeedclient: client,
        customEventClient: customEventClient,
      }}
    >
      <CustomAgentProviderContext.Provider
        value={{
          likeActionCall: likeActionCall,

          LMPostHeaderStyles,
          LMFeedCustomIcons: LMPostFooterStyles,

          CustomComponents,

          FeedListCustomActions,
          FeedPostDetailsCustomActions,
          GeneralCustomCallbacks,
          postComponentClickCustomCallback,
        }}
      >
        <GeneralContext.Provider
          value={{
            message,
            showSnackbar,
            closeSnackbar,
            displaySnackbarMessage,
            useParentRouter,
            routes,
          }}
        >
          <UserProviderContext.Provider
            value={{
              currentUser: lmFeedUser,
              currentCommunity: lmFeedUserCurrentCommunity,
              logoutUser: logoutUser,
            }}
          >
            {!useParentRouter ? (
              <BrowserRouter>
                <LMFeedListDataContextProvider />
              </BrowserRouter>
            ) : (
              <LMFeedListDataContextProvider />
            )}
          </UserProviderContext.Provider>
        </GeneralContext.Provider>
      </CustomAgentProviderContext.Provider>
      <Snackbar
        open={showSnackbar}
        message={message}
        onClose={closeSnackbar}
        autoHideDuration={3000}
      />
    </GlobalClientProviderContext.Provider>
  );
}

export default LMFeed;
