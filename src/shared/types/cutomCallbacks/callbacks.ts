import { FeedListActionsAndDataStore } from "./dataProvider";

export interface FeedListCustomActions {
  deleteCustomAction: feedListCustomActionCallback;
}

type feedListCustomActionCallback = (
  store: FeedListActionsAndDataStore,
) => void;
