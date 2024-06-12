import { PropsWithChildren } from "react";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { UserDetails } from "../hooks/useLMUserProvider";
import { CustomAgentProviderInterface } from "../contexts/LMFeedCustomAgentProviderContext";
import { LMFeedCustomAppRoutes } from "../shared/types/customProps/routes";
import "../assets/scss/styles.scss";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { AnalyticsCallback } from "../shared/types/analyticsCallback";
import { LMCoreCallbacks } from "../shared/LMSDKCoreCallbacks";
export interface LMFeedProps<T> extends CustomAgentProviderInterface {
    client: T;
    showMember?: boolean;
    routes?: LMFeedCustomAppRoutes;
    useParentRouter?: boolean;
    userDetails: UserDetails;
    customEventClient: LMFeedCustomEvents;
    analyticsCallback: AnalyticsCallback;
    LMFeedCoreCallbacks: LMCoreCallbacks;
}
declare function LMFeed({ useParentRouter, LMFeedCoreCallbacks, userDetails, client, routes, customEventClient, analyticsCallback, LMPostHeaderStyles, LMFeedCustomIcons, CustomComponents, FeedListCustomActions, FeedPostDetailsCustomActions, GeneralCustomCallbacks, TopicsCustomCallbacks, RepliesCustomCallbacks, PostCreationCustomCallbacks, postComponentClickCustomCallback, createPostComponentClickCustomCallback, topicComponentClickCustomCallback, memberComponentClickCustomCallback, }: PropsWithChildren<LMFeedProps<LMClient>>): import("react/jsx-runtime").JSX.Element | null;
export default LMFeed;
