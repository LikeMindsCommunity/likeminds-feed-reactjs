import { MutableRefObject, createContext } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
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
}
export const LMFeedCreatePostContext =
  createContext<LMFeedCreatePostContextInterface>({});
