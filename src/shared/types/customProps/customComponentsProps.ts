import { ReactNode } from "react";
import { Topic } from "../models/topic";

export interface CustomComponents {
  PostViewHeader?: ReactNode;
  PostViewFooter?: ReactNode;
  PostViewTopicsWrapper?: ReactNode;
  PostViewBody?: ReactNode;
  TopicDropDown?: ReactNode;
  Reply?: ReactNode;
  PostView?: ReactNode;
  RepliesScroller?: ReactNode;
  PostTopicTile?: React.FC<{ key: string; topic: Topic }>;
}

export interface CustomCallbacks {
  likeActionCallback?: FN;
  likeTextCountClickCallback?: FN;
  commentIconClickCallback?: FN;
  commentTextCountClickCallback?: FN;
  postFooterClickCallback?: FN;
  commentUsernameClickCallback?: FN;
  commentTextContentClickCallback?: FN;
  commentLikeActionCallback?: FN;
  commentLikeTextClickCallback?: FN;
  replyActionButtonClickCallback?: FN;
  repliesCountClickCallback?: FN;
  replyUsernameClickCallback?: FN;
  replyTextContentClickCallback?: FN;
  postFooterTileClickCallback?: FN;
  postBodyClickCallback?: FN;
  postHeaderClickCallback?: FN;
  postTopicTileClickCallback?: FN;
  postCommentTileClickCallback?: FN;
  commentReplyTileClickCallback?: FN;
}

type FN = (...args: unknown[]) => unknown;
