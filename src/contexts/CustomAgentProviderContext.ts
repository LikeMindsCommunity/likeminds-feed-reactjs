import { CSSProperties, createContext } from "react";
import { LMPostHeaderStyles } from "../types/customProps/styleProps";

export interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
  topicBlocksWrapperStyles?: CSSProperties;
  LMPostHeaderStyles?: LMPostHeaderStyles;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});
