import {
  FeedListsDataStore,
  ApplicationGeneralsStore,
  FeedListDefaultActions,
} from "./dataStores";

export interface FeedListActionsAndDataStore {
  feedListDataStore: FeedListsDataStore;
  applicationGeneralsStore: ApplicationGeneralsStore;
  defaultActions: FeedListDefaultActions;
}
