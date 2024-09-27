import {
  InitiateUser,
  LMResponseType,
  ValidateUser,
} from "@likeminds.community/feed-js";

export interface ValidateUserResponse extends LMResponseType<ValidateUser> {}

export interface InitiateUserResponse extends LMResponseType<InitiateUser> {}
