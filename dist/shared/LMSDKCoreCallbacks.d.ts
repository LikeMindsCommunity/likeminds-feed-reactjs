import { LMFeedClient, LMSDKCallbacks } from "@likeminds.community/feed-js-beta";
import { LMFeedCustomEvents } from "./customEvents";
export declare class LMCoreCallbacks {
    constructor(onAccessTokenExpiredAndRefreshed: (accessToken: string, refreshToken: string) => void, onRefreshTokenExpired: (() => {
        accessToken: string;
        refreshToken: string;
    }) | (() => Promise<{
        accessToken: string;
        refreshToken: string;
    }>));
    onAccessTokenExpiredAndRefreshed: (accessToken: string, refreshToken: string) => void;
    onRefreshTokenExpired: (() => {
        accessToken: string;
        refreshToken: string;
    }) | (() => Promise<{
        accessToken: string;
        refreshToken: string;
    }>);
}
export declare class LMSDKCallbacksImplementations extends LMSDKCallbacks {
    lmCoreCallbacks: LMCoreCallbacks;
    client: LMFeedClient;
    customEventsClient: LMFeedCustomEvents;
    onAccessTokenExpiredAndRefreshed(accessToken: string, refreshToken: string): void;
    onRefreshTokenExpired(): {
        accessToken: string;
        refreshToken: string;
    } | null | Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    constructor(lmCoreCallbacks: LMCoreCallbacks, client: LMFeedClient, customEventsClient: LMFeedCustomEvents);
}
