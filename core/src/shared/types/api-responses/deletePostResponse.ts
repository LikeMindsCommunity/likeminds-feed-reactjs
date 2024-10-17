import {
  DeletePost,
  LMResponseType,
  DeleteComment,
} from "@likeminds.community/feed-js-beta";

export interface DeletePostResponse extends LMResponseType<DeletePost> {}
export interface DeleteCommentResponse extends LMResponseType<DeleteComment> {}
