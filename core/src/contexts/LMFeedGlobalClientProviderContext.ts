import React from "react";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { LMFeedCustomEvents } from "../shared/customEvents";

interface GlobalChatProviderContextInterface {
  lmFeedclient: LMClient | null;
  customEventClient?: LMFeedCustomEvents;
}

export default React.createContext<GlobalChatProviderContextInterface>({
  lmFeedclient: null,
});
