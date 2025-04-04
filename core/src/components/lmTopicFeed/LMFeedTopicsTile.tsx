import React from "react";
import { Topic } from "../../shared/types/models/topic";

interface LMFeedTopicTileInterface {
  topic: Topic;
}

const LMFeedTopicsTile = ({ topic }: LMFeedTopicTileInterface) => {
  return (
    <div className="lm-feed-topic-tile topic-tile-custom-style" onClick={() => {}}>
      {topic.name}
    </div>
  );
};

export default LMFeedTopicsTile;
