import { LMFeedCreatePostMediaUploadMode } from "../../enums/lmCreatePostMediaHandlingMode";
import { Activity } from "../models/Activity";
import { Community } from "../models/community";
import { User } from "../models/member";
import { OgTag } from "../models/ogTag";

import { Post } from "../models/post";
import { Reply } from "../models/replies";
import { Topic } from "../models/topic";

export interface FeedListsDataStore {
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  topics: Record<string, Topic>;
  setTopics: React.Dispatch<React.SetStateAction<Record<string, Topic>>>;
  loadMoreFeeds: boolean;
  setLoadMoreFeeds: React.Dispatch<React.SetStateAction<boolean>>;
  currentPageCount: number;
  setCurrentPageCount: React.Dispatch<React.SetStateAction<number>>;
  feedList: Post[];
  setFeedList: React.Dispatch<React.SetStateAction<Post[]>>;
  feedUsersList: Record<string, User>;
  setFeedUsersList: React.Dispatch<React.SetStateAction<Record<string, User>>>;
}
export interface FeedListDefaultActions {
  deletePost: (id: string) => Promise<void>;
  pinPost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  getNextPage: () => Promise<void>;
}

export interface FeedPostDetailsStore {
  post: Post | null;
  setPost: React.Dispatch<React.SetStateAction<Post | null>>;
  users: Record<string, User>;
  setUsers: React.Dispatch<React.SetStateAction<Record<string, User>>>;
  replies: Reply[];
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>;
  loadNextPage: boolean;
  setLoadNextPage: React.Dispatch<React.SetStateAction<boolean>>;
  topics: Record<string, Topic>;
  setTopics: React.Dispatch<React.SetStateAction<Record<string, Topic>>>;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
}
export interface NotificationsDataStore {
  notifications: Activity[];
  setNotifications: React.Dispatch<React.SetStateAction<Activity[]>>;
  users: Record<string, User>;
  setUsers: React.Dispatch<React.SetStateAction<Record<string, User>>>;
  shouldLoadMoreNotifications: boolean;
  setShouldLoadMoreNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  notificationPage: number;
  setNotificationPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface TopicDataStore {
  checkedTopics: Topic[];
  setCheckedTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  loadNewTopics: boolean;
  setLoadNewTopics: React.Dispatch<React.SetStateAction<boolean>>;
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  currentPageCount: number;
  setCurrentPageCount: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
}

export interface UserDataStore {
  lmFeedUser: User | null;
  setLmFeedUser: React.Dispatch<React.SetStateAction<User | null>>;
  lmFeedUserCurrentCommunity: Community | null;
  setLmFeedUserCurrentCommunity: React.Dispatch<
    React.SetStateAction<Community | null>
  >;
}

export interface GeneralDataStore {
  showSnackbar: boolean;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export interface RepliesDataStore {
  reply: Reply | null;
  setReply: React.Dispatch<React.SetStateAction<Reply | null>>;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  loadMoreReplies: boolean;
  setLoadMoreReplies: React.Dispatch<React.SetStateAction<boolean>>;
  replies: Reply[];
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>;
  users: Record<string, User>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, User>>>;
}

export interface PostCreationDataStore {
  openCreatePostDialog: boolean;
  setOpenCreatePostDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showOGTagViewContainer: boolean;
  setShowOGTagViewContainer: React.Dispatch<React.SetStateAction<boolean>>;
  text: string | null;
  setText: React.Dispatch<React.SetStateAction<string | null>>;
  temporaryPost: Post | null;
  setTemporaryPost: React.Dispatch<React.SetStateAction<Post | null>>;
  mediaList: File[];
  setMediaList: React.Dispatch<React.SetStateAction<File[]>>;
  selectedTopicIds: string[];
  setSelectedTopicIds: React.Dispatch<React.SetStateAction<string[]>>;
  preSelectedTopics: Topic[];
  setPreSelectedTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  mediaUploadMode: LMFeedCreatePostMediaUploadMode;
  setMediaUploadMode: React.Dispatch<
    React.SetStateAction<LMFeedCreatePostMediaUploadMode>
  >;
  ogTag: OgTag | null;
  setOgtag: React.Dispatch<React.SetStateAction<OgTag | null>>;
  textFieldRef: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export interface ApplicationGeneralsStore {
  userDataStore: UserDataStore;
  generalDataStore: GeneralDataStore;
}
