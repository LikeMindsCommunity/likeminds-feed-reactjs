/* eslint-disable @typescript-eslint/no-unused-vars */
// Base component for setting Feed List.

import InfiniteScroll from "react-infinite-scroll-component";
import { useFetchFeeds } from "../hooks/useFetchFeeds";
import { useCallback } from "react";
import { Post } from "../types/models/post";
import { FeedPostContext } from "../contexts/FeedPostContext";
import Feed from "./Posts";
import LMFeedViewTopicDropdown from "./LM-Topic-Feed/LMFeedViewTopicDropdown";
import { TopicsDropdownMode } from "../enums/topicFeedDropdownMode";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import LMFeedDetails from "./LMFeedDetails";

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
      const postUuid = post.uuid;
      const usersArray = Object.values(feedUsersList);
      const filteredUser = usersArray.find((user) => user.uuid === postUuid);

      return (
        <FeedPostContext.Provider
          key={post.Id}
          value={{
            post: post,
            users: feedUsersList,
            topics: topics,
          }}
        >
          <Link to={`/post/${post.Id}`}>
            <Feed post={post} user={filteredUser} />
          </Link>
        </FeedPostContext.Provider>
      );
    });
  }, [feedList, feedUsersList, topics]);

  return (
    <div className="lm-feed-wrapper">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LMFeedViewTopicDropdown mode={TopicsDropdownMode.view} />
                <InfiniteScroll
                  dataLength={feedList.length}
                  hasMore={loadMoreFeeds}
                  next={getNextPage}
                  // TODO set shimmer on loader component
                  loader={null}
                >
                  {renderFeeds()}
                </InfiniteScroll>
              </>
            }
          ></Route>

          <Route path="/post/:id" element={<LMFeedDetails />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default LMFlatFeed;
