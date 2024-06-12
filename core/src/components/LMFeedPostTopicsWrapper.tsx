import React, { useContext } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import LMFeedTopicsTile from "./lmTopicFeed/LMFeedTopicsTile";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";

const LMFeedPostTopicsWrapper = () => {
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { post, topics: topicsMap } = useContext(FeedPostContext);
  const { topics } = post!;
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  return (
    <>
      <div
        className="lm-feed-wrapper__card__topic-view-wrapper  lm-mb-3"
        lm-feed-component-id={`lm-feed-topic-wrapper-vwxyz-${post?.Id}`}
      >
        {topics?.map((topicId: string) => {
          return CustomComponents?.CustomPostTopicTile ? (
            <CustomComponents.CustomPostTopicTile
              key={topicId}
              topic={topicsMap![topicId]}
            />
          ) : (
            <div
              onClick={() => {
                lmfeedAnalyticsClient?.sendPostTopicClickEvent(
                  post!,
                  topicsMap![topicId],
                );
              }}
            >
              <LMFeedTopicsTile key={topicId} topic={topicsMap![topicId]} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LMFeedPostTopicsWrapper;
