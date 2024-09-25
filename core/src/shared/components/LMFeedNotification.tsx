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
import { NotificationsCustomActions } from "../types/cutomCallbacks/callbacks";
import { LMFeedNotificationAnalytics } from "../enums/lmNotificationAnalytics";

const LMFeedNotification = ({
  customEventClient,
  NotificationBellCustomIcon,
  NotificationsCustomCallbacks,
}: LMFeedNotificationProps) => {
  const {
    notificationCount,
    notifications,
    getNotifications,
    shouldLoadMoreNotifications,
    users,
    handleNotification,
  } = useLMFeedNotification(customEventClient, NotificationsCustomCallbacks);
  const [notificationAnchor, setNotificationAnchor] =
    useState<HTMLElement | null>(null);
  function renderNotification() {
    return (
      <Menu
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={() => setNotificationAnchor(null)}
      >
        <div
          className="lm-feed-activity-wrapper"
          id="scroller"
          lm-feed-component-id={`lm-feed-notifications-wrapper-yzabc`}
        >
          {notifications.length > 0 ? (
            <>
              <div
                className="lm-feed-activity-wrapper__title"
                lm-feed-component-id={`lm-feed-notifications-wrapper-defgh`}
              >
                Notification
              </div>
              <div
                className="notificationBody"
                lm-feed-component-id={`lm-feed-notifications-wrapper-ijklm`}
              >
                <InfiniteScroll
                  dataLength={notifications.length + 1}
                  hasMore={shouldLoadMoreNotifications}
                  next={getNotifications}
                  loader={null}
                  scrollableTarget="scroller"
                >
                  {notifications.map((activity: Activity) => {
                    const { imageUrl, name } = users[activity?.actionBy[0]];
                    const avatar = getAvatar({ imageUrl, name });
                    return (
                      <div
                        key={activity?.Id}
                        className={`lm-feed-activity-wrapper__activity-item lm-cursor-pointer ${!activity.isRead ? "non-interacted-activity" : ""} lm-hover-effect`}
                        onClick={() => handleNotification(activity.Id)}
                        lm-feed-component-id={`lm-feed-notifications-wrapper-nopqr-${activity.Id}`}
                      >
                        <div
                          className="user-image"
                          lm-feed-component-id={`lm-feed-notifications-wrapper-stuvw-${activity.Id}`}
                        >
                          {avatar}
                        </div>
                        <div
                          className="notification-content"
                          lm-feed-component-id={`lm-feed-notifications-wrapper-xyzab-${activity.Id}`}
                        >
                          <div
                            className="notification-text"
                            dangerouslySetInnerHTML={{
                              __html: convertTextToHTML(activity?.activityText)
                                ?.innerHTML,
                            }}
                            lm-feed-component-id={`lm-feed-notifications-wrapper-cdefg-${activity.Id}`}
                          ></div>
                          <div
                            className="notification-time-before"
                            lm-feed-component-id={`lm-feed-notifications-wrapper-hijkl-${activity.Id}`}
                          >
                            {dayjs(activity?.updatedAt).fromNow()}
                          </div>
                        </div>
                        <div
                          lm-feed-component-id={`lm-feed-notifications-wrapper-mnopq-${activity.Id}`}
                        ></div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            </>
          ) : (
            <div
              className="lmNoNotification noNotifications lm-d-flex"
              lm-feed-component-id={`lm-feed-no-notifications-wrapper-rstuw`}
            >
              <div
                lm-feed-component-id={`lm-feed-no-notifications-wrapper-vwxyz`}
              >
                <img
                  src={noNotifications}
                  alt="default image"
                  lm-feed-component-id={`lm-feed-no-notifications-wrapper-abcde`}
                />
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
    <span className="lm-feed-notification-badge">
      <Badge
        badgeContent={
          notificationCount > 0 ? notificationCount.toString() : null
        }
        color="error"
      >
        <span
          onClick={(e) => {
            if (!notificationAnchor) {
              customEventClient.dispatchEvent(
                LMFeedNotificationAnalytics.NOTIFICATION_PAGE_OPENED,
              );
            }
            setNotificationAnchor(e.currentTarget);
          }}
        >
          {NotificationBellCustomIcon ? (
            <NotificationBellCustomIcon />
          ) : (
            <img
              src={notificationBell}
              alt="notification"
              className="lm-cursor-pointer"
            />
          )}
        </span>
      </Badge>

      {renderNotification()}
    </span>
  );
};

interface LMFeedNotificationProps {
  customEventClient: LMFeedCustomEvents;
  NotificationBellCustomIcon?: () => JSX.Element;
  NotificationsCustomCallbacks?: NotificationsCustomActions;
}

export default LMFeedNotification;
