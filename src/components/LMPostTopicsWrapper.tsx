import React, { useContext } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { CustomAgentProviderContext } from "../contexts/LMCustomAgentProviderContext";
import LMFeedTopicsTile from "./lmTopicFeed/LMFeedTopicsTile";

const LMPostTopicsWrapper = () => {
  const { post, topics: topicsMap } = useContext(FeedPostContext);
  const { topics } = post!;
  const { topicBlocksWrapperStyles } = useContext(CustomAgentProviderContext);
  return (
    <>
      <div
        className="lm-feed-wrapper__card__topic-view-wrapper"
        style={topicBlocksWrapperStyles}
      >
        {topics.map((topicId: string) => {
          return <LMFeedTopicsTile topic={topicsMap![topicId]} key={topicId}/>;
        })}
      </div>
    </>
  );
};

export default LMPostTopicsWrapper;
