import { LogoutRequest } from "@likeminds.community/feed-js";
import { TokenValues } from "./enums/tokens";
import { LMClient } from "./types/dataLayerExportsTypes";

export async function logoutUser(
  lmFeedClient: LMClient,
  deviceId?: string | null,
) {
  const logoutRequestBuilder = LogoutRequest.builder();
  if (deviceId) {
    logoutRequestBuilder.setDeviceId(deviceId);
  }
  const logoutRequest = logoutRequestBuilder.build();
  const logoutUserCall = await lmFeedClient?.logoutUser(logoutRequest);

  if (logoutUserCall?.success) {
    localStorage.removeItem(TokenValues.COMMUNITY_CONFIGURATIONS);
    localStorage.removeItem(TokenValues.IS_POST_APPROVAL_NEEDED);
  }
}
