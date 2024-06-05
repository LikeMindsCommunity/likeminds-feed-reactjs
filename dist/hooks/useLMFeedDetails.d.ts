import { User } from "../shared/types/models/member";
import { Post } from "../shared/types/models/post";
import { Reply } from "../shared/types/models/replies";
import { Topic } from "../shared/types/models/topic";
import { ClickNavigator } from "../shared/types/customProps/routes";
import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
interface UseFeedDetailsInterface {
    post: Post | null;
    users: Record<string, User>;
    getNextPage: () => Promise<void>;
    loadNextPage: boolean;
    replies: Reply[];
    topics: Record<string, Topic>;
    addNewComment: (comment: Reply, userMap: Record<string, User>) => void;
    removeAComment: (id: string) => void;
    updateReplyOnPostReply: (id: string) => void;
    updateReply: (comment: Reply, usersMap: Record<string, User>) => void;
    likeReply: (id: string) => Promise<void>;
    likePost: (id: string) => Promise<void>;
    pinPost: (id: string) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    clickNavigator: ClickNavigator;
    postComponentClickCustomCallback?: ComponentDelegatorListener;
}
export declare const useFeedDetails: (id: string) => UseFeedDetailsInterface;
export {};
