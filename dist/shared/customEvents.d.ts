import { FeedListActionsAndDataStore, FeedPostDetailsActionsAndDataStore, NotificationsActionsAndDataStore, PostCreationActionsAndDataStore, RepliesActionsAndDataStore, TopicsActionsAndDataStore } from "./types/cutomCallbacks/dataProvider";
export declare class LMFeedCustomEvents {
    events: Record<string, string>;
    private eventListenerMap;
    private feedListActionsAndDataStore;
    private feedPostDetilsActionsAndDataStore;
    private topicsActionsAndDataStore;
    private repliesActionsAndDataStore;
    private postCreationActionAndDataStore;
    private notificationsActionsAndDataStore;
    constructor();
    updateFeedListActionsAndDataStore(newStore: FeedListActionsAndDataStore): void;
    updateFeedPostDetilsActionsAndDataStore(newStore: FeedPostDetailsActionsAndDataStore): void;
    updateTopicsActionsAndDataStore(newStore: TopicsActionsAndDataStore): void;
    updateRepliesActionsAndDataStore(newStore: RepliesActionsAndDataStore): void;
    updatePostCreationActionAndDataStore(newStore: PostCreationActionsAndDataStore): void;
    updateNotificationsActionsAndDataStore(newStore: NotificationsActionsAndDataStore): void;
    createEventListener(fn: EventListener): EventListener;
    private registerEvent;
    dispatchEvent(eventName: string, data?: Record<string, unknown>): void;
    listen(eventName: string, callback: EventListener): void;
    remove(eventName: string): void;
}
