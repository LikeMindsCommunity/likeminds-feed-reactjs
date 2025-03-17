import React, { useContext } from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

import { returnPostId } from "../shared/utils";
import LMQNAFeedDetails from "./LMQNAFeedDetails";
import LMQNAFeedUniversalFeed from "./LMQNAFeedUniversalFeed";

export interface LMQNAFeedDataContextProviderInterface {
  children?: React.ReactNode;
}

const LMQNAFeedDataContextProvider = ({
  children,
}: LMQNAFeedDataContextProviderInterface) => {
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
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const isCM = currentUser?.state === 1;
  const renderComponents = () => {
    const postId = returnPostId();
    if (postId.length) {
      return <LMQNAFeedDetails postId={postId} />;
    } else {
      return <>{children && isCM ? children : <LMQNAFeedUniversalFeed />}</>;
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
