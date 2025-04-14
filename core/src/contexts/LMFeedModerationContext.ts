import React from "react";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { User } from "../shared/types/models/member";
import { GroupReport } from "../shared/types/models/groupReport";
import { Comment } from "../shared/types/models/comment";
import { MemberRights } from "@likeminds.community/feed-js";

export const FeedModerationContext =
  React.createContext<FeedModerationInterface>({
    selectedTab: "approval",
    selectTab: () => {},
    isPostApprovalEnabled: false,
    reports: [],
    posts: {},
    users: {},
    comments: {},
    widgets: {},
    topics: {},
    handleOnApprovedPostClicked: async () => Promise.resolve(),
    handleOnRejectedPostClicked: async () => Promise.resolve(),
    onApprovedCallback: async () => Promise.resolve(),
    onRejectedCallback: async () => Promise.resolve(),
    editMemberPermissionsHandler: async () => Promise.resolve(),
    updateMemberRightsHandler: async () => Promise.resolve(),
    memberRights: [],
    isEditPermissionDialogOpen: false,
    setIsEditPermissionDialogOpen: () => {},
    modifiedRights: [],
    setModifiedRights: () => {},
    customTitle: "",
    setCustomTitle: () => {},
    currentReport: null,
    setCurrentReport: () => {},
    handleHeaderLeadingTap: () => {},
    handleHeaderTextTap: () => {},
    handleHeaderTrailingTap: () => {},
    loadMoreFeeds: true,
    getNextPage: () => {},
    isLoading: true,
  });

interface FeedModerationInterface {
  selectedTab?: string;
  selectTab?: (tab: string) => void;
  isPostApprovalEnabled?: boolean;
  reports?: GroupReport[];
  posts?: Record<string, Post>;
  comments: Record<string, Comment>;
  users?: Record<string, User>;
  widgets?: Record<string, unknown>;
  topics?: Record<string, Topic>;
  handleOnApprovedPostClicked: (reportIds: number[]) => Promise<void>;
  handleOnRejectedPostClicked: (reportIds: number[]) => Promise<void>;
  onApprovedCallback: (groupReport: GroupReport) => Promise<void>;
  onRejectedCallback: (
    groupReport: GroupReport,
    postId: string,
  ) => Promise<void>;
  editMemberPermissionsHandler: (uuid: string) => Promise<void>;
  updateMemberRightsHandler: () => Promise<void>;
  handleHeaderLeadingTap?: () => void;
  handleHeaderTextTap?: () => void;
  handleHeaderTrailingTap?: () => void;
  memberRights?: MemberRights[];
  isEditPermissionDialogOpen?: boolean;
  setIsEditPermissionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modifiedRights: MemberRights[];
  setModifiedRights: React.Dispatch<React.SetStateAction<MemberRights[]>>;
  customTitle: string;
  setCustomTitle: React.Dispatch<React.SetStateAction<string>>;
  currentReport?: GroupReport | null;
  setCurrentReport: React.Dispatch<React.SetStateAction<GroupReport | null>>;
  loadMoreFeeds?: boolean;
  getNextPage?: () => void;
  isLoading?: boolean;
}
