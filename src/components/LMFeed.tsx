import { PropsWithChildren } from "react";
import { Theme } from "../Themes/ThemeClass";
import GlobalClientProviderContext from "../contexts/GlobalClientProviderContext";
import { LMClient } from "../types/DataLayerExportsTypes";
import ThemeProviderContext from "../contexts/ThemeProviderContext";
import UserProviderContext from "../contexts/UserProviderContext";
import useUserProvider from "../hooks/useUserProvider";

export interface LMFeedProps<T> {
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
  children,
  client,
}: PropsWithChildren<LMFeedProps<LMClient>>) {
  const { lmFeedUser, logoutUser, lmFeedUserCurrentCommunity } =
    useUserProvider("TestingUser1", false, "TestingUser1", client);
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
        <UserProviderContext.Provider
          value={{
            currentUser: lmFeedUser,
            currentCommunity: lmFeedUserCurrentCommunity,
            logoutUser: logoutUser,
          }}
        >
          {children}
        </UserProviderContext.Provider>
      </ThemeProviderContext.Provider>
    </GlobalClientProviderContext.Provider>
  );
}

export default LMFeed;
