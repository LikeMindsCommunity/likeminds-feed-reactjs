/* eslint-disable @typescript-eslint/no-unused-vars */
// Base component for setting Feed List.

import { useCallback } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { HelmetProvider } from "react-helmet-async";
import LMFeedViewTopicDropdown from "./LM-Topic-Feed/LMFeedViewTopicDropdown";
import { TopicsDropdownMode } from "../enums/topicFeedDropdownMode";
import { FeedPostContext } from "../contexts/FeedPostContext";
import { useFetchFeeds } from "../hooks/useFetchFeeds";
import LMFeedDetails from "./LMFeedDetails";
import { Post } from "../types/models/post";
import { ROUTES } from "../shared/constants/routes.constant";
import Posts from "./Posts";

interface LMFlatFeedProps {
  PostView?: React.FC;
  Shimmer?: React.FC;
  FooterView?: React.FC;
  HeaderView?: React.FC;
  likeActionCall?: () => void;
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
          {/* <Link to={`${ROUTES.POST}/${post.Id}`}> */}
          <Posts post={post} user={filteredUser} />
          {/* </Link> */}
        </FeedPostContext.Provider>
      );
    });
  }, [feedList, feedUsersList, topics]);

  return (
    <div className="lm-feed-wrapper">
      <BrowserRouter>
        <Routes>
          <Route
            path={ROUTES.ROOT_PATH}
            element={
              <div>
                {/* Topics */}
                <div className="lm-mb-4">
                  <LMFeedViewTopicDropdown mode={TopicsDropdownMode.view} />
                </div>
                {/* Topics */}

                {/* Posts */}
                <InfiniteScroll
                  dataLength={feedList.length}
                  hasMore={loadMoreFeeds}
                  next={getNextPage}
                  // TODO set shimmer on loader component
                  loader={null}
                >
                  {renderFeeds()}
                </InfiniteScroll>
                {/* Posts */}
              </div>
            }
          ></Route>

          <Route
            path={ROUTES.POST_DETAIL}
            element={
              <HelmetProvider>
                <LMFeedDetails />
              </HelmetProvider>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default LMFlatFeed;
