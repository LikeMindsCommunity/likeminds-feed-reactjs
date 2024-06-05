/// <reference types="react" />
import { Topic } from "../shared/types/models/topic";
import { LMTopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
export declare function useTopicDropdown(currentSelectedTopicIds?: string[], setCurrentSelectedTopicIds?: any, preSelectedTopics?: Topic[], setPreSelectedTopics?: React.Dispatch<Topic[]>, mode?: LMTopicsDropdownMode): useTopicDropdownResponse;
interface useTopicDropdownResponse {
    checkedTopics: Topic[];
    topics: Topic[];
    loadNewTopics: boolean;
    searchKey: string;
    setSearchKey: React.Dispatch<string>;
    updateCheckedTopics: (topic: Topic) => void;
    clearAllCheckedTopics: () => void;
    getNextPage: () => Promise<void>;
    topicComponentClickCustomCallback?: ComponentDelegatorListener;
}
export {};
