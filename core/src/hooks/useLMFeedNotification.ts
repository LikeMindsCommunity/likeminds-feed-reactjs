import { useCallback, useEffect, useMemo, useState } from "react";
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
import { NotificationsActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";
import { NotificationsCustomActions } from "../shared/types/cutomCallbacks/callbacks";

export function useLMFeedNotification(
  customEventClient: LMFeedCustomEvents,
  NotificationsCustomCallbacks: NotificationsCustomActions = {},
): UseLMFeedNotification {
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [shouldLoadMoreNotifications, setShouldLoadMoreNotifications] =
    useState<boolean>(true);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationPage, setNotificationPage] = useState<number>(1);
  const [lmFeedClient, setLMFeedClient] = useState<LMClient | null>(null);
  const [, setUser] = useState<User | null>(null);
  const { handleNotificationCustomAction } = NotificationsCustomCallbacks;
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
      await lmFeedClient?.markReadNotification(
        MarkReadNotificationRequest.builder().setActivityId(id).build(),
      );
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
              .setPage(notificationPage)
              .setPageSize(DEFAULT_PAGE_SIZE)
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
  // const { NotificationsCustomCallbacks = {} } = useContext(
  //   CustomAgentProviderContext,
  // );

  const handleNotification = useCallback(
    (id: string) => {
      const notificationsCopy = [...notifications];
      const index = notificationsCopy.findIndex(
        (notification) => notification?.id === id,
      );
      const clickedNotification = notificationsCopy[index];
      if (!clickedNotification.isRead) {
        clickedNotification.isRead = true;
      }
      markReadNotification(id);

      const location = window.location;
      const url = new URL(location.href);
      const search = url.searchParams.get("id");
      if (!search) {
        url.searchParams.append("id", id);
        window.open(url, "_self");
      }

      setNotifications(notificationsCopy);
    },
    [markReadNotification, notifications],
  );
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
  const notificationsActionAndDataStore: NotificationsActionsAndDataStore =
    useMemo(() => {
      return {
        notificationsDataStore: {
          notifications,
          setNotifications,
          users,
          setUsers,
          shouldLoadMoreNotifications,
          setShouldLoadMoreNotifications,
          notificationCount,
          setNotificationCount,
          notificationPage,
          setNotificationPage,
        },
        defaultActions: {
          getNotifications,
          handleNotification,
        },
      };
    }, [
      getNotifications,
      handleNotification,
      notificationCount,
      notificationPage,
      notifications,
      shouldLoadMoreNotifications,
      users,
    ]);
  return {
    notifications,
    shouldLoadMoreNotifications,
    getNotifications,
    notificationCount,
    users,
    handleNotification: handleNotificationCustomAction
      ? handleNotificationCustomAction.bind(
          null,
          notificationsActionAndDataStore,
        )
      : handleNotification,
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
// NotificationsCustomCallbacks?: NotificationsCustomActions;
