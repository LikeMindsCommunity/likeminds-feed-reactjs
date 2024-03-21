import { Community } from "../models/community";
import { User } from "../models/member";

export interface InitiateUserData {
  accessToken: string;
  appAccess: boolean;
  community: Community;
  hasAnswers: boolean;
  refreshToken: string;
  user: User;
}
export interface InitiateUserResponse {
  success: boolean;
  data?: InitiateUserData;
}
