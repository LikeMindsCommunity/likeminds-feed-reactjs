import React, { useContext } from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";

import LMFeedUniversalFeed from "./LMFeedUniversalFeed";

import LMFeedDetails from "./LMFeedDetails";
import { returnPostId } from "../shared/utils";
import { CustomAgentProviderContext } from "..";

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
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const renderComponents = () => {
    const postId = returnPostId();
    if (postId.length) {
      if (CustomComponents && CustomComponents.CustomFeedDetails) {
        return <CustomComponents.CustomFeedDetails postId={postId} />;
      } else {
        return <LMFeedDetails postId={postId} />;
      }
    } else {
      if (CustomComponents && CustomComponents.CustomUniversalFeed) {
        return CustomComponents?.CustomUniversalFeed;
      } else {
        return <LMFeedUniversalFeed />;
      }
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
