import React from "react";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { LMFeedAnalytics } from "../shared/analytics";

interface GlobalChatProviderContextInterface {
  lmFeedclient: LMClient | null;
  customEventClient?: LMFeedCustomEvents;
  lmfeedAnalyticsClient?: LMFeedAnalytics;
}

export default React.createContext<GlobalChatProviderContextInterface>({
  lmFeedclient: null,
});
