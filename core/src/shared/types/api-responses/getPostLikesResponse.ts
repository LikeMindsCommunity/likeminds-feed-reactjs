import { User } from "../models/member";

export interface GetPostLikesResponse {
  success: boolean;
  data: {
    likes: Like[];
    topics: Record<string, unknown>;
    totalCount: number;
    userTopics: Record<string, unknown>;
    users: User[];
  };
}

interface Like {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  uuid: string;
}
