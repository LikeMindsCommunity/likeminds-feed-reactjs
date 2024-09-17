import {
  AddPostRequest,
  LMResponseType,
} from "@likeminds.community/feed-js-beta";
import { User } from "../models/member";
import { Post } from "../models/post";
import { Topic } from "../models/topic";

export interface AddPostResponse extends LMResponseType<AddPostRequest> {}

// export interface AddPostResponse {
//   success: boolean;
//   data: {
//     post: Post;

//     topics: Record<string, Topic>;

//     users: Record<string, User>;
//   };
// }
export interface EditPostResponse {
  success: boolean;
  data: {
    post: Post;

    topics: Record<string, Topic>;

    users: Record<string, User>;
  };
}
