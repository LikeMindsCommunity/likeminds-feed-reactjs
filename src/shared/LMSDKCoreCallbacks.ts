import {
  LMFeedClient,
  LMSDKCallbacks,
} from "@likeminds.community/feed-js-beta";
import { LMFeedCustomEvents } from "./customEvents";
import { LMFeedCustomActionEvents } from "./constants/lmFeedCustomEventNames";
// import { LMFeedCustomActionEvents } from "../temp";

export class LMCoreCallbacks {
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string,
    ) => void,
    onRefreshTokenExpired: () => { accessToken: string; refreshToken: string },
  ) {
    (this.onAccessTokenExpiredAndRefreshed = onAccessTokenExpiredAndRefreshed),
      (this.onRefreshTokenExpired = onRefreshTokenExpired);
  }
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string,
  ) => void;
  onRefreshTokenExpired: () => { accessToken: string; refreshToken: string };
}

export class LMSDKCallbacksImplementations extends LMSDKCallbacks {
  lmCoreCallbacks: LMCoreCallbacks;
  client: LMFeedClient;
  customEventsClient: LMFeedCustomEvents;
  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string,
  ): void {
    this.lmCoreCallbacks.onAccessTokenExpiredAndRefreshed(
      accessToken,
      refreshToken,
    );
  }
  onRefreshTokenExpired(): {
    accessToken: string;
    refreshToken: string;
  } | null {
    console.log("inside refresh token expired");
    const apiKey: string = this.client.getApiKeyFromLocalStorage();
    if (apiKey && apiKey.length) {
      console.log("a");
      this.customEventsClient.dispatchEvent(
        LMFeedCustomActionEvents.TRIGGER_SET_USER,
      );
      return null;
    } else {
      console.log("here");
      return this.lmCoreCallbacks.onRefreshTokenExpired();
    }
  }
  constructor(
    lmCoreCallbacks: LMCoreCallbacks,
    client: LMFeedClient,
    customEventsClient: LMFeedCustomEvents,
  ) {
    super();
    this.lmCoreCallbacks = lmCoreCallbacks;
    this.client = client;
    this.customEventsClient = customEventsClient;
  }
}
