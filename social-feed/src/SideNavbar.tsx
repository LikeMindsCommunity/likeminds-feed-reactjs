import HomeIcon from "./assets/home-icon.svg";
import ModerationIcon from "./assets/moderation-icon.svg";

const SideNavbar = () => {
  const user = JSON.parse(localStorage.getItem("LOCAL_USER") || "{}");
  const isCM = user?.state === 1;
  const isModerationScreen = window.location.pathname.includes("moderation");
  return (
    <div className="lm-sidenav">
      <div className="lm-sidenav-wrapper">
        <div className="lm-sidenav-icon-bar">
          <div
            className="lm-sidenav-icon-wrapper"
            onClick={() => {
              const url = new URL(window.location.href);
              if (url.pathname.endsWith("/moderation")) {
                url.pathname = url.pathname.replace(/\/moderation$/, "");
              }
              window.location.assign(url.toString());
            }}
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
            onClick={() => {
              const url = new URL(window.location.href);
              if (!url.pathname.endsWith("/moderation")) {
                url.pathname = url.pathname.replace(/\/$/, "") + "/moderation";
              }
              window.location.assign(url.toString());
            }}
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
