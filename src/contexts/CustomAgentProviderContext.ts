import { createContext } from "react";

interface CustomAgentProviderInterface {
  likeActionCall?: () => void;
}
export const CustomAgentProviderContext =
  createContext<CustomAgentProviderInterface>({});
