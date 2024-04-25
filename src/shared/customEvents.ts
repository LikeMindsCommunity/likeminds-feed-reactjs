import {
  FeedListActionsAndDataStore,
  FeedPostDetailsActionsAndDataStore,
  NotificationsActionsAndDataStore,
  PostCreationActionsAndDataStore,
  RepliesActionsAndDataStore,
  TopicsActionsAndDataStore,
} from "./types/cutomCallbacks/dataProvider";

interface EventListnerObjectCustom extends EventListenerObject {
  feedListActionsAndDataStore: FeedListActionsAndDataStore | null;
  feedPostDetilsActionsAndDataStore: FeedPostDetailsActionsAndDataStore | null;
  topicsActionsAndDataStore: TopicsActionsAndDataStore | null;
  repliesActionsAndDataStore: RepliesActionsAndDataStore | null;
  postCreationActionAndDataStore: PostCreationActionsAndDataStore | null;
  notificationsActionsAndDataStore: NotificationsActionsAndDataStore | null;
}
export class LMFeedCustomEvents {
  events: Record<string, string>;
  private eventListenerMap: Record<string, EventListener>;
  private feedListActionsAndDataStore: FeedListActionsAndDataStore | null =
    null;
  private feedPostDetilsActionsAndDataStore: FeedPostDetailsActionsAndDataStore | null =
    null;
  private topicsActionsAndDataStore: TopicsActionsAndDataStore | null = null;
  private repliesActionsAndDataStore: RepliesActionsAndDataStore | null = null;
  private postCreationActionAndDataStore: PostCreationActionsAndDataStore | null =
    null;
  private notificationsActionsAndDataStore: NotificationsActionsAndDataStore | null =
    null;
  constructor() {
    this.events = {};
    this.eventListenerMap = {};
  }

  updateFeedListActionsAndDataStore(newStore: FeedListActionsAndDataStore) {
    this.feedListActionsAndDataStore = newStore;
  }
  updateFeedPostDetilsActionsAndDataStore(
    newStore: FeedPostDetailsActionsAndDataStore,
  ) {
    this.feedPostDetilsActionsAndDataStore = newStore;
  }
  updateTopicsActionsAndDataStore(newStore: TopicsActionsAndDataStore) {
    this.topicsActionsAndDataStore = newStore;
  }
  updateRepliesActionsAndDataStore(newStore: RepliesActionsAndDataStore) {
    this.repliesActionsAndDataStore = newStore;
  }
  updatePostCreationActionAndDataStore(
    newStore: PostCreationActionsAndDataStore,
  ) {
    this.postCreationActionAndDataStore = newStore;
  }
  updateNotificationsActionsAndDataStore(
    newStore: NotificationsActionsAndDataStore,
  ) {
    this.notificationsActionsAndDataStore = newStore;
  }
  createEventListener(fn: EventListener) {
    const obj: EventListnerObjectCustom = {
      handleEvent: fn,
      feedListActionsAndDataStore: this.feedListActionsAndDataStore,
      feedPostDetilsActionsAndDataStore: this.feedPostDetilsActionsAndDataStore,
      topicsActionsAndDataStore: this.topicsActionsAndDataStore,
      repliesActionsAndDataStore: this.repliesActionsAndDataStore,
      postCreationActionAndDataStore: this.postCreationActionAndDataStore,
      notificationsActionsAndDataStore: this.notificationsActionsAndDataStore,
    };
    // return obj;
    // console.log(fn.prototype);
    return fn.bind(obj);
  }
  private registerEvent(eventName: string) {
    this.events[eventName] = eventName;
  }
  dispatchEvent(eventName: string, data?: Record<string, unknown>) {
    this.registerEvent(eventName);

    const customEvent = new CustomEvent(eventName, {
      detail: data,
    });
    dispatchEvent(customEvent);
    return;
  }
  listen(eventName: string, callback: EventListener) {
    this.eventListenerMap[eventName] = callback;
    addEventListener(eventName, callback);
  }
  remove(eventName: string) {
    removeEventListener(eventName, this.eventListenerMap[eventName]);
  }
}
