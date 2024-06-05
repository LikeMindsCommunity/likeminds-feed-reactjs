import { ReactNode } from "react";
import { Topic } from "../models/topic";
import { NavigateFunction } from "react-router-dom";
import { LMFeedAttachmentsProps } from "../../components/LMFeedAttachments";
import { LMFeedReplyTextAreaProps } from "../../components/LMFeedReplyTextArea";
import { LMFeedReplyEditTextAreaProps } from "../../components/LMFeedReplyEditTextArea";

export interface CustomComponents {
  CustomPostViewHeader?: ReactNode;
  CustomPostViewFooter?: ReactNode;
  CustomPostViewTopicsWrapper?: ReactNode;
  CustomPostViewBody?: ReactNode;
  CustomTopicDropDown?: ReactNode;
  CustomReply?: ReactNode;
  CustomPostView?: ReactNode;
  CustomRepliesScroller?: ReactNode;
  CustomCommentsScroller?: ReactNode;
  CustomPostTopicTile?: React.FC<{ key: string; topic: Topic }>;
  CustomPostDetailsView?: ReactNode; //
  CustomPostViewAttachment?: React.FC<LMFeedAttachmentsProps>;
  // CustomPDFViewer?: ReactNode;
  CustomEditReplyTextArea?: React.FC<LMFeedReplyEditTextAreaProps>;
  CustomPostReplyTextArea?: React.FC<LMFeedReplyTextAreaProps>;
  CustomCreatePostTextArea?: ReactNode;
  CustomCreatePostDialog?: ReactNode;
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
