import React from "react";
import { Topic } from "../../shared/types/models/topic";
interface LMFeedTopicSelectionTileProps {
    topic: Topic;
    checkedList: Topic[];
    clickHandler: (topic: Topic) => void;
}
declare const LMFeedTopicSelectionTile: React.FC<LMFeedTopicSelectionTileProps>;
export default LMFeedTopicSelectionTile;
