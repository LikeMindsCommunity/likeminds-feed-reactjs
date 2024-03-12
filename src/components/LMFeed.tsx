import { PropsWithChildren } from "react";
import { Theme } from "../Themes/lmThemeClass";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import ThemeProviderContext from "../contexts/LMFeedThemeProviderContext";
import UserProviderContext from "../contexts/LMFeedUserProviderContext";
import useUserProvider from "../hooks/useLMUserProvider";
import {
  CustomAgentProviderContext,
  CustomAgentProviderInterface,
} from "../contexts/LMFeedCustomAgentProviderContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LMFeedUniversalFeed from "./LMFeedFlatFeed";
import { ROUTES } from "../shared/constants/lmRoutesConstant";
import LMFeedDetails from "./LMFeedDetails";
import { HelmetProvider } from "react-helmet-async";
import LMFeedTopicFlatFeed from "./LMFeedTopicFlatFeed";

export interface LMFeedProps<T> extends CustomAgentProviderInterface {
  client: T;
  theme?: Theme;
  showMember?: boolean;
  routes?: {
    base?: string;
    postDetails?: string;
  };
}

function LMFeed({
  theme = new Theme(),

  client,
  likeActionCall,
  topicBlocksWrapperStyles,
  LMPostHeaderStyles,
  LMPostFooterStyles,
}: PropsWithChildren<LMFeedProps<LMClient>>) {
  const { lmFeedUser, logoutUser, lmFeedUserCurrentCommunity } =
    useUserProvider("testUser1", false, "testUser1", client);
  if (!lmFeedUser) {
    return null;
  }
  return (
    <GlobalClientProviderContext.Provider
      value={{
        lmFeedclient: client,
      }}
    >
      <ThemeProviderContext.Provider
        value={{
          themeObject: theme,
        }}
      >
        <CustomAgentProviderContext.Provider
          value={{
            likeActionCall: likeActionCall,
            topicBlocksWrapperStyles,
            LMPostHeaderStyles,
            LMPostFooterStyles,
          }}
        >
          <UserProviderContext.Provider
            value={{
              currentUser: lmFeedUser,
              currentCommunity: lmFeedUserCurrentCommunity,
              logoutUser: logoutUser,
            }}
          >
            <BrowserRouter>
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
                <Route path={ROUTES.TOPIC} element={<LMFeedTopicFlatFeed />} />
              </Routes>
            </BrowserRouter>
          </UserProviderContext.Provider>
        </CustomAgentProviderContext.Provider>
      </ThemeProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
}

export default LMFeed;
