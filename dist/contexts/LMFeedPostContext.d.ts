import React from "react";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { User } from "../shared/types/models/member";
import { Reply } from "../shared/types/models/replies";
import { ClickNavigator } from "../shared/types/customProps/routes";
export declare const FeedPostContext: React.Context<FeedPostContextInterface>;
interface FeedPostContextInterface {
    post: Post | null;
    topics: Record<string, Topic> | null;
    users: Record<string, User> | null;
    getNextPage?: () => Promise<void>;
    loadNextPage?: boolean;
    replies?: Reply[];
    deletePost?: (id: string) => Promise<void>;
    pinPost?: (id: string) => Promise<void>;
    addNewComment?: (comment: Reply, userMap: Record<string, User>) => void;
    removeAComment?: (id: string) => void;
    updateReplyOnPostReply?: (id: string) => void;
    updateReply?: (comment: Reply, usersMap: Record<string, User>) => void;
    likeReply?: (id: string) => void;
    likePost?: (id: string) => void;
    postComponentClickCustomCallback?: (event: React.MouseEvent<HTMLDivElement>) => void;
    clickNavigator?: ClickNavigator;
}
export {};
