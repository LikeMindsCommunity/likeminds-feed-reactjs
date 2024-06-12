import { NavigateFunction } from "react-router-dom";
import { FeedListsDataStore, ApplicationGeneralsStore, FeedListDefaultActions, FeedPostDetailsStore, FeedPostDetailsDefaultActions, TopicDataStore, TopicsDefaultAction, RepliesDataStore, RepliesDefaultAction, PostCreationDataStore, PostCreationDefaultActions, NotificationsDataStore, NotificationsDefaultActions } from "./dataStores";
export interface FeedListActionsAndDataStore {
    feedListDataStore: FeedListsDataStore;
    applicationGeneralsStore: ApplicationGeneralsStore;
    defaultActions: FeedListDefaultActions;
    navigate: NavigateFunction;
}
export interface FeedPostDetailsActionsAndDataStore {
    feedPostDetailsStore: FeedPostDetailsStore;
    applicationGeneralStore: ApplicationGeneralsStore;
    defaultActions: FeedPostDetailsDefaultActions;
    navigate: NavigateFunction;
}
export interface TopicsActionsAndDataStore {
    topicsDataStore: TopicDataStore;
    applicationGeneralStore: ApplicationGeneralsStore;
    defaultActions: TopicsDefaultAction;
    navigate: NavigateFunction;
}
export interface RepliesActionsAndDataStore {
    repliesDataStore: RepliesDataStore;
    applicationGeneralStore: ApplicationGeneralsStore;
    defaultActions: RepliesDefaultAction;
    navigate: NavigateFunction;
}
export interface PostCreationActionsAndDataStore {
    postCreationDataStore: PostCreationDataStore;
    applicationGeneralStore: ApplicationGeneralsStore;
    defaultActions: PostCreationDefaultActions;
    navigate: NavigateFunction;
}
export interface NotificationsActionsAndDataStore {
    notificationsDataStore: NotificationsDataStore;
    defaultActions: NotificationsDefaultActions;
}
