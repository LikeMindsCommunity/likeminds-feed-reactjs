import HomeIcon from "../assets/images/home-icon.svg";
import ModerationIcon from "../assets/images/moderation-icon.svg";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { useContext, useEffect } from "react";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { FeedSideNavbarContext } from "../contexts/LMFeedSideNavbarContext";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { SideNavbarState } from "../shared/enums/lmSideNavbar";

const LMFeedLeftNavigation = () => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { customEventClient } = useContext(GlobalClientProviderContext);
  const { selectNav, selectedNav } = useContext(FeedSideNavbarContext);

  useEffect(() => {
    customEventClient?.dispatchEvent(LMFeedCustomActionEvents.CURRENT_USER_CM, {
      currentState: currentUser?.state === 1,
    });
  }, [customEventClient, currentUser]);

  return (
    <div className="lm-sidenav-wrapper">
      <div className="lm-sidenav-icon-bar">
        <div
          className="lm-sidenav-icon-wrapper"
          onClick={() => selectNav(SideNavbarState.HOME)}
        >
          <div
            className={
              selectedNav === SideNavbarState.HOME
                ? "lm-nav-selected-icons lm-selected-background"
                : "lm-nav-icons"
            }
          >
            <img src={HomeIcon} alt="home" />
          </div>
        </div>
      </div>
      {currentUser?.state === 1 ? (
        <div
          className="lm-sidenav-icon-wrapper moderation-icon"
          onClick={() => selectNav(SideNavbarState.MODERATION)}
        >
          <div
            className={
              `lm-nav-icons` +
              (selectedNav === SideNavbarState.MODERATION ? ` lm-selected-background ` : ``)
            }
          >
            <img src={ModerationIcon} alt="moderation" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LMFeedLeftNavigation;
