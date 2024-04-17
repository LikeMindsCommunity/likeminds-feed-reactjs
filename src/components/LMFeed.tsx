import { PropsWithChildren, useEffect } from "react";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import UserProviderContext from "../contexts/LMFeedUserProviderContext";
import useUserProvider from "../hooks/useLMUserProvider";
import {
  CustomAgentProviderContext,
  CustomAgentProviderInterface,
} from "../contexts/LMFeedCustomAgentProviderContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LMFeedUniversalFeed from "./LMFeedUniversalFeed";
import { ROUTES } from "../shared/constants/lmRoutesConstant";
import LMFeedDetails from "./LMFeedDetails";
import { HelmetProvider } from "react-helmet-async";
import LMFeedTopicFlatFeed from "./LMFeedTopicFlatFeed";
import { RouteModifiers } from "../shared/types/customProps/routes";
import "../assets/scss/styles.scss";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { pdfjs } from "react-pdf";
import { useLMFeedGeneralContextProvider } from "../hooks/useLMFeedGeneralContextProvider";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";

export interface LMFeedProps<T> extends CustomAgentProviderInterface {
  client: T;
  showMember?: boolean;
  routes?: RouteModifiers[];
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
  topicBlocksWrapperStyles,
  LMPostHeaderStyles,
  LMPostFooterStyles,
  LMPostTopicStyles,
  routes,
  LMPostBodyStyles,
  CustomComponents,
  CustomCallbacks,
  useParentRouter = false,
  customEventClient,
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
          topicBlocksWrapperStyles,
          LMPostHeaderStyles,
          LMPostFooterStyles,
          LMPostBodyStyles,
          LMPostTopicStyles,
          CustomComponents,
          CustomCallbacks,
        }}
      >
        <GeneralContext.Provider
          value={{
            message,
            showSnackbar,
            closeSnackbar,
            displaySnackbarMessage,
          }}
        >
          <UserProviderContext.Provider
            value={{
              currentUser: lmFeedUser,
              currentCommunity: lmFeedUserCurrentCommunity,
              logoutUser: logoutUser,
            }}
          >
            {useParentRouter ? (
              <>
                {routes ? (
                  <>
                    <Routes>
                      {routes.map((routeObject) => (
                        <Route
                          key={routeObject.route}
                          path={routeObject.route}
                        />
                      ))}
                    </Routes>
                  </>
                ) : (
                  <Routes>
                    <Route
                      path={ROUTES.ROOT_PATH}
                      element={<LMFeedUniversalFeed />}
                    ></Route>

                    <Route
                      path={ROUTES.POST_DETAIL}
                      element={
                        <HelmetProvider>
                          <LMFeedDetails />
                        </HelmetProvider>
                      }
                    ></Route>
                    <Route
                      path={ROUTES.TOPIC}
                      element={<LMFeedTopicFlatFeed />}
                    />
                  </Routes>
                )}
              </>
            ) : (
              <BrowserRouter>
                {routes ? (
                  <>
                    <Routes>
                      {routes.map((routeObject) => (
                        <Route
                          path={routeObject.route}
                          element={routeObject.element}
                        />
                      ))}
                    </Routes>
                  </>
                ) : (
                  <Routes>
                    <Route
                      path={ROUTES.ROOT_PATH}
                      element={<LMFeedUniversalFeed />}
                    ></Route>

                    <Route
                      path={ROUTES.POST_DETAIL}
                      element={
                        <HelmetProvider>
                          <LMFeedDetails />
                        </HelmetProvider>
                      }
                    ></Route>
                    <Route
                      path={ROUTES.TOPIC}
                      element={<LMFeedTopicFlatFeed />}
                    />
                  </Routes>
                )}
              </BrowserRouter>
            )}
          </UserProviderContext.Provider>
        </GeneralContext.Provider>
      </CustomAgentProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
}

export default LMFeed;
