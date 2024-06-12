/// <reference types="react" />
import { Topic } from "../shared/types/models/topic";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { ClickNavigator } from "../shared/types/customProps/routes";
export declare const LMFeedDataContext: import("react").Context<LMFeedDataContextInterface>;
interface LMFeedDataContextInterface {
    topics?: Record<string, Topic>;
    selectedTopics?: string[];
    setSelectedTopics?: React.Dispatch<string[]>;
    loadMoreFeeds?: boolean;
    getNextPage?: () => Promise<void>;
    feedList?: Post[];
    feedUsersList?: Record<string, User>;
    deletePost?: (id: string) => Promise<void>;
    pinPost?: (id: string) => Promise<void>;
    likePost?: (id: string) => Promise<void>;
    clickNavigator?: ClickNavigator;
    postComponentClickCustomCallback?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export {};
