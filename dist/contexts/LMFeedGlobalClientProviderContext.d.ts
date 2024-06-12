import React from "react";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { LMFeedAnalytics } from "../shared/analytics";
interface GlobalChatProviderContextInterface {
    lmFeedclient: LMClient | null;
    customEventClient?: LMFeedCustomEvents;
    lmfeedAnalyticsClient?: LMFeedAnalytics;
}
declare const _default: React.Context<GlobalChatProviderContextInterface>;
export default _default;
