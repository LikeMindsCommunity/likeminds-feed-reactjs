import { CSSProperties } from "react";

export interface LMPostHeaderStyles {
  title?: CSSProperties;
  customTitle?: CSSProperties;
  avatar?: CSSProperties;
  editBadge?: CSSProperties;
  editBadgeCustomText?: string;
}

export interface LMPostBodyStyles {}

export interface LMPostFooterStyles {
  likesCountStyles?: CSSProperties;
  commentsCountStyles?: CSSProperties;
  likeButtonCustom?: () => JSX.Element;
  commentButtonCustom?: () => JSX.Element;
  likeActionCallBack?: () => void;
  commentActionCallBack?: () => void;
}

export interface LMPostTopicsStyles {
  topicStyles: CSSProperties;
  topicWrapperStyles: CSSProperties;
}
export interface CustomComponents {
  PostViewHeader: () => React.FC;
  PostViewFooter: () => React.FC;
  PostViewWrapper: () => React.FC;
  PostViewBody: () => React.FC;
  TopicDropDown: () => React.FC;
  PostView: () => React.FC;
}
