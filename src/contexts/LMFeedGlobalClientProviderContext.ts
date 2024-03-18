import React from "react";
import { LMClient } from "../shared/types/dataLayerExportsTypes";

interface GlobalChatProviderContextInterface {
  lmFeedclient: LMClient | null;
}

export default React.createContext<GlobalChatProviderContextInterface>({
  lmFeedclient: null,
});
