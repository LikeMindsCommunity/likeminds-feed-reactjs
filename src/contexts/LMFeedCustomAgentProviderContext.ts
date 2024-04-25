import React, { createContext } from "react";
import {
  LMFeedCustomIcons,
  LMPostHeaderStyles,
} from "../shared/types/customProps/styleProps";
import { CustomComponents } from "../shared/types/customProps/customComponentsProps";
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

export interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
  LMPostHeaderStyles?: LMPostHeaderStyles;
  LMFeedCustomIcons?: LMFeedCustomIcons;
  CustomComponents?: CustomComponents;
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
