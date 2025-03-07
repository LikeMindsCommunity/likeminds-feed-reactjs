import React from "react";
import { SideNavbarState } from "../shared/enums/lmSideNavbar";

export const FeedSideNavbarContext =
  React.createContext<FeedSideNavbarContextnterface>({
    selectedNav: SideNavbarState.HOME,
    selectNav: () => {},
  });

interface FeedSideNavbarContextnterface {
  selectedNav: string;
  selectNav: (nav: string) => void;
}
