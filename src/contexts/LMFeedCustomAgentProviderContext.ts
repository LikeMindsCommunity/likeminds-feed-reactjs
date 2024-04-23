import React, { CSSProperties, createContext } from "react";
import {
  LMPostBodyStyles,
  LMPostFooterStyles,
  LMPostHeaderStyles,
  LMPostTopicsStyles,
} from "../shared/types/customProps/styleProps";
import {
  CustomCallbacks,
  CustomComponents,
} from "../shared/types/customProps/customComponentsProps";
import {
  FeedListCustomActions,
  FeedPostDetailsCustomActions,
  GeneralClickCallbacks,
  NotificationsCustomActions,
  PostCreationCustomActions,
  RepliesCustomActions,
  TopicsCustomActions,
} from "../shared/types/cutomCallbacks/callbacks";
import { FeedListActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";
// import { FeedListActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";

export interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
  topicBlocksWrapperStyles?: CSSProperties;
  LMPostHeaderStyles?: LMPostHeaderStyles;
  LMPostBodyStyles?: LMPostBodyStyles;
  LMPostFooterStyles?: LMPostFooterStyles;
  LMPostTopicStyles?: LMPostTopicsStyles;
  CustomComponents?: CustomComponents;
  CustomCallbacks?: CustomCallbacks;
  FeedListCustomActions?: FeedListCustomActions;
  FeedPostDetailsCustomActions?: FeedPostDetailsCustomActions;
  GeneralCustomCallbacks?: GeneralClickCallbacks;
  TopicsCustomCallbacks?: TopicsCustomActions;
  RepliesCustomCallbacks?: RepliesCustomActions;
  PostCreationCustomCallbacks?: PostCreationCustomActions;
  NotificationsCustomCallbacks?: NotificationsCustomActions;
  postComponentClickCustomCallback?: (
    store: FeedListActionsAndDataStore,
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});
