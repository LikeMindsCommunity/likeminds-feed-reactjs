import React from "react";
import { Post } from "../types/models/post";
import { Topic } from "../types/models/topic";
import { User } from "../types/models/member";
import { Reply } from "../types/models/replies";

export const FeedPostContext = React.createContext<FeedPostContextInterface>({
  post: null,
  topics: null,
  users: null,
});

interface FeedPostContextInterface {
  post: Post | null;
  topics: Record<string, Topic> | null;
  users: Record<string, User> | null;
  getNextPage?: () => Promise<void>;
  loadNextPage?: boolean;
  replies?: Reply[];
}
