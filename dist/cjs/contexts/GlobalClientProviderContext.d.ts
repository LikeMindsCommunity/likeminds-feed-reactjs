import React from "react";
import { LMClient } from "../types/DataLayerExportsTypes";
interface GlobalChatProviderContextInterface {
    lmFeedclient: LMClient | null;
}
declare const _default: React.Context<GlobalChatProviderContextInterface>;
export default _default;
