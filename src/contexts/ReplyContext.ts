import React from "react";
import { Reply } from "../types/models/replies";
import { User } from "../types/models/member";

export const ReplyContext = React.createContext<ReplyContextInterface>({
  reply: null,
  user: null,
});

interface ReplyContextInterface {
  reply: Reply | null;
  user: User | null;
}
