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
import { Dialog } from "@mui/material";
import LMFeedEditMemberPermissionsDialog from "./LMFeedEditMemberPermissionsDialog";

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
    comments,
    onApprovedOrRejectPostClicked,
    onApprovedCallback,
    onRejectedCallback,
    editMemberPermissionsHandler,
    updateMemberRightsHandler,
    memberRights,
    isEditPermissionDialogOpen,
    setIsEditPermissionDialogOpen,
    modifiedRights,
    setModifiedRights,
    customTitle,
    setCustomTitle,
    currentReport,
    setCurrentReport,
  } = useModeration();
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  const renderFeeds = useCallback(() => {
    return posts?.map((post: Post) => {
      return post?.attachments.length === 0 ? (
        <FeedPostContext.Provider
          key={post?.id}
          value={{
            post,
            users,
            topics,
            widgets,
          }}
        >
          {CustomComponents?.CustomPostView ||
            (post && <LMFeedModerationPosts post={post} />)}
        </FeedPostContext.Provider>
      ) : null;
    });
  }, [
    CustomComponents?.CustomPostView,
    posts,
    users,
    topics,
    widgets,
    reports,
  ]);

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
          comments,
          onApprovedOrRejectPostClicked,
          onApprovedCallback,
          onRejectedCallback,
          editMemberPermissionsHandler,
          updateMemberRightsHandler,
          memberRights,
          isEditPermissionDialogOpen,
          setIsEditPermissionDialogOpen,
          modifiedRights,
          setModifiedRights,
          customTitle,
          setCustomTitle,
          currentReport,
          setCurrentReport,
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
                  {posts.length > 0 ? posts.length : 0}
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
                  {posts.length > 0 ? posts.length : 0}
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
        <Dialog
          open={isEditPermissionDialogOpen}
          onClose={() => {
            setIsEditPermissionDialogOpen(false);
          }}
        >
          <LMFeedEditMemberPermissionsDialog />
        </Dialog>
      </FeedModerationContext.Provider>
    </>
  );
};
