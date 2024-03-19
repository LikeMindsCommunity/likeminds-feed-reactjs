import React, { memo } from "react";
import { Checkbox } from "@mui/material";
import { Topic } from "../../shared/types/models/topic";

interface LMFeedTopicSelectionTileProps {
  topic: Topic;
  checkedList: Topic[];
  clickHandler: (topic: Topic) => void;
}

const LMFeedTopicSelectionTile: React.FC<LMFeedTopicSelectionTileProps> = memo(
  ({ topic, checkedList, clickHandler }) => {
    const handleTileClick = () => {
      clickHandler(topic);
    };

    const isChecked = checkedList.some((el) => el.Id === topic.Id);

    return (
      <div className="lm-topic-dropdown__topic" onClick={handleTileClick}>
        <Checkbox
          disableRipple={true}
          checked={isChecked}
          className="lm-topic-checkbox"
        />
        <span className="lm-topic-name-container">{topic.name}</span>
      </div>
    );
  },
);

export default LMFeedTopicSelectionTile;
