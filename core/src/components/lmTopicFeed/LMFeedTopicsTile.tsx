import React from "react";
import { Topic } from "../../shared/types/models/topic";

interface LMFeedTopicTileInterface {
  topic: Topic;
}

const LMFeedTopicsTile = ({ topic }: LMFeedTopicTileInterface) => {
  return (
    <div className="lm-feed-topic-tile" onClick={() => {}}>
      {topic.name}
    </div>
  );
};

export default LMFeedTopicsTile;
