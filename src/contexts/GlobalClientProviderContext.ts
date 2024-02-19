import React from "react";
import { LMClient } from "../types/DataLayerExportsTypes";

interface GlobalChatProviderContextInterface {
  lmFeedclient: LMClient | null;
}

export default React.createContext<GlobalChatProviderContextInterface>({
  lmFeedclient: null,
});
