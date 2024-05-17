import { useEffect, useState } from "react";

import { GetMemberStateResponse } from "../shared/types/api-responses/getMemberStateResponse";
import { User } from "../shared/types/models/member";
import { Community } from "../shared/types/models/community";
import { LMClient } from "../shared/types/dataLayerExportsTypes";
import { ValidateUserResponse } from "../shared/types/api-responses/initiateUserResponse";
import { ValidateUserRequest } from "@likeminds.community/feed-js";
import { LMFeedCustomEvents } from "../shared/customEvents";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";

interface UserProviderInterface {
  lmFeedUser: User | null;
  logoutUser: () => void;
  lmFeedUserCurrentCommunity: Community | null;
}
// Hook to provide user details
export default function useUserProvider(
  accessToken: string,
  refreshToken: string,
  lmFeedclient: LMClient,
  customEventClient: LMFeedCustomEvents,
): UserProviderInterface {
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
