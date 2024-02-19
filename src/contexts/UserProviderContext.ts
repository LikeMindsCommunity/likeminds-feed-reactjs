import React from "react";
import { User } from "../types/models/member";
import { Community } from "../types/models/Community";

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
