import { useEffect, useState, useContext } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { SideNavbarState } from "../shared/enums/lmSideNavbar";

export function useSideNavbar() {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { customEventClient } = useContext(GlobalClientProviderContext);
  const [selectedNav, setSelectedNav] = useState<string>(
    (currentUser?.state === 1 &&
      localStorage.getItem(
        LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
      )) ||
      SideNavbarState.HOME,
  );

  useEffect(() => {
    const handleDrawerChange = (event: Event) => {
      setSelectedNav((event as CustomEvent).detail.currentState);
      localStorage.setItem(
        LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
        (event as CustomEvent).detail.currentState,
      );
    };

    customEventClient?.listen(
      LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
      handleDrawerChange,
    );

    return () => {
      customEventClient?.remove(
        LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
      );
    };
  }, [customEventClient]);

  useEffect(() => {
    localStorage.setItem(
      LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
      selectedNav,
    );
  }, [selectedNav]);

  function selectNav(nav: string) {
    setSelectedNav(nav);
  }

  return { selectedNav, selectNav };
}
