import {
  AddPost,
  EditPost,
  LMResponseType,
} from "@likeminds.community/feed-js";

export interface AddPostResponse extends LMResponseType<AddPost> {}

export interface EditPostResponse extends LMResponseType<EditPost> {}
