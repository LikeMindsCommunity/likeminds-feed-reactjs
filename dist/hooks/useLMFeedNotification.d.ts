import { Activity } from "../shared/types/models/Activity";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { User } from "../shared/types/models/member";
import { NotificationsCustomActions } from "../shared/types/cutomCallbacks/callbacks";
export declare function useLMFeedNotification(customEventClient: LMFeedCustomEvents, NotificationsCustomCallbacks?: NotificationsCustomActions): UseLMFeedNotification;
interface UseLMFeedNotification {
    notifications: Activity[];
    shouldLoadMoreNotifications: boolean;
    notificationCount: number;
    getNotifications: () => Promise<void>;
    users: Record<string, User>;
    handleNotification: (id: string) => void;
}
export {};
