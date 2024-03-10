import React from "react";
import { User } from "../types/models/member";
import { Community } from "../types/models/Community";
interface UserProviderContextInterface {
    currentUser: User | null;
    logoutUser: (() => void) | null;
    currentCommunity: Community | null;
}
declare const _default: React.Context<UserProviderContextInterface>;
export default _default;
