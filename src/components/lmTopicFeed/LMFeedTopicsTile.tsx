import React from "react";
import { Topic } from "../../shared/types/models/topic";

import { useNavigate } from "react-router-dom";
import { TOPIC_PATH } from "../../shared/constants/lmAppConstant";

interface LMFeedTopicTileInterface {
  topic: Topic;
}

const LMFeedTopicsTile = ({ topic }: LMFeedTopicTileInterface) => {
  const navigate = useNavigate();
  const onTopicClickHandler = () => {
    navigate(`${TOPIC_PATH}/${topic.Id}`);
  };
  return (
    <div onClick={onTopicClickHandler} className="lm-feed-topic-tile">
      {topic.name}
    </div>
  );
};

export default LMFeedTopicsTile;
