import { ReactNode } from "react";
import { Topic } from "../models/topic";
import { LMFeedAttachmentsProps } from "../../components/LMFeedAttachments";
import { LMFeedReplyTextAreaProps } from "../../components/LMFeedReplyTextArea";
import { LMFeedReplyEditTextAreaProps } from "../../components/LMFeedReplyEditTextArea";
import { LMFeedCreatePostMediaUploadMode } from "../../enums/lmCreatePostMediaHandlingMode";

export interface CustomComponents {
  CustomPostViewHeader?: ReactNode;
  CustomPostViewFooter?: ReactNode;
  CustomPostViewTopicsWrapper?: ReactNode;
  CustomPostViewBody?: ReactNode;
  CustomTopicDropDown?: ReactNode;
  CustomReply?: ReactNode;
  CustomPostView?: ReactNode;
  CustomWidgetPostView?: ReactNode;
  CustomRepliesScroller?: ReactNode;
  CustomCommentsScroller?: ReactNode;
  CustomPostTopicTile?: React.FC<{ key: string; topic: Topic }>;
  CustomPostDetailsView?: ReactNode; //
  CustomPostViewAttachment?: React.FC<LMFeedAttachmentsProps>;
  CustomEditReplyTextArea?: React.FC<LMFeedReplyEditTextAreaProps>;
  CustomPostReplyTextArea?: React.FC<LMFeedReplyTextAreaProps>;
  CustomCreatePostTextArea?: ReactNode;
  CustomCreatePostInitiateView?: React.FC<LMCreatePostInitiateViewProps>;
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

type FN = (...args: unknown[]) => unknown;

export interface LMCreatePostInitiateViewProps {
  setOpenCreatePostDialog: (value: boolean) => void;
  changeMediaUploadMode: (mode: LMFeedCreatePostMediaUploadMode) => void;
}
