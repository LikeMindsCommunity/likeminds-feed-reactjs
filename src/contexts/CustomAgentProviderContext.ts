import { CSSProperties, createContext } from "react";

interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
  topicBlocksWrapperStyles?: CSSProperties;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});
