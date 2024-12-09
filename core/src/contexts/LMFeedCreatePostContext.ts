import { MutableRefObject, createContext } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { OgTag } from "../shared/types/models/ogTag";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";

import { PollOption } from "../hooks/useCreatePost";
import {
  ZeroArgVoidReturns,
  TwoArgVoidReturns,
  OneArgVoidReturns,
} from "../hooks/useInputs";
import { AdvancedPollOptions } from "../hooks/useCreatePost";
import { SelectChangeEvent } from "@mui/material";

interface LMFeedCreatePostContextInterface {
  postText?: string | null;
  question?: string | null;
  setQuestionText?: (text: string) => void;
  setPostText?: (text: string) => void;
  mediaList?: File[];
  addMediaItem?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeMedia?: (index: number) => void;
  clearMedia?: () => void;
  mediaUploadMode?: LMFeedCreatePostMediaUploadMode;
  changeMediaUploadMode?: (mode: LMFeedCreatePostMediaUploadMode) => void;
  textFieldRef?: MutableRefObject<HTMLDivElement | null>;
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  postFeed?: () => Promise<void>;
  editPost?: () => Promise<void>;
  ogTag?: OgTag | null;
  openCreatePostDialog?: boolean;
  setOpenCreatePostDialog?: React.Dispatch<boolean>;
  temporaryPost?: Post | null;
  clearPollFunction: () => void;
  selectedTopicIds?: string[];
  setSelectedTopicIds?: React.Dispatch<string[]>;
  preSelectedTopics?: Topic[];
  setPreSelectedTopics?: React.Dispatch<Topic[]>;
  showOGTagViewContainer?: boolean;
  closeOGTagContainer?: () => void;
  createPostComponentClickCustomCallback?: ComponentDelegatorListener;
  addThumbnailReel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addReel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tempReel: File[];
  tempReelThumbnail: File[];
  removeThumbnailReel: () => void;
  removeAddReel: () => void;
  isAnonymousPost: boolean;
  changeAnonymousPostStatus: () => void;

  openCreatePollDialog?: boolean;
  setOpenCreatePollDialog?: React.Dispatch<boolean>;
  pollOptions: PollOption[];
  addPollOption: ZeroArgVoidReturns;
  updatePollOption: TwoArgVoidReturns<string, number>;
  removePollOption: OneArgVoidReturns<number>;
  changePollText: OneArgVoidReturns<React.ChangeEvent<HTMLTextAreaElement>>;
  pollText: string;
  updatePollExpirationDate: OneArgVoidReturns<number | null>;
  pollExpirationDate: number | null;
  advancedOptions: AdvancedPollOptions;
  validatePoll: boolean;
  previewPoll: boolean;
  setPreviewPoll: React.Dispatch<boolean>;
  updateAdvancedOptions: OneArgVoidReturns<
    React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>
  >;
  pollExpiryTimeClickFunction: () => void;
}
export const LMFeedCreatePostContext =
  createContext<LMFeedCreatePostContextInterface>(
    {} as LMFeedCreatePostContextInterface,
  );
