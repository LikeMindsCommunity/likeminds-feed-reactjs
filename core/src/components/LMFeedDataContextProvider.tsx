import React, { useContext } from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

import LMFeedUniversalFeed from "./LMFeedUniversalFeed";
import { LMFeedModerationScreen } from "./LMFeedModerationScreen";

import LMFeedDetails from "./LMFeedDetails";
import { returnPostId } from "../shared/utils";
import { CustomAgentProviderContext } from "..";
import { LMFeedCurrentUserState } from "../shared/enums/lmCurrentUserState";

export interface LMFeedListDataContextProviderInterface {
  children?: React.ReactNode;
}

const LMFeedListDataContextProvider = ({
  children,
}: LMFeedListDataContextProviderInterface) => {
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
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  const childrenArray = React.Children.toArray(children);
  const hasModerationScreen = childrenArray.some(
    (child) =>
      React.isValidElement(child) && child.type === LMFeedModerationScreen,
  );

  const hasUniversalFeed = childrenArray.some(
    (child) =>
      React.isValidElement(child) && child.type === LMFeedUniversalFeed,
  );

  const renderComponents = () => {
    const postId = returnPostId();
    const isCM = currentUser?.state === LMFeedCurrentUserState.CM;
    if (postId.length) {
      if (CustomComponents && CustomComponents.CustomFeedDetails) {
        return <CustomComponents.CustomFeedDetails postId={postId} />;
      } else {
        return <LMFeedDetails postId={postId} />;
      }
    } else {
      if (CustomComponents && CustomComponents.CustomUniversalFeed) {
        return CustomComponents?.CustomUniversalFeed;
      }
      if (isCM && hasModerationScreen) {
        return <LMFeedModerationScreen />;
      }

      if (hasUniversalFeed) {
        return <LMFeedUniversalFeed />;
      }
      return children;
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
