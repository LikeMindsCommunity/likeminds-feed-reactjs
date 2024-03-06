import React, { useContext } from "react";
import { Topic } from "../../shared/types/models/topic";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";

interface LMFeedTopicTileInterface {
  topic: Topic;
}

const LMFeedTopicsTile = ({ topic }: LMFeedTopicTileInterface) => {
  const { LMPostTopicStyles } = useContext(CustomAgentProviderContext);
  return (
    <div style={LMPostTopicStyles?.topicStyles} className="lm-feed-topic-tile">
      {topic.name}
    </div>
  );
};

export default LMFeedTopicsTile;
