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
  NotificationsDataStore,
  NotificationsDefaultActions,
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

export interface RepliesActionAndDataStore {
  repliesDataStore: RepliesDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: RepliesDefaultAction;
}

export interface PostCreationActionAndDataStore {
  postCreationDataStore: PostCreationDataStore;
  applicationGeneralStore: ApplicationGeneralsStore;
  defaultActions: PostCreationDefaultActions;
}

export interface NotificationsActionAndDataStore {
  notificationsDataStore: NotificationsDataStore;
  defaultActions: NotificationsDefaultActions;
}
