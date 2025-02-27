import { useEffect, useState, useContext } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";

export function useSideNavbar() {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { customEventClient } = useContext(GlobalClientProviderContext);
  const [selectedNav, setSelectedNav] = useState<string>(
    (currentUser?.state === 1 &&
      localStorage.getItem("sideNavbarCurrentState")) ||
      "home",
  );

  useEffect(() => {
    const handleDrawerChange = (event: Event) => {
      setSelectedNav((event as CustomEvent).detail.currentState);
      localStorage.setItem(
        "sideNavbarCurrentState",
        (event as CustomEvent).detail.currentState,
      );
    };

    customEventClient?.listen("sideNavbarCurrentState", handleDrawerChange);

    return () => {
      customEventClient?.remove("sideNavbarCurrentState");
    };
  }, [customEventClient]);

  useEffect(() => {
    localStorage.setItem("sideNavbarCurrentState", selectedNav);
  }, [selectedNav]);

  function selectNav(nav: string) {
    setSelectedNav(nav);
  }

  return { selectedNav, selectNav };
}
