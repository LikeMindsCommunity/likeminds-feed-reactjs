/* eslint-disable @typescript-eslint/no-unused-vars */
// Base component for setting Feed List.

import { useCallback, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { HelmetProvider } from "react-helmet-async";
import LMFeedViewTopicDropdown from "./lmTopicFeed/LMFeedViewTopicDropdown";
import { TopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import LMFeedDetails from "./LMFeedDetails";
import { Post } from "../shared/types/models/post";
import { ROUTES } from "../shared/constants/lmRoutesConstant";
import Posts from "./LMFeedPosts";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import LMFeedCreatePost from "./LMFeedCreatePost";
import LMFeedAllMembers from "./LMFeedAllMembers";

interface LMFeedUniversalFeedProps {
  PostView?: React.FC;
  Shimmer?: React.FC;
  FooterView?: React.FC;
  HeaderView?: React.FC;
  likeActionCall?: () => void;
}

const LMFeedUniversalFeed = (props: LMFeedUniversalFeedProps) => {
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
  } = useFetchFeeds();
  const { CustomComponents } = useContext(CustomAgentProviderContext);
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
            deletePost: deletePost,
            pinPost: pinPost,
          }}
        >
          {CustomComponents?.PostView || (
            <Posts post={post} user={filteredUser} />
          )}
        </FeedPostContext.Provider>
      );
    });
  }, [CustomComponents?.PostView, deletePost, feedList, feedUsersList, topics]);

  return (
    <div className="lm-feed-wrapper lm-d-flex">
      <div className="lm-flex-grow" id="feed-scroller">
        <LMFeedCreatePost />
        {/* <div> */}
        {/* Topics */}
        {CustomComponents?.TopicDropDown ? (
          CustomComponents.TopicDropDown
        ) : (
          <div className="lm-mb-4 lm-mt-4">
            <LMFeedViewTopicDropdown
              mode={TopicsDropdownMode.view}
              selectedTopicIds={selectedTopics}
              setSelectedTopicsIds={setSelectedTopics}
            />
          </div>
        )}
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
        {/* </div> */}
      </div>
      <div className="lm-member">
        <LMFeedAllMembers />
      </div>
    </div>
  );
};

export default LMFeedUniversalFeed;
