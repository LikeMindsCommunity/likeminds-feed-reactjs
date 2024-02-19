import React from "react";
import { Post } from "../types/models/post";
import { Topic } from "../types/models/topic";
import { User } from "../types/models/member";

export const FeedPostContext = React.createContext<FeedPostContextInterface>({
  post: null,
  topics: null,
  users: null,
});

interface FeedPostContextInterface {
  post: Post | null;
  topics: Record<string, Topic> | null;
  users: Record<string, User> | null;
}
