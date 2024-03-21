import { PropsWithChildren } from "react";

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

export interface LMFeedProps<T> extends CustomAgentProviderInterface {
  client: T;
  showMember?: boolean;
  routes?: RouteModifiers[];
  username?: string;
  userId: string;
  isGuest?: boolean;
  useParentRouter?: boolean;
}

function LMFeed({
  username = "",
  userId,
  isGuest = false,
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
  useParentRouter,
}: PropsWithChildren<LMFeedProps<LMClient>>) {
  const { lmFeedUser, logoutUser, lmFeedUserCurrentCommunity } =
    useUserProvider(userId, isGuest, username, client);
  if (!lmFeedUser) {
    return null;
  }
  return (
    <GlobalClientProviderContext.Provider
      value={{
        lmFeedclient: client,
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
                      <Route path={routeObject.route} />
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
      </CustomAgentProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
}

export default LMFeed;
