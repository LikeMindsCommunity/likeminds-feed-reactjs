import HomeIcon from "../assets/images/home-icon.svg";
import ModerationIcon from "../assets/images/moderation-icon.svg";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { useContext } from "react";

interface LMFeedLeftNavigationInterface {
  selectedNav: string;
  selectNav: (nav: string) => void;
}

const LMFeedLeftNavigation = ({
  selectedNav,
  selectNav,
}: LMFeedLeftNavigationInterface) => {
  const { currentUser } = useContext(LMFeedUserProviderContext);

  return (
    <div className="lm-sidenav-wrapper">
      <div className="lm-sidenav-icon-bar">
        <div
          className="lm-sidenav-icon-wrapper"
          onClick={() => selectNav("home")}
        >
          <div
            className={
              selectedNav === "home"
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
          onClick={() => selectNav("moderation")}
        >
          <div
            className={
              "lm-nav-icons" +
              (selectedNav === "moderation" ? " lm-selected-background " : "")
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
