/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../models/member";
import { Post } from "../models/post";
import { Topic } from "../models/topic";
export interface GetUniversalFeedResponse {
  data: {
    posts: Post[];
    topics: Record<string, Topic>;
    users: Record<string, User>;
    widgets: Record<string, any>;
  };
  success: boolean;
}
