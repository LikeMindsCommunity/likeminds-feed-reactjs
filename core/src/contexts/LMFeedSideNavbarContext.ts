import React from "react";

export const FeedSideNavbarContext =
  React.createContext<FeedSideNavbarContextnterface>({
    selectedNav: "home",
    selectNav: () => {},
  });

interface FeedSideNavbarContextnterface {
  selectedNav: string;
  selectNav: (nav: string) => void;
}
