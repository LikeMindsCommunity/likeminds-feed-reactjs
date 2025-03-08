import {
  FeedListsDataStore,
  ApplicationGeneralsStore,
  FeedListDefaultActions,
  FeedPostDetailsStore,
  FeedPostDetailsDefaultActions,
  TopicDataStore,
  TopicsDefaultAction,
  RepliesDataStore,
  RepliesDefaultAction,
  PostCreationDataStore,
  PostCreationDefaultActions,
  PollCreationDataStore,
  PollCreationDefaultActions,
  NotificationsDataStore,
  NotificationsDefaultActions,
  ModerationDataStore,
  ModerationDefaultActions,
} from "./dataStores";

export interface FeedListActionsAndDataStore {
  feedListDataStore: FeedListsDataStore;
  applicationGeneralsStore: ApplicationGeneralsStore;
  defaultActions: FeedListDefaultActions;
}
export interface FeedPostDetailsActionsAndDataStore {
  feedPostDetailsStore: FeedPostDetailsStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: FeedPostDetailsDefaultActions;
}

export interface TopicsActionsAndDataStore {
  topicsDataStore: TopicDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: TopicsDefaultAction;
}

export interface RepliesActionsAndDataStore {
  repliesDataStore: RepliesDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: RepliesDefaultAction;
}

export interface PostCreationActionsAndDataStore {
  postCreationDataStore: PostCreationDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: PostCreationDefaultActions;
}

export interface NotificationsActionsAndDataStore {
  notificationsDataStore: NotificationsDataStore;
  defaultActions: NotificationsDefaultActions;
}

export interface PollCreationActionsAndDataStore {
  pollCreationDataStore: PollCreationDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: PollCreationDefaultActions;
}

export interface ModerationActionsAndDataStore {
  moderationDataStore : ModerationDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: ModerationDefaultActions;
}
