import {
  InitiateUserRequest,
  LMFeedClient,
  LMSDKCallbacks,
} from "@likeminds.community/feed-js";
import { LMFeedCustomEvents } from "./customEvents";
import { LMFeedCustomActionEvents } from "./constants/lmFeedCustomEventNames";
import { ValidateUserResponse } from "./types/api-responses/initiateUserResponse";
import { GetMemberStateResponse } from "./types/api-responses/getMemberStateResponse";
// import { LMFeedCustomActionEvents } from "../temp";

export class LMCoreCallbacks {
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string,
    ) => void,
    onRefreshTokenExpired:
      | (() => { accessToken: string; refreshToken: string })
      | (() => Promise<{ accessToken: string; refreshToken: string }>),
  ) {
    (this.onAccessTokenExpiredAndRefreshed = onAccessTokenExpiredAndRefreshed),
      (this.onRefreshTokenExpired = onRefreshTokenExpired);
  }
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string,
  ) => void;
  onRefreshTokenExpired:
    | (() => { accessToken: string; refreshToken: string })
    | (() => Promise<{ accessToken: string; refreshToken: string }>);
}

export class LMSDKCallbacksImplementations extends LMSDKCallbacks {
  lmCoreCallbacks: LMCoreCallbacks;
  client: LMFeedClient;
  customEventsClient: LMFeedCustomEvents;
  setTokensInLocalStorage(accessToken: string, refreshToken: string) {
    this.client.setAccessTokenInLocalStorage(accessToken);
    this.client.setRefreshTokenInLocalStorage(refreshToken);
  }
  async loginFunction() {
    try {
      const user = this.client.getUserFromLocalStorage();
      const { sdkClientInfo, name, isGuest } = JSON.parse(user);
      const { uuid } = sdkClientInfo;
      const initiateUserCall: ValidateUserResponse =
        (await this.client.initiateUser(
          InitiateUserRequest.builder()
            .setApiKey(this.client.getApiKeyFromLocalStorage())
            .setUUID(uuid)
            .setUserName(name)
            .setIsGuest(isGuest)
            .build(),
        )) as never;
      if (initiateUserCall.success) {
        this.setTokensInLocalStorage(
          initiateUserCall.data?.accessToken || "",
          initiateUserCall.data?.refreshToken || "",
        );

        this.client.setUserInLocalStorage(
          JSON.stringify(initiateUserCall.data?.user),
        );
      }
      const memberStateCall: GetMemberStateResponse =
        (await this.client?.getMemberState()) as never;
      const userObject = {
        ...initiateUserCall.data?.user,
        ...memberStateCall.data.member,
      };
      this.customEventsClient.dispatchEvent(
        LMFeedCustomActionEvents.TRIGGER_SET_USER,
        {
          user: userObject,
          community: initiateUserCall.data?.community,
        },
      );
      return {
        accessToken: initiateUserCall.data?.accessToken,
        refreshToken: initiateUserCall.data?.refreshToken,
      };
    } catch (error) {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
  }
  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string,
  ): void {
    this.lmCoreCallbacks.onAccessTokenExpiredAndRefreshed(
      accessToken,
      refreshToken,
    );
  }
  onRefreshTokenExpired():
    | {
        accessToken: string;
        refreshToken: string;
      }
    | null
    | Promise<{
        accessToken: string;
        refreshToken: string;
      }> {
    const apiKey: string = this.client.getApiKeyFromLocalStorage();
    if (apiKey && apiKey.length) {
      return this.loginFunction()
        .then(function (res) {
          return res;
        })
        .catch(function (err) {
          return err;
        });
    } else {
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
