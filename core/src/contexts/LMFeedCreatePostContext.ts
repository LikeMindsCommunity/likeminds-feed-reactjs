import { MutableRefObject, createContext } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { OgTag } from "../shared/types/models/ogTag";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
interface LMFeedCreatePostContextInterface {
  postText?: string | null;
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
}
export const LMFeedCreatePostContext =
  createContext<LMFeedCreatePostContextInterface>(
    {} as LMFeedCreatePostContextInterface,
  );
