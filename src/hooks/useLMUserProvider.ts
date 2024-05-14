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
export interface UserDetails {
  accessToken?: string;
  refreshToken?: string;
  uuid?: string;
  username?: string;
  isGuest?: boolean;
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
  const { accessToken, refreshToken, username, uuid, isGuest } = userCreds;
  const [lmFeedUser, setLmFeedUser] = useState<null | User>(null);

  const [lmFeedUserCurrentCommunity, setLmFeedUserCurrentCommunity] =
    useState<Community | null>(null);
  useEffect(() => {
    if (!lmFeedclient) {
      return;
    }

    // calling initiateuser and memberstate apis and setting the user details
    async function setUser() {
      try {
        if (accessToken && refreshToken) {
          const initiateUserCall: ValidateUserResponse =
            (await lmFeedclient?.validateUser(
              ValidateUserRequest.builder()
                .setaccessToken(accessToken)
                .setrefreshToken(refreshToken)
                .build(),
            )) as never;
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
        } else {
          const initiateUserCall: ValidateUserResponse =
            (await lmFeedclient?.initiateUser(
              InitiateUserRequest.builder()
                .setUUID(uuid || "")
                .setIsGuest(isGuest || false)
                .setUserName(username || "")
                .build(),
            )) as never;
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
        }
      } catch (error) {
        console.log(error);
      }
    }

    setUser();
  }, [accessToken, lmFeedclient, refreshToken]);
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
