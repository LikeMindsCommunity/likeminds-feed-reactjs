import React from "react";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { User } from "../shared/types/models/member";
import { Report } from "../shared/types/models/report";
import { LMFeedReportStatus } from "../shared/enums/lmFilterType";
import { Comment } from "../shared/types/models/comment";
import { MemberRights } from "@likeminds.community/feed-js";

export const FeedModerationContext =
  React.createContext<FeedModerationInterface>({
    selectedTab: "approval",
    selectTab: () => {},
    isPostApprovalEnabled: false,
    reports: [],
    posts: [],
    users: {},
    comments: [],
    widgets: {},
    topics: {},
    onApprovedOrRejectPostClicked: async () => Promise.resolve(),
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
  });

interface FeedModerationInterface {
  selectedTab: string;
  selectTab: (tab: string) => void;
  isPostApprovalEnabled: boolean;
  reports: Report[];
  posts: Post[];
  comments: Comment[];
  users: Record<string, User>;
  widgets: Record<string, unknown>;
  topics: Record<string, Topic>;
  onApprovedOrRejectPostClicked: (
    reportIds: number[],
    reportStatus: LMFeedReportStatus,
  ) => Promise<void>;
  onApprovedCallback: (report: Report) => Promise<void>;
  onRejectedCallback: (report: Report) => Promise<void>;
  editMemberPermissionsHandler: (report: Report) => Promise<void>;
  updateMemberRightsHandler: () => Promise<void>;
  memberRights: MemberRights[];
  isEditPermissionDialogOpen: boolean;
  setIsEditPermissionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modifiedRights: MemberRights[];
  setModifiedRights: React.Dispatch<React.SetStateAction<MemberRights[]>>;
  customTitle: string;
  setCustomTitle: React.Dispatch<React.SetStateAction<string>>;
  currentReport: Report | null;
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>;
}
