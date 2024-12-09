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
  PostCreationCustomActions,
  PostPollCustomActions,
  RepliesCustomActions,
  TopicsCustomActions,
} from "../shared/types/cutomCallbacks/callbacks";
import {
  FeedListActionsAndDataStore,
  FeedPostDetailsActionsAndDataStore,
  PostCreationActionsAndDataStore,
  TopicsActionsAndDataStore,
} from "../shared/types/cutomCallbacks/dataProvider";

export interface CustomAgentProviderInterface {
  LMPostHeaderStyles?: LMPostHeaderStyles;
  LMFeedCustomIcons?: LMFeedCustomIcons;
  CustomComponents?: CustomComponents;
  FeedListCustomActions?: FeedListCustomActions;
  FeedPostDetailsCustomActions?: FeedPostDetailsCustomActions;
  GeneralCustomCallbacks?: GeneralClickCallbacks;
  TopicsCustomCallbacks?: TopicsCustomActions;
  RepliesCustomCallbacks?: RepliesCustomActions;
  PostCreationCustomCallbacks?: PostCreationCustomActions;
  PostPollCustomCallbacks?: PostPollCustomActions;
  postComponentClickCustomCallback?: PostComponentCustomClickEventDelegatorCallback;
  createPostComponentClickCustomCallback?: CreatePostComponentCustomClickEventDelegatorCallback;
  topicComponentClickCustomCallback?: TopicComponentCustomClickEventDelegatorCallback;
  memberComponentClickCustomCallback?: MemberComponentCustomClickEventDelegatorCallback;

  isAnonymousPostAllowed?: boolean;
  hintTextForAnonymous?: string;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});

export type PostComponentCustomClickEventDelegatorCallback = (
  store: FeedListActionsAndDataStore | FeedPostDetailsActionsAndDataStore,
  event: React.MouseEvent,
) => void;

export type TopicComponentCustomClickEventDelegatorCallback = (
  store: TopicsActionsAndDataStore,
  event: React.MouseEvent,
) => void;
export type CreatePostComponentCustomClickEventDelegatorCallback = (
  store: PostCreationActionsAndDataStore,
  event: React.MouseEvent,
) => void;
export type MemberComponentCustomClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;

export type PollOptions = {
  id: string;
  text: string;
  isSelected: boolean;
  percentage: number;
  uuid: string;
  voteCount: number;
};
