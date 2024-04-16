import React from "react";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { User } from "../shared/types/models/member";
import { Reply } from "../shared/types/models/replies";

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
  deletePost?: (id: string) => Promise<void>;
  pinPost?: (id: string) => Promise<void>;
}
