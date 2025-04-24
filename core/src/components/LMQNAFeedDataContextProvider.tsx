import React, { useContext } from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

import { returnPostId } from "../shared/utils";
import LMQNAFeedDetails from "./LMQNAFeedDetails";
import LMQNAFeedUniversalFeed from "./LMQNAFeedUniversalFeed";
import { LMFeedModerationScreen } from "./LMFeedModerationScreen";
import { CustomAgentProviderContext } from "../old_index";
import { LMFeedCurrentUserState } from "../shared/enums/lmCurrentUserState";

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
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  const childrenArray = React.Children.toArray(children);
  const hasModerationScreen = childrenArray.some(
    (child) =>
      React.isValidElement(child) && child.type === LMFeedModerationScreen,
  );

  const hasUniversalFeed = childrenArray.some(
    (child) =>
      React.isValidElement(child) && child.type === LMQNAFeedUniversalFeed,
  );

  const renderComponents = () => {
    const postId = returnPostId();
    const isCM = currentUser?.state === LMFeedCurrentUserState.CM;
    if (postId.length) {
      if (CustomComponents && CustomComponents.CustomFeedDetails) {
        return <CustomComponents.CustomFeedDetails postId={postId} />;
      } else {
        return <LMQNAFeedDetails postId={postId} />;
      }
    } else {
      if (CustomComponents && CustomComponents.CustomUniversalFeed) {
        return CustomComponents?.CustomUniversalFeed;
      }
      if (isCM && hasModerationScreen) {
        return <LMFeedModerationScreen />;
      }

      if (hasUniversalFeed) {
        return <LMQNAFeedUniversalFeed />;
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
      }}
    >
      {renderComponents()}
    </LMFeedDataContext.Provider>
  );
};

export default LMQNAFeedDataContextProvider;
