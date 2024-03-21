import React from "react";
import { User } from "../shared/types/models/member";
import { Community } from "../shared/types/models/community";

interface UserProviderContextInterface {
  currentUser: User | null;
  logoutUser: (() => void) | null;
  currentCommunity: Community | null;
}
export default React.createContext<UserProviderContextInterface>({
  currentUser: null,
  logoutUser: null,
  currentCommunity: null,
});
