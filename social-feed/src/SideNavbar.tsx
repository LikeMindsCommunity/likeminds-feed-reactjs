import HomeIcon from "./assets/home-icon.svg";
import ModerationIcon from "./assets/moderation-icon.svg";
import { useNavigate } from "react-router-dom";
import {
  LMFeedCustomEvents,
  LMFeedCustomActionEvents,
  LMFeedCurrentUserState,
} from "@likeminds.community/likeminds-feed-reactjs-beta";
import { useEffect, useState } from "react";

const SideNavbar = ({
  customEventClient,
}: {
  customEventClient: LMFeedCustomEvents;
}) => {
  const navigate = useNavigate();
  const isModerationScreen = window.location.pathname.includes("moderation");
  const [isCM, setIsCM] = useState(
    JSON.parse(localStorage.getItem("LOCAL_USER") || "{}")?.state ===
      LMFeedCurrentUserState.CM || false
  );
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.CURRENT_USER_CM,
      (e: Event) => {
        const id = (e as CustomEvent).detail.isCM;
        setIsCM(id);
      }
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.CURRENT_USER_CM);
  });
  return (
    <div className="lm-sidenav">
      <div className="lm-sidenav-wrapper">
        <div className="lm-sidenav-icon-bar">
          <div
            className="lm-sidenav-icon-wrapper"
            onClick={() => navigate("/")}
          >
            <div
              className={
                (isCM && !isModerationScreen) || !isCM
                  ? "lm-nav-selected-icons lm-selected-background"
                  : "lm-nav-icons"
              }
            >
              <img src={HomeIcon} alt="home" />
            </div>
          </div>
        </div>

        {isCM ? (
          <div
            className="lm-sidenav-icon-wrapper moderation-icon"
            onClick={() => navigate("/moderation")}
          >
            <div
              className={
                `lm-nav-icons` +
                (isModerationScreen ? ` lm-selected-background ` : ``)
              }
            >
              <img src={ModerationIcon} alt="moderation" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SideNavbar;
