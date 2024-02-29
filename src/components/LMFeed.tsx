import { PropsWithChildren } from "react";
import { Theme } from "../Themes/ThemeClass";
import GlobalClientProviderContext from "../contexts/GlobalClientProviderContext";
import { LMClient } from "../types/DataLayerExportsTypes";
import ThemeProviderContext from "../contexts/ThemeProviderContext";
import UserProviderContext from "../contexts/UserProviderContext";
import useUserProvider from "../hooks/useUserProvider";
import { CustomAgentProviderContext } from "../contexts/CustomAgentProviderContext";

export interface LMFeedProps<T> {
  client: T;
  theme?: Theme;
  showMember?: boolean;
  routes?: {
    base?: string;
    postDetails?: string;
  };
  likeActionCall?: () => void;
}

function LMFeed({
  theme = new Theme(),
  children,
  client,
  likeActionCall,
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
