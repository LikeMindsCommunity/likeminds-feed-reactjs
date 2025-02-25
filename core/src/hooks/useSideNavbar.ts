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
    const handleDrawerChange = (event: any) => {
      setSelectedNav(event.detail.currentState);
      localStorage.setItem("sideNavbarCurrentState", event.detail.currentState);
    };

    customEventClient?.listen("sideNavbarState", handleDrawerChange);

    return () => {
      customEventClient?.remove("sideNavbarState");
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
