import React, { useContext, useMemo, useState } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { changePostCase, formatTimeAgo } from "../shared/utils";
import { EDITED } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";
import { Dialog } from "@mui/material";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import LMFeedReportPostDialog from "./LMFeedReportPostDialog";
import pinIcon from "../assets/images/Icon-pin_new.svg";
import LMFeedDeleteDialogBox from "./lmDialogs/LMFeedDeleteDialogBox";
import { LMFeedDeletePostModes } from "../shared/enums/lmDeleteDialogModes";
import { WordAction } from "../shared/enums/wordAction";
import ApprovalPendingIcon from "../assets/images/approval-pending-icon.svg";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { Report } from "../shared/types/models/report";
import ModerationReportedTitleIcon from "../assets/images/moderation-reported-title.svg";
import WarningIcon from "../assets/images/warning-icon.svg";
import QuestionMarkIcon from "../assets/images/question-mark-icon.svg";
import { ReportEntityType } from "@likeminds.community/feed-js";

interface LMFeedModerationPostFooterProps {
  propReport: Report | undefined;
}

const LMFeedModerationPostHeader = ({
  propReport,
}: LMFeedModerationPostFooterProps) => {
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { post, users } = useContext(FeedPostContext);
  const { LMPostHeaderStyles, LMFeedCustomIcons } = useContext(
    CustomAgentProviderContext,
  );
  const {
    selectedTab,
    handleHeaderLeadingTap,
    handleHeaderTrailingTap,
    handleHeaderTextTap,
  } = useContext(FeedModerationContext);

  const isCommentReported = propReport?.type !== ReportEntityType.POST;

  const reportedMemberName = propReport?.reportedByUser?.name;

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
          entityType={ReportEntityType.POST}
          closeReportDialog={closeReportDialog}
          entityId={post?.id || ""}
          post={post || undefined}
        />
      </Dialog>

      {selectedTab === "closed" && propReport?.actionTaken ? null : (
        <div className="modeartion-post-header-alert activity-header-custom-style">
          {selectedTab === "approval" ? (
            <>
              <img
                onClick={handleHeaderLeadingTap}
                src={ApprovalPendingIcon}
                alt="approval-pending-icon"
                className="approval-pending-icon"
              />
              <span onClick={handleHeaderTextTap}>Approval Pending</span>
            </>
          ) : selectedTab === "reported" ? (
            <>
              <img
                onClick={handleHeaderLeadingTap}
                src={ModerationReportedTitleIcon}
                alt="approval-pending-icon"
                className="approval-pending-icon"
              />
              <span
                className="moderation-post-header-names"
                onClick={handleHeaderTextTap}
              >
                <span className="moderation-post-header-names__capitalize">
                  {reportedMemberName}
                </span>
                <span className="moderation-post-header-title-end">
                  {isCommentReported
                    ? ` reported a ${propReport?.type} on this post.`
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
                      onClick={handleHeaderLeadingTap}
                      src={WarningIcon}
                      alt="warning-icon"
                      className="warning-icon"
                    />
                  ) : (
                    <img
                      onClick={handleHeaderLeadingTap}
                      src={ModerationReportedTitleIcon}
                      alt="approval-pending-icon"
                      className="approval-pending-icon"
                    />
                  )}
                  <span
                    className="moderation-post-header-names"
                    onClick={handleHeaderTextTap}
                  >
                    <span className="moderation-post-header-names__capitalize">
                      {reportedMemberName}
                    </span>
                    <span className="moderation-post-header-title-end">
                      {isCommentReported
                        ? ` reported a ${propReport?.type} on this post.`
                        : " reported this post."}
                    </span>
                  </span>
                </div>
                <div>
                  {isCommentReported ? (
                    <img
                      onClick={handleHeaderTrailingTap}
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
      )}
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
