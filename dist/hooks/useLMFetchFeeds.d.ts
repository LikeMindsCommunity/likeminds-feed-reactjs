/// <reference types="react" />
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { Topic } from "../shared/types/models/topic";
import { ClickNavigator } from "../shared/types/customProps/routes";
import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
interface useFetchFeedsResponse {
    topics: Record<string, Topic>;
    selectedTopics: string[];
    setSelectedTopics: React.Dispatch<string[]>;
    loadMoreFeeds: boolean;
    getNextPage: () => Promise<void>;
    feedList: Post[];
    feedUsersList: Record<string, User>;
    deletePost: (id: string) => Promise<void>;
    pinPost: (id: string) => Promise<void>;
    likePost: (id: string) => Promise<void>;
    postComponentClickCustomCallback?: ComponentDelegatorListener;
    clickNavigator: ClickNavigator;
}
export declare function useFetchFeeds(topicId?: string): useFetchFeedsResponse;
export {};
