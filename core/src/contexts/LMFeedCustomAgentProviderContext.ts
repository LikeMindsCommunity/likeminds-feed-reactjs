import React, { createContext } from "react";
import {
  LMFeedCustomIcons,
  LMPostHeaderStyles,
  LMPostPollDialogStyles,
  LMPostPollFeedStyles,
  LMPostPollUniversalFeedStyles,
  LMFeedPostPollResultScreenStyles,
} from "../shared/types/customProps/styleProps";
import { CustomComponents } from "../shared/types/customProps/customComponentsProps";
import {
  FeedListCustomActions,
  FeedPostDetailsCustomActions,
  GeneralClickCallbacks,
  PostCreationCustomActions,
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
  LMPostHeaderStyles?: LMPostHeaderStyles; //
  LMFeedCustomIcons?: LMFeedCustomIcons; //
  CustomComponents?: CustomComponents; //
  FeedListCustomActions?: FeedListCustomActions; //
  FeedPostDetailsCustomActions?: FeedPostDetailsCustomActions; //
  GeneralCustomCallbacks?: GeneralClickCallbacks;
  TopicsCustomCallbacks?: TopicsCustomActions;
  RepliesCustomCallbacks?: RepliesCustomActions;
  PostCreationCustomCallbacks?: PostCreationCustomActions;
  postComponentClickCustomCallback?: PostComponentCustomClickEventDelegatorCallback;
  createPostComponentClickCustomCallback?: CreatePostComponentCustomClickEventDelegatorCallback;
  topicComponentClickCustomCallback?: TopicComponentCustomClickEventDelegatorCallback;
  memberComponentClickCustomCallback?: MemberComponentCustomClickEventDelegatorCallback;

  onPollExpiryTimeClickedCustomCallback?: PollExpiryTimeCustomClickCallback;
  onAddOptionClickedCustomCallback?: AddOptionCustomClickEventDelegatorCallback;
  onPollOptionClearedCustomCallback?: PollOptionClearedCustomClickEventDelegatorCallback;
  onPollCompleteClickedCustomCallback?: PollCompleteCustomClickEventDelegatorCallback;

  isAnonymousPostAllowed?: boolean;
  hintTextForAnonymous?: string;
  LMPostPollDialogStyles?: LMPostPollDialogStyles;
  LMPostPollFeedStyles?: LMPostPollFeedStyles;
  LMPostPollUniversalFeedStyles?: LMPostPollUniversalFeedStyles;
  LMFeedPostPollResultScreenStyles?: LMFeedPostPollResultScreenStyles;

  onSubmitButtonClickedCustomCallback?: SubmitButtonClickEventDelegatorCallback;
  onAddPollOptionsClickedCustomCallback?: AddPollOptionsClickEventDelegatorCallback;
  onPollEditClickedCustomCallback?: PollEditClickEventDelegatorCallback;
  onPollClearClickedCustomCallback?: PollClearClickEventDelegatorCallback;
  onPollOptionClickedCustomCallback?: PollOptionClickEventDelegatorCallback;
  onPollFeedSubmitButtonClicked?: PollFeedSubmitButtonClickEventDelegatorCallback;

  onOptionSelectedCustomCallback?: onOptionSelectedEventDelegatorCallback;
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

export type PollExpiryTimeCustomClickCallback = () => void;
export type AddOptionCustomClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;
export type PollOptionClearedCustomClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;
export type PollCompleteCustomClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;

export type SubmitButtonClickEventDelegatorCallback = (
  pollOptions: PollOptions[],
  event: React.MouseEvent,
) => void;
export type AddPollOptionsClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;
export type PollEditClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;
export type PollClearClickEventDelegatorCallback = (
  event: React.MouseEvent,
) => void;
export type PollOptionClickEventDelegatorCallback = (
  option: PollOptions,
  event: React.MouseEvent,
) => void;
export type onOptionSelectedEventDelegatorCallback = () => void;
export type PollFeedSubmitButtonClickEventDelegatorCallback = () => void;

export type PollOptions = {
  id: string;
  text: string;
  isSelected: boolean;
  percentage: number;
  uuid: string;
  voteCount: number;
};
