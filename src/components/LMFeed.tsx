import { PropsWithChildren, CSSProperties } from "react";
import { Theme } from "../Themes/lmThemeClass";
import GlobalClientProviderContext from "../contexts/LMGlobalClientProviderContext";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import ThemeProviderContext from "../contexts/LMThemeProviderContext";
import UserProviderContext from "../contexts/LMUserProviderContext";
import useUserProvider from "../hooks/useLMUserProvider";
import { CustomAgentProviderContext } from "../contexts/LMCustomAgentProviderContext";

export interface LMFeedProps<T> {
  client: T;
  theme?: Theme;
  showMember?: boolean;
  routes?: {
    base?: string;
    postDetails?: string;
  };
  likeActionCall?: () => void;
  topicBlocksWrapperStyles?: CSSProperties;
}

function LMFeed({
  theme = new Theme(),
  children,
  client,
  likeActionCall,
  topicBlocksWrapperStyles,
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
          }}
        >
          <UserProviderContext.Provider
            value={{
              currentUser: lmFeedUser,
              currentCommunity: lmFeedUserCurrentCommunity,
              logoutUser: logoutUser,
            }}
          >
            {children}
          </UserProviderContext.Provider>
        </CustomAgentProviderContext.Provider>
      </ThemeProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
}

export default LMFeed;
