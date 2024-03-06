import { CSSProperties, createContext } from "react";
import {
  LMPostFooterStyles,
  LMPostHeaderStyles,
  LMPostTopicsStyles,
} from "../shared/types/customProps/styleProps";

export interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
  topicBlocksWrapperStyles?: CSSProperties;
  LMPostHeaderStyles?: LMPostHeaderStyles;
  LMPostFooterStyles?: LMPostFooterStyles;
  LMPostTopicStyles?: LMPostTopicsStyles;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});
