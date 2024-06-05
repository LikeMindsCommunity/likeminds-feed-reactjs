import React from "react";
import { User } from "../shared/types/models/member";
import { Community } from "../shared/types/models/community";
interface UserProviderContextInterface {
    currentUser: User | null;
    logoutUser: (() => void) | null;
    currentCommunity: Community | null;
}
declare const _default: React.Context<UserProviderContextInterface>;
export default _default;
