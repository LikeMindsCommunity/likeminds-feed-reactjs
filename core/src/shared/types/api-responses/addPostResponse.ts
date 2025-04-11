import {
  AddPost,
  EditPost,
  LMResponseType,
} from "@likeminds.community/feed-js-beta";

export interface AddPostResponse extends LMResponseType<AddPost> {}

export interface EditPostResponse extends LMResponseType<EditPost> {}
