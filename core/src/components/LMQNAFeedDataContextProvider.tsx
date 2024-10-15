import React from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";

import LMFeedUniversalFeed from "./LMFeedUniversalFeed";
import { returnPostId } from "../shared/utils";
import LMQNAFeedDetails from "./LMQNAFeedDetails";
import LMQNAFeedUniversalFeed from "./LMQNAFeedUniversalFeed";

const LMQNAFeedDataContextProvider = () => {
  const {
    topics,
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds,
    feedList,
    feedUsersList,
    getNextPage,
    deletePost,
    pinPost,
    likePost,
    postComponentClickCustomCallback,

    widgets,
  } = useFetchFeeds();

  const renderComponents = () => {
    const postId = returnPostId();
    if (postId.length) {
      return <LMQNAFeedDetails postId={postId} />;
    } else {
      return <LMQNAFeedUniversalFeed />;
    }
  };
  return (
    <LMFeedDataContext.Provider
      value={{
        topics,
        widgets,
        selectedTopics,
        setSelectedTopics,
        loadMoreFeeds,
        feedList,
        feedUsersList,
        getNextPage,
        deletePost,
        pinPost,
        likePost,
        postComponentClickCustomCallback,
      }}
    >
      {renderComponents()}
    </LMFeedDataContext.Provider>
  );
};

export default LMQNAFeedDataContextProvider;
