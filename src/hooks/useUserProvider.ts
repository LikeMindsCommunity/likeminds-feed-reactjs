import { useEffect, useState } from "react";

import { InitiateUserRequest } from "@likeminds.community/feed-js-beta";
import { InitiateUserResponse } from "../types/api-responses/initiateUserResponse";
import { GetMemberStateResponse } from "../types/api-responses/getMemberStateResponse";
import { User } from "../types/models/member";
import { Community } from "../types/models/Community";
import { LMClient } from "../types/DataLayerExportsTypes";

interface UserProviderInterface {
  lmFeedUser: User | null;
  logoutUser: () => void;
  lmFeedUserCurrentCommunity: Community | null;
}
// Hook to provide user details
export default function useUserProvider(
  uuid: string,
  isGuest: boolean,
  userId = "",
  lmFeedclient: LMClient,
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
        const initiateUserCall: InitiateUserResponse =
          (await lmFeedclient?.initiateUser(
            InitiateUserRequest.builder()
              .setUUID(uuid)
              .setIsGuest(isGuest)
              .setUserName(userId)
              .build(),
          )) as never;
        const memberStateCall: GetMemberStateResponse =
          (await lmFeedclient?.getMemberState()) as never;
        if (initiateUserCall.success && memberStateCall.success) {
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
  }, [lmFeedclient]);
  function logoutUser() {
    setLmFeedUser(null);
  }
  return {
    lmFeedUser,
    logoutUser,
    lmFeedUserCurrentCommunity,
  };
}
