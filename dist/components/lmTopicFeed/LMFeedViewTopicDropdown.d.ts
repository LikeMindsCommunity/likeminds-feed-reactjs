import React from "react";
import { LMTopicsDropdownMode } from "../../shared/enums/lmTopicFeedDropdownMode";
import { Topic } from "../../shared/types/models/topic";
interface LMFeedTopicDropdownProps {
    mode: LMTopicsDropdownMode;
    selectedTopicIds?: string[];
    setSelectedTopicsIds?: React.Dispatch<string[]>;
    preSelectedTopics?: Topic[];
    setPreSelectedTopics?: React.Dispatch<Topic[]>;
}
declare const LMFeedViewTopicDropdown: React.FC<LMFeedTopicDropdownProps>;
export default LMFeedViewTopicDropdown;
