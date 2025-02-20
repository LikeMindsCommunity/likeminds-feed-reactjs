import React from "react";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { User } from "../shared/types/models/member";
import { Report } from "../hooks/useModeration";

export const FeedModerationContext =
  React.createContext<FeedModerationInterface>({
    selectedTab: "approval",
    selectTab: () => {},
    isPostApprovalEnabled: false,
    reports: [],
    posts: [],
    users: {},
    widgets: {},
    topics: {},
  });

interface FeedModerationInterface {
  selectedTab: string;
  selectTab: (tab: string) => void;
  isPostApprovalEnabled: boolean;
  reports: Report[];
  posts: Post[];
  users: Record<string, User>;
  widgets: Record<string, unknown>;
  topics: Record<string, Topic>;
}
