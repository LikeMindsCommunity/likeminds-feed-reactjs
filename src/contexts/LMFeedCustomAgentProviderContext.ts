import { CSSProperties, createContext } from "react";
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

export interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
  topicBlocksWrapperStyles?: CSSProperties;
  LMPostHeaderStyles?: LMPostHeaderStyles;
  LMPostBodyStyles?: LMPostBodyStyles;
  LMPostFooterStyles?: LMPostFooterStyles;
  LMPostTopicStyles?: LMPostTopicsStyles;
  CustomComponents?: CustomComponents;
  CustomCallbacks?: CustomCallbacks;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});
