import { useCallback, useEffect, useState } from "react";
import { Activity } from "../shared/types/models/Activity";
import { GetNotificationCountResponse } from "../shared/types/api-responses/getNotificationCount";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import {
  GetNotificationFeedRequest,
  MarkReadNotificationRequest,
} from "@likeminds.community/feed-js-beta";
import { DEFAULT_PAGE_SIZE } from "../shared/constants/lmAppConstant";
import { GetNotificationResponse } from "../shared/types/api-responses/getNotificationResponse";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { User } from "../shared/types/models/member";

export function useLMFeedNotification(
  customEventClient: LMFeedCustomEvents,
): UseLMFeedNotification {
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [shouldLoadMoreNotifications, setShouldLoadMoreNotifications] =
    useState<boolean>(true);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationPage, setNotificationPage] = useState<number>(1);
  const [lmFeedClient, setLMFeedClient] = useState<LMClient | null>(null);
  const [, setUser] = useState<User | null>(null);

  const getNotificationCount = useCallback(
    async function () {
      try {
        const call: GetNotificationCountResponse =
          (await lmFeedClient?.getUnreadNotificationCount()) as never;
        if (call.success) {
          setNotificationCount(call.data.count);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedClient],
  );
  async function markReadNotification(id: string) {
    try {
      const call = await lmFeedClient?.markReadNotification(
        MarkReadNotificationRequest.builder().setactivityId(id).build(),
      );
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  }
  const getNotifications = useCallback(
    async function () {
      try {
        const call: GetNotificationResponse =
          (await lmFeedClient?.getNotificationFeed(
            GetNotificationFeedRequest.builder()
              .setpage(notificationPage)
              .setpageSize(DEFAULT_PAGE_SIZE)
              .build(),
          )) as never;
        if (call.success) {
          const notificationsCopy = [...notifications, ...call.data.activities];
          const usersCopy = { ...users, ...call.data.users };
          setUsers(usersCopy);
          setNotifications(notificationsCopy);
          setNotificationPage((count) => count + 1);
          if (!call.data.activities.length) {
            setShouldLoadMoreNotifications(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedClient, notificationPage, notifications, users],
  );
  function handleNotification(id: string) {
    const notificationsCopy = [...notifications];
    const index = notificationsCopy.findIndex(
      (notification) => notification.Id === id,
    );
    const clickedNotification = notificationsCopy[index];
    if (!clickedNotification.isRead) {
      clickedNotification.isRead = true;
    }
    markReadNotification(id);
    window.location.href = `community/post/${clickedNotification.activityEntityData.Id}`;
    setNotifications(notificationsCopy);
  }
  useEffect(() => {
    if (lmFeedClient) {
      getNotificationCount();
    }
  }, [lmFeedClient]);
  useEffect(() => {
    customEventClient.listen(
      LMFeedCustomActionEvents.USER_INITIATED,
      (e: Event) => {
        const details = (e as CustomEvent).detail;
        const { lmFeedClient, user } = details;
        setLMFeedClient(lmFeedClient);
        setUser(user);
      },
    );
    return () =>
      customEventClient.remove(LMFeedCustomActionEvents.USER_INITIATED);
  }, [customEventClient]);
  useEffect(() => {
    if (lmFeedClient) {
      getNotifications();
    }
  }, [lmFeedClient]);
  return {
    notifications,
    shouldLoadMoreNotifications,
    getNotifications,
    notificationCount,
    users,
    handleNotification,
  };
}

interface UseLMFeedNotification {
  notifications: Activity[];
  shouldLoadMoreNotifications: boolean;
  notificationCount: number;
  getNotifications: () => Promise<void>;
  users: Record<string, User>;
  handleNotification: (id: string) => void;
}
