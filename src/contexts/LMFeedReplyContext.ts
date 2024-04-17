import React from "react";
import { Reply } from "../shared/types/models/replies";
import { User } from "../shared/types/models/member";

export const ReplyContext = React.createContext<ReplyContextInterface>({
  reply: null,
  user: null,
});

interface ReplyContextInterface {
  reply: Reply | null;
  user: User | null;
  deleteReply?: (id: string) => void;
}
