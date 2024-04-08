import { MutableRefObject, createContext } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { OgTag } from "../shared/types/models/ogTag";
import { Post } from "../shared/types/models/post";
interface LMFeedCreatePostContextInterface {
  postText?: string;
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
  ogTag?: OgTag | null;
  openCreatePostDialog?: boolean;
  setOpenCreatePostDialog?: React.Dispatch<boolean>;
  temporaryPost?: Post | null;
  selectedTopicIds?: string[];
  setSelectedTopicIds?: React.Dispatch<string[]>;
}
export const LMFeedCreatePostContext =
  createContext<LMFeedCreatePostContextInterface>({});
