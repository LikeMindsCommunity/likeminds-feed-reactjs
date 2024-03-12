import React, { useContext } from "react";
import { Topic } from "../../shared/types/models/topic";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
import { useNavigate } from "react-router-dom";
import { TOPIC_PATH } from "../../shared/constants/lmAppConstant";

interface LMFeedTopicTileInterface {
  topic: Topic;
}

const LMFeedTopicsTile = ({ topic }: LMFeedTopicTileInterface) => {
  const { LMPostTopicStyles } = useContext(CustomAgentProviderContext);
  const navigate = useNavigate();
  const onTopicClickHandler = () => {
    navigate(`${TOPIC_PATH}/${topic.Id}`);
  };
  return (
    <div
      onClick={onTopicClickHandler}
      style={LMPostTopicStyles?.topicStyles}
      className="lm-feed-topic-tile"
    >
      {topic.name}
    </div>
  );
};

export default LMFeedTopicsTile;
