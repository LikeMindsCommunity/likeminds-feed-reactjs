import React from "react";
import { Topic } from "../../types/models/topic";

interface LMFeedTopicTileInterface {
  topic: Topic;
}

const LMFeedTopicsTile = ({ topic }: LMFeedTopicTileInterface) => {
  return <div className="lm-feed-topic-tile">{topic.name}</div>;
};

export default LMFeedTopicsTile;
