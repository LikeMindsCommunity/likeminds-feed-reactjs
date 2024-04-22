import {
  FeedListActionsAndDataStore,
  FeedPostDetailsActionsAndDataStore,
  PostCreationActionAndDataStore,
  RepliesActionAndDataStore,
  TopicsActionsAndDataStore,
} from "./dataProvider";

export interface FeedListCustomActions {
  deletePostCustomAction?: feedListCustomActionCallback;
  pinPostCustomAction?: feedListCustomActionCallback;

  likePostCustomAction?: feedListCustomActionCallback;
  commentPostCustomAction?: feedListCustomActionCallback;
}

export type feedListCustomActionCallback = (
  store: FeedListActionsAndDataStore,
  actionData: unknown,
) => Promise<void>;
export type feedPostDetailsCustomActionCallback = (
  store: FeedPostDetailsActionsAndDataStore,
  actionDataArgumentOne?: unknown,
  actionDataArgumentTwo?: unknown,
) => Promise<void>;
export type GeneralClickCallBackFunction = (
  feedListStore: FeedListActionsAndDataStore,
  feedPostDetailsDataStore: FeedPostDetailsActionsAndDataStore,
  e: React.MouseEvent<unknown>,
) => void;
export interface FeedPostDetailsCustomActions {
  deletePostCustomAction?: feedPostDetailsCustomActionCallback;
  pinPostCustomAction?: feedPostDetailsCustomActionCallback;
  likePostCustomAction?: feedPostDetailsCustomActionCallback;
  likeReplyCustomAction?: feedPostDetailsCustomActionCallback;
}

export type TopicsCustomActionCallback = (
  store: TopicsActionsAndDataStore,
  actionDataArgumentOne?: unknown,
  actionDataArgumentTwo?: unknown,
) => void;
export interface TopicsCustomActions {
  setSearchKeyCustomAction?: TopicsCustomActionCallback;
  updateCheckedTopicsCustomAction?: TopicsCustomActionCallback;
  clearAllCheckedTopicsCustomAction?: TopicsCustomActionCallback;
}
export interface GeneralClickCallbacks {
  postMenuItemClickCallback?: GeneralClickCallBackFunction;
}

export interface RepliesCustomActions {
  deleteReplyCustomAction?: RepliesCustomActionCallback;
  likeReplyCustomAction?: RepliesCustomActionCallback;
}

export type RepliesCustomActionCallback = (
  store: RepliesActionAndDataStore,
  argumentOne: unknown,
) => Promise<void>;

export type PostCreationCustomActions = {
  editPostCustomAction?: PostCreationCustomActionCallback;
  postFeedCustomAction?: PostCreationCustomActionCallback;
};

export type PostCreationCustomActionCallback = (
  store: PostCreationActionAndDataStore,
) => Promise<void>;
