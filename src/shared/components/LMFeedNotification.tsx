import React, { useState } from "react";
import notificationBell from "../../assets/images/notification-bell.svg";
import { Badge, Menu } from "@mui/material";
import { LMFeedCustomEvents } from "../customEvents";
import { useLMFeedNotification } from "../../hooks/useLMFeedNotification";
import InfiniteScroll from "react-infinite-scroll-component";
import { Activity } from "../types/models/Activity";
import { convertTextToHTML } from "../taggingParser";
import dayjs from "dayjs";
import noNotifications from "../../assets/images/no-notifications.svg";
import { getAvatar } from "./LMUserMedia";
import threeDotMenuIcon from "../../assets/images/3-dot-menu-post-header.svg";
// import threeDotMenuIcon from "../../";
const LMFeedNotification = ({ customEventClient }: LMFeedNotificationProps) => {
  const {
    notificationCount,
    notifications,
    getNotifications,
    shouldLoadMoreNotifications,
    users,
    handleNotification,
  } = useLMFeedNotification(customEventClient);
  const [notificationAnchor, setNotificationAnchor] =
    useState<HTMLElement | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);

  function renderNotification() {
    return (
      <Menu
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={() => setNotificationAnchor(null)}
      >
        <div className="lm-feed-activity-wrapper">
          {notifications.length > 0 ? (
            <>
              <div className="lm-feed-activity-wrapper__title">
                Notification
              </div>

              <div className="notificationBody" id="scroller">
                <InfiniteScroll
                  dataLength={notifications.length + 1}
                  hasMore={shouldLoadMoreNotifications}
                  next={getNotifications}
                  loader={null}
                  scrollableTarget="scroller"
                >
                  {notifications.map((activity: Activity) => {
                    const { imageUrl, name } = users[activity?.actionBy[0]];
                    const avatar = getAvatar({
                      imageUrl,
                      name,
                    });
                    return (
                      <div
                        key={activity?.Id}
                        className={`lm-feed-activity-wrapper__activity-item lm-cursor-pointer ${!activity.isRead ? "non-interacted-activity" : ""} lm-hover-effect`}
                        onClick={() => handleNotification(activity.Id)}
                      >
                        <div className="user-image">{avatar}</div>
                        <div className="notification-content">
                          <div
                            className="notification-text"
                            dangerouslySetInnerHTML={{
                              __html: convertTextToHTML(activity?.activityText)
                                ?.innerHTML,
                            }}
                          ></div>
                          <div className="notification-time-before">
                            {dayjs(activity?.updatedAt).fromNow()}
                          </div>
                        </div>
                        <div>
                          <img
                            className="three-dot-menu-image lm-cursor-pointer"
                            src={threeDotMenuIcon}
                            alt="3-dot-menu"
                            // onClick={(e) => {
                            //   setMenuAnchor(e.currentTarget);
                            // }}
                          />
                          {/* <IconButton
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                            setMenuAnchor(e.currentTarget)
                          }>
                          <MoreVertIcon />
                        </IconButton> */}
                        </div>

                        <Menu
                          open={Boolean(menuAnchor)}
                          onClose={() => setMenuAnchor(null)}
                          anchorEl={menuAnchor}
                          className="menu-block"
                        >
                          <div className="menu-block-item">
                            Remove this notification
                          </div>
                          <div className="menu-block-item">
                            Mute this notification
                          </div>
                        </Menu>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            </>
          ) : (
            <div className="lmNoNotification noNotifications lm-d-flex">
              <div>
                <img src={noNotifications} alt="default image" />
              </div>
              Oops! You do not have any no notifications yet.
            </div>
          )}
          {/* </div> */}
        </div>
      </Menu>
    );
  }
  return (
    <span>
      <Badge badgeContent={notificationCount.toString()} color="error">
        <img
          src={notificationBell}
          alt="notification"
          className="lm-cursor-pointer"
          onClick={(e) => {
            setNotificationAnchor(e.currentTarget);
          }}
        />
      </Badge>
      {renderNotification()}
    </span>
  );
};

interface LMFeedNotificationProps {
  customEventClient: LMFeedCustomEvents;
}

export default LMFeedNotification;
