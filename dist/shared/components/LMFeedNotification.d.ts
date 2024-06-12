/// <reference types="react" />
import { LMFeedCustomEvents } from "../customEvents";
import { NotificationsCustomActions } from "../types/cutomCallbacks/callbacks";
declare const LMFeedNotification: ({ customEventClient, NotificationBellCustomIcon, NotificationsCustomCallbacks, }: LMFeedNotificationProps) => import("react/jsx-runtime").JSX.Element;
interface LMFeedNotificationProps {
    customEventClient: LMFeedCustomEvents;
    NotificationBellCustomIcon?: () => JSX.Element;
    NotificationsCustomCallbacks?: NotificationsCustomActions;
}
export default LMFeedNotification;
