/* eslint-disable @typescript-eslint/no-unused-vars */
// Base component for setting Feed List.

import InfiniteScroll from "react-infinite-scroll-component";
import { useFetchFeeds } from "../hooks/useFetchFeeds";
import { useCallback } from "react";
import { Post } from "../types/models/post";
import { FeedPostContext } from "../contexts/FeedPostContext";
import Feed from "./Feed";

interface LMFlatFeedProps {
  PostView?: React.FC;
  Shimmer?: React.FC;
  FooterView?: React.FC;
  HeaderView?: React.FC;
}

const LMFlatFeed = (props: LMFlatFeedProps) => {
  const {
    PostView = null,
    Shimmer = null,
    FooterView = null,
    HeaderView = null,
  } = props;
  const {
    topics,
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds,
    feedList,
    feedUsersList,
    getNextPage,
  } = useFetchFeeds();
  const renderFeeds = useCallback(() => {
    return feedList.map((post: Post) => {
      return (
        <FeedPostContext.Provider
          value={{
            post: post,
            users: feedUsersList,
            topics: topics,
          }}
        >
          <>{post.text}</>
        </FeedPostContext.Provider>
      );
    });
  }, [feedList, feedUsersList, topics]);
  return (
    <div>
      <InfiniteScroll
        dataLength={feedList.length}
        hasMore={loadMoreFeeds}
        next={getNextPage}
        // TODO set shimmer on loader component
        loader={null}
      >
        {renderFeeds()}
      </InfiniteScroll>
    </div>
  );
};

export default LMFlatFeed;
