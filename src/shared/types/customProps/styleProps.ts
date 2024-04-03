import { CSSProperties, ReactNode } from "react";

export interface LMPostHeaderStyles {
  title?: CSSProperties;
  customTitle?: CSSProperties;
  avatar?: CSSProperties;
  editBadge?: CSSProperties;
  editBadgeCustomText?: string;
  postBadgeText?: string;
}

export interface LMPostBodyStyles {
  heading?: CSSProperties;
  content?: CSSProperties;
}

export interface LMPostFooterStyles {
  likesCountStyles?: CSSProperties;
  commentsCountStyles?: CSSProperties;
  likeButtonCustom?: () => JSX.Element;
  commentButtonCustom?: () => JSX.Element;
  // likeActionCallBack?: () => void;
  // commentActionCallBack?: () => void;
}

export interface LMPostTopicsStyles {
  topicStyles?: CSSProperties;
  topicWrapperStyles?: CSSProperties;
}
export interface CustomComponents {
  PostViewHeader: ReactNode;
  PostViewFooter: ReactNode;
  PostViewWrapper: ReactNode;
  PostViewBody: ReactNode;
  TopicDropDown: ReactNode;
  PostView: ReactNode;
}

export interface LMFeedCreatePostStyles {
  // custom styles

  // custom properties
  dialogHeading?: string;
}
