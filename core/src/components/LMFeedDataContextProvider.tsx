import React from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";

import LMFeedUniversalFeed from "./LMFeedUniversalFeed";

import LMFeedDetails from "./LMFeedDetails";
import { returnPostId } from "../shared/utils";

const LMFeedListDataContextProvider = () => {
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
    hidePost,
    widgets,
  } = useFetchFeeds();

  const renderComponents = () => {
    const postId = returnPostId();
    if (postId.length) {
      return <LMFeedDetails postId={postId} />;
    } else {
      return <LMFeedUniversalFeed />;
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
        hidePost,
      }}
    >
      {renderComponents()}
    </LMFeedDataContext.Provider>
  );
};

export default LMFeedListDataContextProvider;
