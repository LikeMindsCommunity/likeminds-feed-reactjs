/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import { Topic } from "../shared/types/models/topic";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { ClickNavigator } from "../shared/types/customProps/routes";

export const LMFeedDataContext = createContext<LMFeedDataContextInterface>({});

interface LMFeedDataContextInterface {
  topics?: Record<string, Topic>;
  widgets?: Record<string, any>;
  selectedTopics?: string[];
  setSelectedTopics?: React.Dispatch<string[]>;
  loadMoreFeeds?: boolean;
  getNextPage?: () => Promise<void>;
  feedList?: Post[];
  feedUsersList?: Record<string, User>;
  deletePost?: (id: string) => Promise<void>;
  pinPost?: (id: string) => Promise<void>;
  likePost?: (id: string) => Promise<void>;
  clickNavigator?: ClickNavigator;
  postComponentClickCustomCallback?: (
    // feedListStore: FeedListActionsAndDataStore,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
}
