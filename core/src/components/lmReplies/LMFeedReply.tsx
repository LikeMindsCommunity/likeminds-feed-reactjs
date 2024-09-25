import { useContext, useState } from "react";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import { formatTimeAgo } from "../../shared/utils";
import likeIcon from "../../assets/images/like-sm.svg";
import commentLiked from "../../assets/images/liked-sm.png";
import LMFeedRepliesScroller from "./LMFeedRepliesScroller";

import { LIKE, LIKES } from "../../shared/constants/lmAppConstant";
import LMFeedReplyTextArea from "../../shared/components/LMFeedReplyTextArea";
import repliesThreeDotMenu from "../../assets/images/three-dot-menu-replies.svg";
import { Dialog, Menu } from "@mui/material";
import LMFeedReportPostDialog from "../LMFeedReportPostDialog";
import { LMFeedEntityType } from "../../shared/constants/lmEntityType";
import { LMFeedReplyMode } from "../../shared/constants/lmFeedReplyMode";
import { LMFeedReplyMenuItems } from "../../shared/constants/lmFeedRepliesMenuItems";
import LMFeedReplyEditTextArea from "../../shared/components/LMFeedReplyEditTextArea";
import { parseAndReplaceTags } from "../../shared/taggingParser";
import LMFeedDeleteDialogBox from "../lmDialogs/LMFeedDeleteDialogBox";
import { LMFeedDeletePostModes } from "../../shared/enums/lmDeleteDialogModes";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../../contexts/LMFeedPostContext";
import LMFeedGlobalClientProviderContext from "../../contexts/LMFeedGlobalClientProviderContext";

export interface LMFeedReplyInterface {
  mode: string;
}
const LMFeedReply = ({ mode }: LMFeedReplyInterface) => {
  const { post } = useContext(FeedPostContext);
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { reply, user, likeReply } = useContext(ReplyContext);
  const { LMFeedCustomIcons = {}, CustomComponents = {} } = useContext(
    CustomAgentProviderContext,
  );

  const { name } = user || {};
  const [openReplies, setOpenReplies] = useState<boolean>(false);
  const [openReplyText, setOpenReplyText] = useState<boolean>(false);
  const [threeDotMenuAnchor, setThreeDotMenuAnchor] =
    useState<HTMLDivElement | null>(null);
  const [openReportPostDialogBox, setOpenReportPostDialogBox] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  function closeDeleteDialog() {
    setOpenDeleteDialog(false);
  }
  function closeEditMode() {
    setEditMode(false);
  }
  function startEditMode() {
    setEditMode(true);
  }
  function handleMenuClick(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    setThreeDotMenuAnchor(null);
    switch (id) {
      case LMFeedReplyMenuItems.DELETE: {
        //
        setOpenDeleteDialog(true);
        break;
      }
      case LMFeedReplyMenuItems.REPORT: {
        //
        openReportDialog();
        break;
      }
      case LMFeedReplyMenuItems.EDIT: {
        startEditMode();
        //
        break;
      }
    }
  }
  function closeReportDialog() {
    setOpenReportPostDialogBox(false);
  }
  function openReportDialog() {
    setOpenReportPostDialogBox(true);
  }

  function openThreeDotMenu(e: React.MouseEvent<HTMLImageElement>) {
    if (mode === LMFeedReplyMode.COMMENT) {
      lmfeedAnalyticsClient?.sendCommentMenuClickEvent(post!, reply!);
    }
    setThreeDotMenuAnchor(e.currentTarget);
  }
  function closeThreeDotMenu() {
    setThreeDotMenuAnchor(null);
  }

  return (
    <div className="lm-social-action-bar__lmReply">
      <Dialog open={openDeleteDialog} onClose={closeDeleteDialog}>
        <LMFeedDeleteDialogBox
          onClose={closeDeleteDialog}
          mode={
            mode === LMFeedReplyMode.COMMENT
              ? LMFeedDeletePostModes.COMMENT
              : LMFeedDeletePostModes.REPLY
          }
        />
      </Dialog>
      <Dialog open={openReportPostDialogBox} onClose={closeReportDialog}>
        <LMFeedReportPostDialog
          entityType={
            mode === LMFeedReplyMode.COMMENT
              ? LMFeedEntityType.COMMENT
              : LMFeedEntityType.REPLY
          }
          post={post || undefined}
          comment={
            mode === LMFeedReplyMode.COMMENT
              ? reply || undefined
              : reply?.parentComment || undefined
          }
          reply={reply || undefined}
          closeReportDialog={closeReportDialog}
          entityId={reply?.id || ""}
        />
      </Dialog>
      <Menu
        open={Boolean(threeDotMenuAnchor)}
        anchorEl={threeDotMenuAnchor}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={closeThreeDotMenu}
      >
        {reply?.menuItems.map((menuItem) => {
          return (
            <div
              className="three-dot-menu-options lm-cursor-pointer lm-hover-effect"
              onClick={handleMenuClick}
              id={menuItem?.id?.toString()}
              key={menuItem?.id}
            >
              {menuItem?.title}
            </div>
          );
        })}
      </Menu>
      <div className="lm-social-action-bar__lmReply__userMeta lm-flex-direction">
        <div className="lm-social-action-bar__lmReply__userMeta__content lm-mb-5">
          {editMode ? (
            CustomComponents.CustomEditReplyTextArea ? (
              <CustomComponents.CustomEditReplyTextArea
                closeEditMode={closeEditMode}
              />
            ) : (
              <LMFeedReplyEditTextArea closeEditMode={closeEditMode} />
            )
          ) : (
            <>
              <div className="content-area">
                <div
                  className="lm-social-action-bar__lmReply__userMeta__content--name"
                  onClick={() => {
                    if (mode === LMFeedReplyMode.COMMENT) {
                      lmfeedAnalyticsClient?.sendCommentProfileNameClickEvent(
                        post!,
                        reply!,
                      );
                    } else if (mode === LMFeedReplyMode.REPLY) {
                      lmfeedAnalyticsClient?.sendReplyProfileNameClickEvent(
                        post!,
                        reply!.parentComment!,
                        reply!,
                      );
                    }
                  }}
                >
                  {name}
                </div>
                <div className="lm-social-action-bar__lmReply__userMeta__content--title">
                  {parseAndReplaceTags(reply?.text || "")}
                </div>
              </div>
              <img
                src={repliesThreeDotMenu}
                alt="three-dot-menu"
                className="three-dot-menu lm-cursor-pointer"
                onClick={openThreeDotMenu}
              />
            </>
          )}
        </div>
        <div className="lm-d-flex lm-justify-content-space-between lm-align-items-center lm-mb-5">
          <div className="like lm-d-flex">
            <span
              className="lm-feed-post-like-container"
              onClick={() => {
                if (likeReply) {
                  likeReply(reply?.id || "");
                }
              }}
            >
              {reply?.isLiked ? (
                LMFeedCustomIcons.repliesLikesLikedCustomIcon ? (
                  <LMFeedCustomIcons.repliesLikesLikedCustomIcon />
                ) : (
                  <img
                    src={commentLiked}
                    className="lm-cursor-pointer liked-comment"
                    alt="Like"
                    loading="lazy"
                  />
                )
              ) : LMFeedCustomIcons.repliesLikesNormalCustomIcon ? (
                <LMFeedCustomIcons.repliesLikesNormalCustomIcon />
              ) : (
                <img
                  src={likeIcon}
                  className="lm-cursor-pointer"
                  alt="Like"
                  loading="lazy"
                />
              )}
            </span>

            {reply?.likesCount ? (
              <span>
                {(reply?.likesCount || 0) > 1
                  ? `${reply?.likesCount} ${LIKES}`
                  : (reply?.likesCount || 0) === 1
                    ? `${reply?.likesCount} ${LIKE}`
                    : ""}
              </span>
            ) : (
              ""
            )}

            <span className="pipe">|</span>
            <span>
              {(reply?.level || 0) < 1 && (
                <span
                  className="reply-badge lm-cursor-pointer"
                  onClick={() => {
                    setOpenReplyText(!openReplyText);
                  }}
                >
                  Reply{" "}
                </span>
              )}

              {/* className="replies lm-cursor-pointer commentTitle" */}
              <span
                className={
                  (reply?.commentsCount || 0) > 1
                    ? `replies lm-cursor-pointer commentTitle bullet`
                    : (reply?.commentsCount || 0) === 1
                      ? `replies lm-cursor-pointer commentTitle bullet`
                      : "replies lm-cursor-pointer commentTitle"
                }
                onClick={() => {
                  setOpenReplies((current) => {
                    return !current;
                  });
                }}
              >
                {/* {reply?.commentsCount} = */}
                {(reply?.commentsCount || 0) > 1
                  ? `${reply?.commentsCount} Replies`
                  : (reply?.commentsCount || 0) === 1
                    ? `${reply?.commentsCount} Reply`
                    : ""}
                {/* {`${reply?.commentsCount ? reply.commentsCount.toString().concat(" ") : ""}${(reply?.commentsCount || 0) > 1 ? "Replies" : "Reply"}`} */}
              </span>
            </span>
          </div>
          <div className="like">{formatTimeAgo(reply?.createdAt || 0)}</div>
        </div>
        {openReplyText ? (
          <div className="lm-d-flex lm-flex-grow lm-align-items-center lm-mb-5 lm-feed-reply">
            {CustomComponents.CustomPostReplyTextArea ? (
              <CustomComponents.CustomPostReplyTextArea
                setReplyViewVisibility={setOpenReplyText}
              />
            ) : (
              <LMFeedReplyTextArea setReplyViewVisibility={setOpenReplyText} />
            )}
          </div>
        ) : null}
      </div>
      <div className="lm-social-action-bar__lmReply__commentsScroller">
        {openReplies ? (
          CustomComponents.CustomRepliesScroller ? (
            CustomComponents.CustomRepliesScroller
          ) : (
            <LMFeedRepliesScroller
              postId={post?.id || ""}
              replyId={reply?.id || ""}
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default LMFeedReply;
