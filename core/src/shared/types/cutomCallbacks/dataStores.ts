/* eslint-disable @typescript-eslint/no-explicit-any */
import { LMFeedCreatePostMediaUploadMode } from "../../enums/lmCreatePostMediaHandlingMode";

import { Activity } from "../models/Activity";
// import { Attachment } from "../models/attachment";
import { Community } from "../models/community";
import { User } from "../models/member";
import { OgTag } from "../models/ogTag";

import { Post } from "../models/post";
import { Reply } from "../models/replies";
import { Topic } from "../models/topic";
import { PollOption, AdvancedPollOptions } from "../../../hooks/useCreatePost";
import { WidgetResponse } from "../../utils";
import { MemberRights } from "@likeminds.community/feed-js-beta";
import { Report } from "../models/report";
import { Comment } from "../models/comment";
import { GroupReport } from "../models/groupReport";

export interface FeedListsDataStore {
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  topics: Record<string, Topic>;
  setTopics: React.Dispatch<React.SetStateAction<Record<string, Topic>>>;
  widgets: Record<string, any>;
  setWidgets: React.Dispatch<React.SetStateAction<Record<string, any>>>;
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
  widgets: Record<string, any>;
  setWidgets: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setTopics: React.Dispatch<React.SetStateAction<Record<string, Topic>>>;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
}
export interface FeedPostDetailsDefaultActions {
  addNewComment: (comment: Reply, userMap: Record<string, User>) => void;
  removeAComment: (id: string) => void; //
  updateReplyOnPostReply: (id: string) => void;
  updateReply: (comment: Reply, usersMap: Record<string, User>) => void; //
  likeReply: (id: string) => Promise<void>; //
  likePost: (id: string) => Promise<void>; //
  pinPost: (id: string) => Promise<void>; //
  deletePost: (id: string) => Promise<void>; //
  getNextPage: () => Promise<void>;
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

export interface NotificationsDefaultActions {
  handleNotification: (id: string) => void;
  getNotifications: () => Promise<void>;
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

export interface TopicsDefaultAction {
  setSearchKey: React.Dispatch<string>;
  updateCheckedTopics: (topic: Topic) => void;
  clearAllCheckedTopics: () => void;
  getNextPage: () => Promise<void>;
}

export interface UserDataStore {
  lmFeedUser: User | null;
  logOutUser: (() => void) | null;
  lmFeedUserCurrentCommunity: Community | null;
}

export interface GeneralDataStore {
  displaySnackbarMessage?: (message: string) => void;
  closeSnackbar?: () => void;
  showSnackbar?: boolean;
  message?: string;
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
export interface RepliesDefaultAction {
  deleteReply: (id: string) => Promise<void>;
  likeReply: (id: string) => Promise<void>;
  updateReply: (comment: Reply, usersMap: Record<string, User>) => void;
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
  isAnonymousPost: boolean;
  changeAnonymousPostStatus: (value: boolean) => void;

  openCreatePollDialog: boolean;
  setOpenCreatePollDialog: React.Dispatch<React.SetStateAction<boolean>>;
  pollOptions: PollOption[];
  pollText: string;
  pollExpirationDate: number | null;
  advancedOptions: AdvancedPollOptions;
  validatePoll: boolean;
  previewPoll: boolean;
  setPreviewPoll: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PostCreationDefaultActions {
  postFeed: (customWidgets?: Record<string, any>[]) => Promise<void>;
  editPost: (customWidgets?: Record<string, any>[]) => Promise<void>;
}

export interface ApplicationGeneralsStore {
  userDataStore: UserDataStore;
  generalDataStore: GeneralDataStore;
}

export interface PollCreationDataStore {
  pollData: WidgetResponse | null;
  hasSelectedOption: boolean;
  isAddOptionDialogOpen: boolean;
  showSubmitVoteButton: boolean;
  showAddOptionButton: boolean;
  resultScreenDialogOpen: boolean;
  hasMultiOptionSelect: React.MutableRefObject<boolean>;
  pollResultSelectedTab: number;
  totalMultipleOptions: number;
  newOption: string;
  voteDetails: { users: (User | undefined)[] } | null;
  pollOptions: PollOption[];
  totalVotesCount: number;
  isEditMode: boolean;
}

export interface PollCreationDefaultActions {
  handleAddOptionDialog: (toggle: boolean) => void;
  setResultScreenDialogOpenFunction: (toggle: boolean) => void;
  setPollResultSelectedTabFunction: (tab: number) => void;
  setNewOptionFunction: (option: string) => void;
  handleOptionClick: (index: number) => void;
  handleAddOptionSubmit: () => void;
  submitVoteHandler: () => void;
  setIsEditModeFunction: (toggle: boolean) => void;
}

export interface ModerationDataStore {
  selectedTab: string;
  isPostApprovalEnabled: boolean;
  reports: GroupReport[];
  posts: Record<string, Post>;
  comments: Record<string, Comment>;
  users: Record<string, User>;
  widgets: Record<string, unknown>;
  topics: Record<string, Topic>;
  memberRights: MemberRights[];
  isEditPermissionDialogOpen: boolean;
  modifiedRights: MemberRights[];
  customTitle: string;
  currentReport: GroupReport | null;
}

export interface ModerationDefaultActions {
  selectTab: (tab: string) => void;
  handleOnApprovedPostClicked: (reportIds: number[]) => Promise<void>;
  handleOnRejectedPostClicked: (reportIds: number[]) => Promise<void>;
  onApprovedCallback: (groupReport: GroupReport) => Promise<void>;
  onRejectedCallback: (groupReport: GroupReport, postId: string) => Promise<void>;
  editMemberPermissionsHandler: (uuid: string) => Promise<void>;
  updateMemberRightsHandler: () => Promise<void>;
  setIsEditPermissionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModifiedRights: React.Dispatch<React.SetStateAction<MemberRights[]>>;
  setCustomTitle: React.Dispatch<React.SetStateAction<string>>;
  setCurrentReport: React.Dispatch<React.SetStateAction<GroupReport | null>>;
  handleHeaderLeadingTap: () => void;
  handleHeaderTextTap: () => void;
  handleHeaderTrailingTap: () => void;
}
