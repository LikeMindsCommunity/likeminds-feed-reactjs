import React, { useContext, useMemo, useState } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { changePostCase, formatTimeAgo } from "../shared/utils";
import { EDITED } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";
import { Dialog } from "@mui/material";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import LMFeedReportPostDialog from "./LMFeedReportPostDialog";
import { LMFeedEntityType } from "../shared/constants/lmEntityType";
import pinIcon from "../assets/images/Icon-pin_new.svg";
import LMFeedDeleteDialogBox from "./lmDialogs/LMFeedDeleteDialogBox";
import { LMFeedDeletePostModes } from "../shared/enums/lmDeleteDialogModes";
import { WordAction } from "../shared/enums/wordAction";
import ApprovalPendingIcon from "../assets/images/approval-pending-icon.svg";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { Post } from "../shared/types/models/post";
import ModerationReportedTitleIcon from "../assets/images/moderation-reported-title.svg";
import WarningIcon from "../assets/images/warning-icon.svg";
import QuestionMarkIcon from "../assets/images/question-mark-icon.svg";

interface LMFeedModerationPostFooterProps {
  postDetails: Post;
}

const LMFeedModerationPostHeader = ({
  postDetails,
}: LMFeedModerationPostFooterProps) => {
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { post, users } = useContext(FeedPostContext);
  const { LMPostHeaderStyles, LMFeedCustomIcons } = useContext(
    CustomAgentProviderContext,
  );
  const { selectedTab } = useContext(FeedModerationContext);
  const { reports, comments } = useContext(FeedModerationContext);
  let membersReported = reports.filter(
    (report) => report.entityId === postDetails.id,
  );

  if (membersReported.length === 0) {
    const commentId = comments.filter(
      (comment) => comment.postId === postDetails.id,
    )[0]?.id;
    membersReported = reports.filter((report) => report.entityId === commentId);
  }

  const isCommentReported = membersReported[0].type === "comment";

  const reportedMemberName = membersReported[0]?.reportedByUser?.name;
  const remainingReportedMembers = membersReported.length - 1;

  const [openReportPostDialogBox, setOpenReportPostDialogBox] =
    useState<boolean>(false);
  const [openDeletePostDialog, setOpenDeletePostDialog] =
    useState<boolean>(false);
  function closeDeletePostDialog() {
    setOpenDeletePostDialog(false);
  }
  const { createdAt, isEdited, isPinned } = post!;
  const user = useMemo(() => {
    if (users) {
      return users![post!.uuid];
    }
  }, [post, users]);
  if (!user) {
    return null;
  }
  const { name, imageUrl, customTitle } = user;
  const avatarContent = getAvatar({ imageUrl, name });

  function closeReportDialog() {
    setOpenReportPostDialogBox(false);
  }

  return (
    <>
      <Dialog open={openDeletePostDialog} onClose={closeDeletePostDialog}>
        <LMFeedDeleteDialogBox
          mode={LMFeedDeletePostModes.POST}
          onClose={closeDeletePostDialog}
        />
      </Dialog>
      <Dialog open={openReportPostDialogBox} onClose={closeReportDialog}>
        <LMFeedReportPostDialog
          entityType={LMFeedEntityType.POST}
          closeReportDialog={closeReportDialog}
          entityId={post?.id || ""}
          post={post || undefined}
        />
      </Dialog>

      <div className="modeartion-post-header-alert">
        {selectedTab === "approval" ? (
          <>
            <img
              src={ApprovalPendingIcon}
              alt="approval-pending-icon"
              className="approval-pending-icon"
            />
            <span className="">Approval Pending</span>
          </>
        ) : selectedTab === "reported" ? (
          <>
            <img
              src={ModerationReportedTitleIcon}
              alt="approval-pending-icon"
              className="approval-pending-icon"
            />
            <span className="moderation-post-header-names">
              <span className="moderation-post-header-names__capitalize">
                {reportedMemberName}
              </span>{" "}
              {remainingReportedMembers > 0
                ? " & " +
                  (remainingReportedMembers === 1
                    ? remainingReportedMembers + " other "
                    : remainingReportedMembers + " others ")
                : null}
              <span className="moderation-post-header-title-end">
                {isCommentReported
                  ? " reported a comment on this post."
                  : " reported this post."}
              </span>
            </span>
          </>
        ) : (
          <>
            <div className="closed-header-wrapper">
              <div className="moderation-closed-header">
                {isCommentReported ? (
                  <img
                    src={WarningIcon}
                    alt="warning-icon"
                    className="warning-icon"
                  />
                ) : (
                  <img
                    src={ModerationReportedTitleIcon}
                    alt="approval-pending-icon"
                    className="approval-pending-icon"
                  />
                )}
                <span className="moderation-post-header-names">
                  <span className="moderation-post-header-names__capitalize">
                    {reportedMemberName}
                  </span>{" "}
                  {remainingReportedMembers > 0
                    ? " & " +
                      (remainingReportedMembers === 1
                        ? remainingReportedMembers + " other "
                        : remainingReportedMembers + " others ")
                    : null}
                  <span className="moderation-post-header-title-end">
                    {isCommentReported
                      ? " reported a comment on this post."
                      : " reported this post."}
                  </span>
                </span>
              </div>
              <div>
                {isCommentReported ? (
                  <img
                    src={QuestionMarkIcon}
                    alt="question-mark-icon"
                    className="question-mark-icon closed-header-wrapper-question-icon"
                  />
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className="lm-feed-wrapper__card__header"
        lm-feed-component-id={`lm-feed-post-header-abcde-${post?.id}`}
      >
        <div className="lm-flex-container">
          <div
            className="lm-avatar lm-mr-5"
            onClick={() => {
              lmfeedAnalyticsClient?.sendPostProfilePicClickEvent(post!);
            }}
            style={LMPostHeaderStyles?.avatar}
            lm-feed-component-id={`lm-feed-post-header-fghij-${post?.id}`}
          >
            {avatarContent}
          </div>
          <div lm-feed-component-id={`lm-feed-post-header-klmno-${post?.id}`}>
            <div
              onClick={() =>
                lmfeedAnalyticsClient?.sendPostProfileNameClickEvent(post!)
              }
              className="lm-feed-wrapper__card__header--title"
              style={LMPostHeaderStyles?.title}
              lm-feed-component-id={`lm-feed-post-header-pqrst-${post?.id}`}
            >
              {name || ""}{" "}
              {customTitle ? (
                <span
                  style={LMPostHeaderStyles?.customTitle}
                  lm-feed-component-id={`lm-feed-post-header-uvwxy-${post?.id}`}
                >
                  {customTitle}
                </span>
              ) : null}
            </div>
            <div
              className="lm-feed-wrapper__card__header--text"
              lm-feed-component-id={`lm-feed-post-header-zabcd-${post?.id}`}
            >
              {isEdited ? (
                <>
                  <span
                    className="edited"
                    lm-feed-component-id={`lm-feed-post-header-efghi-${post?.id}`}
                  >
                    {formatTimeAgo(createdAt)}
                  </span>
                  <span
                    className="lm-primary-text lm-post-badge"
                    style={LMPostHeaderStyles?.editBadge}
                    lm-feed-component-id={`lm-feed-post-header-jklmn-${post?.id}`}
                  >
                    {LMPostHeaderStyles?.editBadgeCustomText
                      ? LMPostHeaderStyles.editBadgeCustomText
                      : EDITED}
                  </span>
                </>
              ) : (
                <>
                  {changePostCase(
                    WordAction.FIRST_LETTER_CAPITAL_SINGULAR,
                    LMPostHeaderStyles?.postBadgeText,
                  )}
                  <span
                    lm-feed-component-id={`lm-feed-post-header-opqrs-${post?.id}`}
                  >
                    {formatTimeAgo(createdAt)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className="lm-feed-wrapper__card__header__menu-items-container"
          lm-feed-component-id={`lm-feed-post-header-tuvwx-${post?.id}`}
        >
          {isPinned ? (
            LMFeedCustomIcons?.postPinCustomIcon ? (
              <LMFeedCustomIcons.postPinCustomIcon />
            ) : (
              <img
                className="three-dot-menu-image lm-cursor-pointer lm-mr-4"
                src={pinIcon}
                alt="pinned post"
                lm-feed-component-id={`lm-feed-post-header-yzabc-${post?.id}`}
              />
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default LMFeedModerationPostHeader;
