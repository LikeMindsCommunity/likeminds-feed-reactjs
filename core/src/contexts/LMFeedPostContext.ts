/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { User } from "../shared/types/models/member";
import { Reply } from "../shared/types/models/replies";
import { ClickNavigator } from "../shared/types/customProps/routes";
// import { FeedListActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";

export const FeedPostContext = React.createContext<FeedPostContextInterface>({
  post: null,
  topics: null,
  users: null,
  widgets: null,
});

interface FeedPostContextInterface {
  post: Post | null;
  topics: Record<string, Topic> | null;
  users: Record<string, User> | null;
  widgets: Record<string, any> | null;
  getNextPage?: () => Promise<void>;
  loadNextPage?: boolean;
  replies?: Reply[];
  deletePost?: (id: string) => Promise<void>;
  pinPost?: (id: string) => Promise<void>;
  addNewComment?: (comment: Reply, userMap: Record<string, User>) => void;
  removeAComment?: (id: string) => void;
  updateReplyOnPostReply?: (id: string) => void;
  updateReply?: (comment: Reply, usersMap: Record<string, User>) => void;
  likeReply?: (id: string) => void;
  likePost?: (id: string) => void;
  postComponentClickCustomCallback?: (
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
  clickNavigator?: ClickNavigator;
  hidePost?: (postId: string) => Promise<void>;
}
