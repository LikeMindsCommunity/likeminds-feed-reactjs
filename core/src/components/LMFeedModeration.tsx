import { useModeration } from "../hooks/useModeration";
import PostApprovalDisabledIcon from "../assets/images/moderation-disabled-icon1.svg";
import EmptyModeartionSizeIcon from "../assets/images/moderation-disabled-icon2.svg";
import { Post } from "../shared/types/models/post";
import LMFeedModerationPosts from "./LMFeedModerationPosts";
import { useCallback, useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";

export const LMFeedModeration = () => {
  const {
    selectTab,
    selectedTab,
    isPostApprovalEnabled,
    posts,
    users,
    topics,
    widgets,
    reports,
  } = useModeration();
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  const renderFeeds = useCallback(() => {
    return posts?.map((post: Post) => {
      const postUuid = post.uuid;
      const usersArray = Object.values(users);
      const filteredUser = usersArray.find(
        (user) => user.sdkClientInfo.uuid === postUuid,
      );

      return (
        <FeedPostContext.Provider
          key={post?.id}
          value={{
            post: post,
            users: users,
            topics: topics,
            widgets,
          }}
        >
          {CustomComponents?.CustomPostView || (
            <LMFeedModerationPosts post={post} user={filteredUser} />
          )}
        </FeedPostContext.Provider>
      );
    });
  }, [CustomComponents?.CustomPostView, posts, users]);

  return (
    <>
      <FeedModerationContext.Provider
        value={{
          selectTab,
          selectedTab,
          isPostApprovalEnabled,
          reports,
          posts,
          users,
          widgets,
          topics,
        }}
      >
        <div className="lm-flex-grow" id="feed-scroller">
          <div className="lm-moderation-header">
            <div className="lm-moderation-header__left">
              <button
                className={
                  "lm-moderation-header__button lm-text-capitalize" +
                  (selectedTab === "approval" ? " selected-button" : "") +
                  " post-approval-button-custom-style"
                }
                onClick={() => {
                  selectTab("approval");
                }}
              >
                Post Approval
                <span
                  className={
                    "lm-moderation-header__count" +
                    (selectedTab === "approval" ? " selected-count" : "")
                  }
                >
                  {reports.length > 0 ? reports.length : null}
                </span>
              </button>

              <button
                className={
                  "lm-moderation-header__button lm-text-capitalize" +
                  (selectedTab === "reported" ? " selected-button" : "")
                }
                onClick={() => {
                  selectTab("reported");
                }}
              >
                Post/Comment Reported
                <span
                  className={
                    "lm-moderation-header__count" +
                    (selectedTab === "reported" ? " selected-count" : "")
                  }
                >
                  3
                </span>
              </button>
            </div>

            <button
              className={
                "lm-moderation-header__button lm-text-capitalize" +
                (selectedTab === "closed" ? " selected-button" : "")
              }
              onClick={() => {
                selectTab("closed");
              }}
            >
              Closed Reports
            </button>
          </div>
          <hr className="moderation-separator" />
          {isPostApprovalEnabled ? (
            <InfiniteScroll
              dataLength={posts.length}
              hasMore={true}
              next={() => {}}
              // TODO set shimmer on loader component
              loader={null}
              scrollThreshold={0.6}
            >
              {renderFeeds()}
            </InfiniteScroll>
          ) : (
            <>
              {selectedTab === "approval" ? (
                <div className="white-bg-container">
                  <img
                    src={PostApprovalDisabledIcon}
                    alt="post approval"
                    className="disabled-icons-size"
                  />
                  <div className="moderation-disabled-heading">
                    Looks like post approval is disabled
                  </div>
                  <div className="moderation-disabled-subheading">
                    Please go to the{" "}
                    <span className="moderation-disabled-path">
                      dashboard {">"} settings {">"} enable post approval
                    </span>
                  </div>
                </div>
              ) : selectedTab === "reported" ? (
                <div className="white-bg-container">
                  <img
                    src={EmptyModeartionSizeIcon}
                    alt="post approval"
                    className="disabled-icons-size"
                  />
                  <div className="moderation-disabled-heading">
                    Everything looks fine. No Post or Comment reported
                  </div>
                  <div className="moderation-disabled-subheading">
                    Reported Post or comment will be visible here.
                  </div>
                </div>
              ) : selectedTab === "closed" ? (
                <div className="white-bg-container">
                  <img
                    src={EmptyModeartionSizeIcon}
                    alt="post approval"
                    className="disabled-icons-size"
                  />
                  <div className="moderation-disabled-heading">
                    Everything looks fine. No Closed reports.
                  </div>
                  <div className="moderation-disabled-subheading">
                    Closed reports will be visible here.
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </FeedModerationContext.Provider>
    </>
  );
};
