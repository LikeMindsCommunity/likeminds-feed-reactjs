import { CSSProperties } from "react";

export interface LMPostHeaderStyles {
  title?: CSSProperties;
  customTitle?: CSSProperties;
  avatar?: CSSProperties;
  editBadge?: CSSProperties;
  editBadgeCustomText?: string;
  postBadgeText?: string;
}

export interface LMPostPollDialogStyles {
  pollQuestionsStyle?: CSSProperties;
  pollOptionsStyle?: CSSProperties;
  pollExpiryTimeStyle?: CSSProperties;
  pollAdvancedOptionTextStyle?: CSSProperties;
  pollAdvanceOptionsSwitchStyle?: CSSProperties;
  pollDropDownMenuStyles?: CSSProperties;
}

export interface LMPostPollFeedStyles {
  pollQuestionStyles?: React.CSSProperties;
  pollOptionSelectedColor?: string;
  pollOptionOtherColor?: string;
  votesCountStyles?: React.CSSProperties;
  memberVotedCountStyles?: React.CSSProperties;
  pollInfoStyles?: React.CSSProperties;
  submitButtonStyles?: React.CSSProperties;
  allowAddPollOptionButtonStyles?: React.CSSProperties;
  editPollOptionsStyles?: React.CSSProperties;
  clearPollOptionsStyles?: React.CSSProperties;
}

export interface LMFeedCustomIcons {
  postLikesNormalCustomIcon?: () => JSX.Element;
  postLikesLikedCustomIcon?: () => JSX.Element;
  postCommentsCustomIcon?: () => JSX.Element;
  repliesLikesNormalCustomIcon?: () => JSX.Element;
  repliesLikesLikedCustomIcon?: () => JSX.Element;
  repliesCommentsCustomIcon?: () => JSX.Element;
  postPinCustomIcon?: () => JSX.Element;
  createPostFooterImageIcon?: () => JSX.Element;
  createPostFooterVideoIcon?: () => JSX.Element;
  createPostFooterDocumentIcon?: () => JSX.Element;
  createPostDialogBoxImageIcon?: () => JSX.Element;
  createPostDialogBoxVideoIcon?: () => JSX.Element;
  createPostDialogBoxDocumentIcon?: () => JSX.Element;
  notificationBellCustomIcon?: () => JSX.Element;
  postCommentCustomIcon?: () => JSX.Element;
  goBackCustomIcon?: () => JSX.Element;
}

export interface LMPostTopicsStyles {
  topicStyles?: CSSProperties;
  topicWrapperStyles?: CSSProperties;
}

export interface LMFeedCreatePostStyles {
  // custom styles

  // custom properties
  dialogHeading?: string;
}
