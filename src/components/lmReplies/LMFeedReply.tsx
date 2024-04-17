import { useContext, useState } from "react";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import { formatTimeAgo } from "../../shared/utils";
import likeIcon from "../../assets/images/like-sm.svg";
import LMFeedRepliesScroller from "./LMFeedRepliesScroller";
import { useNavigate, useParams } from "react-router-dom";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
import {
  COMMENT_TILE_MODE,
  COMMNENT,
  COMMNENTS,
  LIKE,
  LIKES,
} from "../../shared/constants/lmAppConstant";
import LMFeedReplyTextArea from "../../shared/components/LMFeedReplyTextArea";
import repliesThreeDotMenu from "../../assets/images/three-dot-menu-replies.svg";
import { Dialog, Menu } from "@mui/material";
import LMFeedReportPostDialog from "../LMFeedReportPostDialog";
import { LMFeedEntityType } from "../../shared/constants/lmEntityType";
import { LMFeedReplyMode } from "../../shared/constants/lmFeedReplyMode";
import { LMFeedReplyMenuItems } from "../../shared/constants/lmFeedRepliesMenuItems";
import LMFeedReplyEditTextArea from "../../shared/components/LMFeedReplyEditTextArea";
import { parseAndReplaceTags } from "../../shared/taggingParser";
import LMFeedDeleteDialogBox from "../LMFeedDeleteDialogBox";
interface LMFeedReplyInterface {
  mode: string;
}
const LMFeedReply = ({ mode }: LMFeedReplyInterface) => {
  const { reply, user } = useContext(ReplyContext);
  const { CustomCallbacks = {} } = useContext(CustomAgentProviderContext);
  const {
    commentLikeActionCallback,
    commentTextContentClickCallback,
    commentUsernameClickCallback,
    replyLikeActionCallback,
    repliesCountClickCallback,
    replyTextContentClickCallback,
    replyUsernameClickCallback,
    replyActionButtonClickCallback,
  } = CustomCallbacks;
  const { id = "" } = useParams();

  const { name } = user || {};
  const [openReplies, setOpenReplies] = useState<boolean>(false);
  const [openReplyText, setOpenReplyText] = useState<boolean>(false);
  const [threeDotMenuAnchor, setThreeDotMenuAnchor] =
    useState<HTMLDivElement | null>(null);
  const [openReportPostDialogBox, setOpenReportPostDialogBox] =
    useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(true);
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
    switch (id) {
      case LMFeedReplyMenuItems.DELETE: {
        //
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
  const navigate = useNavigate();
  function openThreeDotMenu(e: React.MouseEvent<HTMLImageElement>) {
    setThreeDotMenuAnchor(e.currentTarget);
  }
  function closeThreeDotMenu() {
    setThreeDotMenuAnchor(null);
  }

  return (
    <div className="lm-social-action-bar__lmReply">
      <Dialog open={openDeleteDialog} onClose={closeDeleteDialog}>
        <LMFeedDeleteDialogBox />
      </Dialog>
      <Dialog open={openReportPostDialogBox} onClose={closeReportDialog}>
        <LMFeedReportPostDialog
          entityType={
            mode === LMFeedReplyMode.COMMENT
              ? LMFeedEntityType.COMMENT
              : LMFeedEntityType.REPLY
          }
          closeReportDialog={closeReportDialog}
          entityId={reply?.Id || ""}
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
            <LMFeedReplyEditTextArea closeEditMode={closeEditMode} />
          ) : (
            <>
              <div className="content-area">
                <div
                  className="lm-social-action-bar__lmReply__userMeta__content--name"
                  onClick={() => {
                    switch (mode) {
                      case COMMENT_TILE_MODE: {
                        if (commentUsernameClickCallback) {
                          commentUsernameClickCallback(navigate);
                        }
                        break;
                      }
                      default: {
                        if (replyUsernameClickCallback) {
                          replyUsernameClickCallback(navigate);
                        }
                      }
                    }
                  }}
                >
                  {name}
                </div>
                <div
                  className="lm-social-action-bar__lmReply__userMeta__content--title"
                  onClick={() => {
                    switch (mode) {
                      case COMMENT_TILE_MODE: {
                        if (commentTextContentClickCallback) {
                          commentTextContentClickCallback(navigate);
                        }
                        break;
                      }
                      default: {
                        if (replyTextContentClickCallback) {
                          replyTextContentClickCallback(navigate);
                        }
                      }
                    }
                  }}
                >
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
            <img
              src={likeIcon}
              className="lm-cursor-pointer"
              alt="Like"
              onClick={() => {
                switch (mode) {
                  case COMMENT_TILE_MODE: {
                    if (commentLikeActionCallback) {
                      commentLikeActionCallback(navigate);
                    }
                    break;
                  }
                  default: {
                    if (replyLikeActionCallback) {
                      replyLikeActionCallback(navigate);
                    }
                  }
                }
              }}
              loading="lazy"
            />
            <span>{`${reply?.likesCount ? reply?.likesCount.toString().concat(" ") : ""}${(reply?.likesCount || 0) > 1 ? LIKES : LIKE}`}</span>
            <span>|</span>
            <span>
              {(reply?.level || 0) < 1 && (
                <span
                  className="reply-badge lm-cursor-pointer"
                  onClick={() => {
                    if (replyActionButtonClickCallback) {
                      replyActionButtonClickCallback(navigate);
                    }
                    setOpenReplyText(!openReplyText);
                  }}
                >
                  Reply{" "}
                </span>
              )}
              <span
                className="replies lm-cursor-pointer"
                onClick={() => {
                  if (repliesCountClickCallback) {
                    repliesCountClickCallback(navigate);
                  }
                  setOpenReplies((current) => !current);
                }}
              >{`${reply?.commentsCount ? reply.commentsCount.toString().concat(" ") : ""}${(reply?.commentsCount || 0) > 1 ? COMMNENTS : COMMNENT}`}</span>
            </span>
          </div>
          <div className="like">{formatTimeAgo(reply?.createdAt || 0)}</div>
        </div>
        {openReplyText ? (
          <div className="lm-d-flex lm-flex-grow lm-align-items-center lm-mb-5 lm-feed-reply">
            <LMFeedReplyTextArea setOpenReplyText={setOpenReplyText} />
          </div>
        ) : null}
      </div>
      <div className="lm-social-action-bar__lmReply__commentsScroller">
        {openReplies && (
          <LMFeedRepliesScroller
            postId={id.split("-")[0]}
            replyId={reply?.Id || ""}
          />
        )}
      </div>
    </div>
  );
};

export default LMFeedReply;
