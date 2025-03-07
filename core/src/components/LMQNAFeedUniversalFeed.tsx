/* eslint-disable @typescript-eslint/no-unused-vars */
// Base component for setting Feed List.

import { useCallback, useContext, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LMFeedViewTopicDropdown from "./lmTopicFeed/LMFeedViewTopicDropdown";
import { LMTopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { Post } from "../shared/types/models/post";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import LMFeedAllMembers from "./LMFeedAllMembers";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";
import { FeedSideNavbarContext } from "../contexts/LMFeedSideNavbarContext";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMFeedNotificationAnalytics } from "../shared/enums/lmNotificationAnalytics";
import LMQNAFeedCreatePost from "./LMQNAFeedCreatePost";
import LMQNAFeedPosts from "./LMQNAFeedPosts";
import LMFeedLeftNavigation from "./LMFeedLeftNavigation";
import { useSideNavbar } from "../hooks/useSideNavbar";
import { LMFeedModeration } from "./LMFeedModeration";
import { SideNavbarState } from "../shared/enums/lmSideNavbar";

interface LMFeedUniversalFeedProps {
  PostView?: React.FC;
  Shimmer?: React.FC;
  FooterView?: React.FC;
  HeaderView?: React.FC;
  likeActionCall?: () => void;
}

const LMQNAFeedUniversalFeed = (props: LMFeedUniversalFeedProps) => {
  const {
    topics = {},
    widgets = {},
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds = true,
    feedList = [],
    feedUsersList = {},
    getNextPage = () => {},
    deletePost,
    pinPost,
    likePost,
    clickNavigator,
    postComponentClickCustomCallback,
  } = useContext(LMFeedDataContext);
  const { lmfeedAnalyticsClient, customEventClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { selectedNav, selectNav } = useSideNavbar();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scrollPos = sessionStorage.getItem("scroll-pos");
    if (scrollPos) {
      const el = document.getElementById(scrollPos);
      el?.scrollIntoView();
    }
  }, [wrapperRef]);
  useEffect(() => {
    lmfeedAnalyticsClient?.sendFeedOpenedEvent();
  }, [lmfeedAnalyticsClient]);
  useEffect(() => {
    customEventClient?.listen(
      LMFeedNotificationAnalytics.NOTIFICATION_PAGE_OPENED,
      () => {
        lmfeedAnalyticsClient?.sendNotificationPageOpenedEvent();
      },
    );
    return () => {
      customEventClient?.remove(
        LMFeedNotificationAnalytics.NOTIFICATION_PAGE_OPENED,
      );
    };
  }, [customEventClient, lmfeedAnalyticsClient]);
  const renderFeeds = useCallback(() => {
    return feedList.map((post: Post) => {
      const postUuid = post.uuid;
      const usersArray = Object.values(feedUsersList);
      const filteredUser = usersArray.find(
        (user) => user.sdkClientInfo.uuid === postUuid,
      );

      return (
        <FeedPostContext.Provider
          key={post.id}
          value={{
            post: post,
            users: feedUsersList,
            topics: topics,
            widgets,
            deletePost: deletePost,
            pinPost: pinPost,
            likePost: likePost,
            postComponentClickCustomCallback,
            clickNavigator: clickNavigator,
          }}
        >
          {CustomComponents?.CustomPostView || (
            <LMQNAFeedPosts post={post} user={filteredUser} />
          )}
        </FeedPostContext.Provider>
      );
    });
  }, [
    CustomComponents?.CustomPostView,
    clickNavigator,
    deletePost,
    feedList,
    feedUsersList,
    likePost,
    pinPost,
    postComponentClickCustomCallback,
    topics,
    widgets,
  ]);

  return (
    <FeedSideNavbarContext.Provider value={{ selectedNav, selectNav }}>
      <div ref={wrapperRef} className="lm-feed-wrapper lm-d-flex">
        <div className="lm-sidenav">
          <LMFeedLeftNavigation />
        </div>
        {selectedNav === SideNavbarState.HOME ? (
          <>
            <div className="lm-flex-grow" id="feed-scroller">
              <LMQNAFeedCreatePost showStarterComponent />
              {CustomComponents?.CustomTopicDropDown ? (
                CustomComponents.CustomTopicDropDown
              ) : (
                <div
                  className="lm-mb-4 lm-mt-4"
                  lm-feed-component-id={`lm-feed-topic-dropdown`}
                >
                  <LMFeedViewTopicDropdown
                    mode={LMTopicsDropdownMode.view}
                    selectedTopicIds={selectedTopics}
                    setSelectedTopicsIds={setSelectedTopics}
                  />
                </div>
              )}
              <InfiniteScroll
                dataLength={feedList.length}
                hasMore={loadMoreFeeds}
                next={getNextPage}
                loader={null}
                scrollThreshold={0.6}
              >
                {renderFeeds()}
              </InfiniteScroll>
            </div>
            <div className="lm-member">
              <LMFeedAllMembers />
            </div>
          </>
        ) : selectedNav === SideNavbarState.MODERATION ? (
          <LMFeedModeration />
        ) : null}
      </div>
    </FeedSideNavbarContext.Provider>
  );
};

export default LMQNAFeedUniversalFeed;
