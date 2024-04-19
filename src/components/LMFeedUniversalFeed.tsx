/* eslint-disable @typescript-eslint/no-unused-vars */
// Base component for setting Feed List.

import { useCallback, useContext, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { HelmetProvider } from "react-helmet-async";
import LMFeedViewTopicDropdown from "./lmTopicFeed/LMFeedViewTopicDropdown";
import { TopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMFeedDetails from "./LMFeedDetails";
import { Post } from "../shared/types/models/post";
import { ROUTES } from "../shared/constants/lmRoutesConstant";
import Posts from "./LMFeedPosts";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import LMFeedCreatePost from "./LMFeedCreatePost";
import LMFeedAllMembers from "./LMFeedAllMembers";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";

interface LMFeedUniversalFeedProps {
  PostView?: React.FC;
  Shimmer?: React.FC;
  FooterView?: React.FC;
  HeaderView?: React.FC;
  likeActionCall?: () => void;
}

const LMFeedUniversalFeed = (props: LMFeedUniversalFeedProps) => {
  const {
    topics = {},
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds = true,
    feedList = [],
    feedUsersList = {},
    getNextPage = () => {},
    deletePost,
    pinPost,
    likePost,
  } = useContext(LMFeedDataContext);
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scrollPos = sessionStorage.getItem("scroll-pos");
    if (scrollPos) {
      const el = document.getElementById(scrollPos);
      el?.scrollIntoView();
    }
  }, [wrapperRef]);
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
            likePost: likePost,
          }}
        >
          {CustomComponents?.PostView || (
            <Posts post={post} user={filteredUser} />
          )}
        </FeedPostContext.Provider>
      );
    });
  }, [
    CustomComponents?.PostView,
    deletePost,
    feedList,
    feedUsersList,
    likePost,
    pinPost,
    topics,
  ]);
  useEffect(() => {
    const el = wrapperRef.current;
    return () => {
      console.log(el?.scrollTop);
    };
  }, [wrapperRef]);
  return (
    <div ref={wrapperRef} className="lm-feed-wrapper lm-d-flex">
      <div
        className="lm-flex-grow"
        id="feed-scroller"
        // style={{
        //   overflow: "auto",
        // }}
      >
        <LMFeedCreatePost showStarterComponent />
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
          scrollThreshold={0.6}

          // scrollableTarget="feed-scroller"
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
