import { LogoutRequest } from "@likeminds.community/feed-js-beta";
import { TokenValues } from "./enums/tokens";
import { LMClient } from "./types/dataLayerExportsTypes";

export async function logoutUser(
  lmFeedClient: LMClient,
  deviceId?: string | undefined,
) {
    console.log("logout called! in util function");
  const logoutRequest = LogoutRequest.builder().setDeviceId(deviceId).build();
  console.log("request created");

  const logoutUserCall = await lmFeedClient?.logoutUser(logoutRequest);
  if (logoutUserCall?.success) {
    console.log("data success");
    localStorage.removeItem(TokenValues.COMMUNITY_CONFIGURATIONS);
    localStorage.removeItem(TokenValues.IS_POST_APPROVAL_NEEDED);
  }
}
