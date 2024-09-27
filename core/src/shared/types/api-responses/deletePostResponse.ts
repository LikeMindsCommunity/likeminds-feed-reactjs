import { DeletePost, LMResponseType } from "@likeminds.community/feed-js";
import { DeleteComment } from "@likeminds.community/feed-js/dist/types/api-responses/deleteCommentResponse";

export interface DeletePostResponse extends LMResponseType<DeletePost> {}
export interface DeleteCommentResponse extends LMResponseType<DeleteComment> {}
