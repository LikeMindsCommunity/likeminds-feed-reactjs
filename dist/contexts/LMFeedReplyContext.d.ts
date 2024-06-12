import React from "react";
import { Reply } from "../shared/types/models/replies";
import { User } from "../shared/types/models/member";
export declare const ReplyContext: React.Context<ReplyContextInterface>;
interface ReplyContextInterface {
    reply: Reply | null;
    user: User | null;
    deleteReply?: (id: string) => void;
    likeReply?: (id: string) => void;
    updateReply?: (comment: Reply, usersMap: Record<string, User>) => void;
}
export {};
