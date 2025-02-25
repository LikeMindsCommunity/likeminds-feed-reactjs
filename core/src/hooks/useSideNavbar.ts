import { useEffect, useState, useContext } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

export function useSideNavbar() {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const [selectedNav, setSelectedNav] = useState<string>(
    (currentUser?.state === 1 &&
      localStorage.getItem("sideNavbarCurrentState")) ||
      "home",
  );

  useEffect(() => {
    localStorage.setItem("sideNavbarCurrentState", selectedNav);
  }, [selectedNav]);

  function selectNav(nav: string) {
    setSelectedNav(nav);
  }

  return { selectedNav, selectNav };
}
