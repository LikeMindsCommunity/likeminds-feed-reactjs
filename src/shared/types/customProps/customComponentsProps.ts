import { ReactNode } from "react";
import { Topic } from "../models/topic";
import { NavigateFunction } from "react-router-dom";

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
  PostDetailsView?: ReactNode;
}

export interface CustomCallbacks {
  likeActionCallback?: FN;
  likeTextCountClickCallback?: FN;
  commentIconClickCallback?: FN;
  commentTextCountClickCallback?: FN;
  commentUsernameClickCallback?: FN;
  commentTextContentClickCallback?: FN;
  commentLikeActionCallback?: FN;
  replyLikeActionCallback?: FN;
  replyActionButtonClickCallback?: FN;
  repliesCountClickCallback?: FN;
  replyUsernameClickCallback?: FN;
  replyTextContentClickCallback?: FN;
  postTopicTileClickCallback?: FN;
  postHeaderAvatarClickCallback?: FN;
  postHeaderTitleClickCallback?: FN;
  postHeaderCustomTitleClickCallback?: FN;
  postFooterClickCallback?: FN;
  postHeadingClickCallback?: FN;
}

type FN = (navigate: NavigateFunction, ...args: unknown[]) => unknown;
