import { User } from "../shared/types/models/member";
import { Reply } from "../shared/types/models/replies";
interface UseReplyInterface {
    reply: Reply | null;
    users: Record<string, User>;
    loadMoreReplies: boolean;
    getNextPage: () => Promise<void>;
    replies: Reply[];
    deleteReply: (id: string) => Promise<void>;
    likeReply: (id: string) => Promise<void>;
    updateReply: (comment: Reply, usersMap: Record<string, User>) => void;
}
export declare const useReply: (postId: string, replyId: string) => UseReplyInterface;
export {};
