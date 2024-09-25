import {
  EditComment,
  LMResponseType,
  PostComment,
  PostReply,
} from "@likeminds.community/feed-js-beta";

export interface PostCommentResponse extends LMResponseType<PostComment> {}
export interface EditCommentResponse extends LMResponseType<EditComment> {}

export interface PostReplyResponse extends LMResponseType<PostReply> {}
