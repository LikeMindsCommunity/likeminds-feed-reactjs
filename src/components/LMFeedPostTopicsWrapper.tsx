import React, { useContext } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import LMFeedTopicsTile from "./lmTopicFeed/LMFeedTopicsTile";

const LMFeedPostTopicsWrapper = () => {
  const { post, topics: topicsMap } = useContext(FeedPostContext);
  const { topics } = post!;
  const { LMPostTopicStyles } = useContext(CustomAgentProviderContext);
  return (
    <>
      <div
        className="lm-feed-wrapper__card__topic-view-wrapper"
        style={LMPostTopicStyles?.topicWrapperStyles}
      >
        {topics.map((topicId: string) => {
          return <LMFeedTopicsTile key={topicId} topic={topicsMap![topicId]} />;
        })}
      </div>
    </>
  );
};

export default LMFeedPostTopicsWrapper;
