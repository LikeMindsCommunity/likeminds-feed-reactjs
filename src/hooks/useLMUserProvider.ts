import { useEffect, useState } from "react";

import { GetMemberStateResponse } from "../shared/types/api-responses/getMemberStateResponse";
import { User } from "../shared/types/models/member";
import { Community } from "../shared/types/models/community";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { ValidateUserResponse } from "../shared/types/api-responses/initiateUserResponse";
import {
  InitiateUserRequest,
  ValidateUserRequest,
} from "@likeminds.community/feed-js-beta";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
// import { TokenValues } from "../shared/enums/tokens";
export interface UserDetails {
  accessToken?: string;
  refreshToken?: string;
  uuid?: string;
  username?: string;
  isGuest?: boolean;
  apiKey?: string;
}
interface UserProviderInterface {
  lmFeedUser: User | null;
  logoutUser: () => void;
  lmFeedUserCurrentCommunity: Community | null;
}
// Hook to provide user details
export default function useUserProvider(
  lmFeedclient: LMClient,
  customEventClient: LMFeedCustomEvents,
  userCreds: UserDetails,
): UserProviderInterface {
  const { accessToken, refreshToken, username, uuid, isGuest, apiKey } =
    userCreds;
  const [lmFeedUser, setLmFeedUser] = useState<null | User>(null);

  const [lmFeedUserCurrentCommunity, setLmFeedUserCurrentCommunity] =
    useState<Community | null>(null);
  useEffect(() => {
    if (!lmFeedclient) {
      return;
    }
    function setTokensInLocalStorage(
      accessToken: string,
      refreshToken: string,
    ) {
      lmFeedclient.setAccessTokenInLocalStorage(accessToken);
      lmFeedclient.setRefreshTokenInLocalStorage(refreshToken);
    }
    async function validateFeedUser(
      localAccessToken: string,
      localRefreshToken: string,
    ) {
      try {
        const initiateUserCall: ValidateUserResponse =
          (await lmFeedclient?.validateUser(
            ValidateUserRequest.builder()
              .setaccessToken(localAccessToken)
              .setrefreshToken(localRefreshToken)
              .build(),
          )) as never;
        setTokensInLocalStorage(
          initiateUserCall.data?.accessToken || "",
          initiateUserCall.data?.refreshToken || "",
        );
        const memberStateCall: GetMemberStateResponse =
          (await lmFeedclient?.getMemberState()) as never;
        if (initiateUserCall && memberStateCall.success) {
          const user = {
            ...initiateUserCall.data?.user,
            ...memberStateCall.data.member,
          };
          setLmFeedUser(user || null);
          setLmFeedUserCurrentCommunity(
            initiateUserCall?.data?.community || null,
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function initiateFeedUser(
      apiKey: string,
      uuid: string,
      username: string,
      isGuest: boolean,
    ) {
      try {
        // TODO Fix the initiateUser model
        const initiateUserCall: ValidateUserResponse =
          (await lmFeedclient?.initiateUser(
            InitiateUserRequest.builder()
              .setUUID(uuid || "")
              .setIsGuest(isGuest || false)
              .setUserName(username || "")
              .build(),
          )) as never;
        setTokensInLocalStorage(
          initiateUserCall.data?.accessToken || "",
          initiateUserCall.data?.refreshToken || "",
        );
        const memberStateCall: GetMemberStateResponse =
          (await lmFeedclient?.getMemberState()) as never;
        if (initiateUserCall && memberStateCall.success) {
          const user = {
            ...initiateUserCall.data?.user,
            ...memberStateCall.data.member,
          };
          setLmFeedUser(user || null);
          setLmFeedUserCurrentCommunity(
            initiateUserCall?.data?.community || null,
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    customEventClient.listen(
      LMFeedCustomActionEvents.TRIGGER_SET_USER,
      setUser,
    );

    // calling initiateuser and memberstate apis and setting the user details
    // TODO add a check for tokens
    async function setUser() {
      try {
        if (apiKey && username && uuid) {
          const localAccessToken =
            lmFeedclient.getAccessTokenFromLocalStorage();
          const localRefreshToken =
            lmFeedclient.getRefreshTokenFromLocalStorage();
          if (localAccessToken && localRefreshToken) {
            await validateFeedUser(localAccessToken, localRefreshToken);
          } else {
            await initiateFeedUser(apiKey, uuid, username, isGuest || false);
          }
        } else {
          if (accessToken && refreshToken) {
            setTokensInLocalStorage(accessToken, refreshToken);
            await validateFeedUser(accessToken, refreshToken);
          } else {
            // Change the logic to throw error
            const localAccessToken =
              lmFeedclient.getAccessTokenFromLocalStorage();
            const localRefreshToken =
              lmFeedclient.getRefreshTokenFromLocalStorage();
            await validateFeedUser(
              localAccessToken || "",
              localRefreshToken || "",
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    setUser();
    return () => {
      customEventClient.remove(LMFeedCustomActionEvents.TRIGGER_SET_USER);
    };
  }, [
    accessToken,
    apiKey,
    customEventClient,
    isGuest,
    lmFeedclient,
    refreshToken,
    username,
    uuid,
  ]);
  useEffect(() => {
    if (lmFeedUser) {
      customEventClient.dispatchEvent(LMFeedCustomActionEvents.USER_INITIATED, {
        lmFeedClient: lmFeedclient,
        user: lmFeedUser,
      });
    }
  }, [customEventClient, lmFeedUser, lmFeedclient]);
  function logoutUser() {
    setLmFeedUser(null);
  }
  return {
    lmFeedUser,
    logoutUser,
    lmFeedUserCurrentCommunity,
  };
}
