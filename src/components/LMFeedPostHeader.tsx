import React, { useContext, useMemo, useState } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { formatTimeAgo } from "../shared/utils";
import { EDITED, POST } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";
import { useNavigate } from "react-router-dom";
import { Dialog, Menu } from "@mui/material";
import { LMFeedPostMenuItems } from "../shared/constants/lmFeedPostMenuItems";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import LMFeedReportPostDialog from "./LMFeedReportPostDialog";
import { LMFeedEntityType } from "../shared/constants/lmEntityType";
import threeDotMenuIcon from "../assets/images/3-dot-menu-post-header.svg";
import pinIcon from "../assets/images/Icon-pin_new.svg";
import LMFeedDeleteDialogBox from "./lmDialogs/LMFeedDeleteDialogBox";
import { LMFeedDeletePostModes } from "../shared/enums/lmDeleteDialogModes";
const LMFeedPostHeader = () => {
  const { customEventClient } = useContext(LMFeedGlobalClientProviderContext);
  const { post, users, topics, pinPost } = useContext(FeedPostContext);
  const { LMPostHeaderStyles, CustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
  const {
    postHeaderAvatarClickCallback,
    postHeaderTitleClickCallback,
    postHeaderCustomTitleClickCallback,
  } = CustomCallbacks;
  const [openReportPostDialogBox, setOpenReportPostDialogBox] =
    useState<boolean>(false);
  const [openDeletePostDialog, setOpenDeletePostDialog] =
    useState<boolean>(false);
  function closeDeletePostDialog() {
    setOpenDeletePostDialog(false);
  }
  const { createdAt, isEdited, menuItems, isPinned } = post!;
  const { name, imageUrl, customTitle } = useMemo(
    () => users![post!.uuid],
    [post, users],
  );

  const avatarContent = getAvatar({ imageUrl, name });
  const navigate = useNavigate();

  function closeReportDialog() {
    setOpenReportPostDialogBox(false);
  }
  function onMenuItemClick(e: React.MouseEvent) {
    if (!post) {
      return;
    }
    setAnchor(null);
    const menuId = e.currentTarget.id;
    switch (menuId) {
      case LMFeedPostMenuItems.EDIT_POST: {
        if (post && topics) {
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.OPEN_CREATE_POST_DIALOUGE,
            {
              post: post,
              topics: topics,
            },
          );
        }
        break;
      }
      case LMFeedPostMenuItems.REPORT_POST: {
        setOpenReportPostDialogBox(true);
        break;
      }
      case LMFeedPostMenuItems.DELETE_POST: {
        setOpenDeletePostDialog(true);
        break;
      }
      case LMFeedPostMenuItems.PIN_POST: {
        if (pinPost) {
          pinPost(post.Id);
        }
        break;
      }
      case LMFeedPostMenuItems.UNPIN_POST: {
        if (pinPost) {
          pinPost(post?.Id);
        }
        break;
      }
    }
  }
  const [anchor, setAnchor] = useState<HTMLImageElement | null>(null);
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
          entityId={post?.Id || ""}
        />
      </Dialog>
      {/* <div
        className="lm-feed-wrapper__card__header"
        lm-feed-component-id={`lm-feed-post-wrapper-INSERT_RANDOM_STRING_HERE-${post?.Id}`}
      >
        <div className="lm-flex-container">
          <div
            className="lm-avatar lm-mr-5"
            style={LMPostHeaderStyles?.avatar}
            onClick={() => {
              if (postHeaderAvatarClickCallback) {
                postHeaderAvatarClickCallback(navigate);
              }
            }}
          >
            {avatarContent}
          </div>
          <div>
            <div
              className="lm-feed-wrapper__card__header--title"
              style={LMPostHeaderStyles?.title}
              onClick={() => {
                if (postHeaderTitleClickCallback) {
                  postHeaderTitleClickCallback(navigate);
                }
              }}
            >
              {name}{" "}
              {customTitle ? (
                <span
                  style={LMPostHeaderStyles?.customTitle}
                  onClick={() => {
                    if (postHeaderCustomTitleClickCallback) {
                      postHeaderCustomTitleClickCallback(navigate);
                    }
                  }}
                >
                  {customTitle}
                </span>
              ) : null}
            </div>
            <div className="lm-feed-wrapper__card__header--text">
              {isEdited ? (
                <>
                  <span className="edited">{formatTimeAgo(createdAt)}</span>
                  <span
                    className="lm-primary-text"
                    style={LMPostHeaderStyles?.editBadge}
                  >
                    {LMPostHeaderStyles?.editBadgeCustomText
                      ? LMPostHeaderStyles.editBadgeCustomText
                      : EDITED}
                  </span>
                </>
              ) : (
                <>
                  {LMPostHeaderStyles?.postBadgeText || POST}
                  <span>{formatTimeAgo(createdAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="lm-feed-wrapper__card__header__menu-items-container">
          {isPinned ? (
            <img
              className="three-dot-menu-image lm-cursor-pointer lm-mr-4"
              src={pinIcon}
              alt="3-dot-menu"
            />
          ) : null}

          <img
            className="three-dot-menu-image lm-cursor-pointer"
            src={threeDotMenuIcon}
            alt="3-dot-menu"
            onClick={(e) => {
              setAnchor(e.currentTarget);
            }}
          />
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            anchorOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            onClose={() => setAnchor(null)}
          >
            {menuItems?.map((menuItem) => {
              return (
                <div
                  className="three-dot-menu-options lm-cursor-pointer lm-hover-effect"
                  onClick={onMenuItemClick}
                  id={menuItem?.id?.toString()}
                  key={menuItem?.id}
                >
                  {menuItem?.title}
                </div>
              );
            })}
          </Menu>
        </div>
      </div> */}
      <div
        className="lm-feed-wrapper__card__header"
        lm-feed-component-id={`lm-feed-post-wrapper-abcde-${post?.Id}`}
      >
        <div className="lm-flex-container">
          <div
            className="lm-avatar lm-mr-5"
            style={LMPostHeaderStyles?.avatar}
            onClick={() => {
              if (postHeaderAvatarClickCallback) {
                postHeaderAvatarClickCallback(navigate);
              }
            }}
            lm-feed-component-id={`lm-feed-post-wrapper-fghij-${post?.Id}`}
          >
            {avatarContent}
          </div>
          <div lm-feed-component-id={`lm-feed-post-wrapper-klmno-${post?.Id}`}>
            <div
              className="lm-feed-wrapper__card__header--title"
              style={LMPostHeaderStyles?.title}
              onClick={() => {
                if (postHeaderTitleClickCallback) {
                  postHeaderTitleClickCallback(navigate);
                }
              }}
              lm-feed-component-id={`lm-feed-post-wrapper-pqrst-${post?.Id}`}
            >
              {name}{" "}
              {customTitle ? (
                <span
                  style={LMPostHeaderStyles?.customTitle}
                  onClick={() => {
                    if (postHeaderCustomTitleClickCallback) {
                      postHeaderCustomTitleClickCallback(navigate);
                    }
                  }}
                  lm-feed-component-id={`lm-feed-post-wrapper-uvwxy-${post?.Id}`}
                >
                  {customTitle}
                </span>
              ) : null}
            </div>
            <div
              className="lm-feed-wrapper__card__header--text"
              lm-feed-component-id={`lm-feed-post-wrapper-zabcd-${post?.Id}`}
            >
              {isEdited ? (
                <>
                  <span
                    className="edited"
                    lm-feed-component-id={`lm-feed-post-wrapper-efghi-${post?.Id}`}
                  >
                    {formatTimeAgo(createdAt)}
                  </span>
                  <span
                    className="lm-primary-text"
                    style={LMPostHeaderStyles?.editBadge}
                    lm-feed-component-id={`lm-feed-post-wrapper-jklmn-${post?.Id}`}
                  >
                    {LMPostHeaderStyles?.editBadgeCustomText
                      ? LMPostHeaderStyles.editBadgeCustomText
                      : EDITED}
                  </span>
                </>
              ) : (
                <>
                  {LMPostHeaderStyles?.postBadgeText || POST}
                  <span
                    lm-feed-component-id={`lm-feed-post-wrapper-opqrs-${post?.Id}`}
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
          lm-feed-component-id={`lm-feed-post-wrapper-tuvwx-${post?.Id}`}
        >
          {isPinned ? (
            <img
              className="three-dot-menu-image lm-cursor-pointer lm-mr-4"
              src={pinIcon}
              alt="3-dot-menu"
              lm-feed-component-id={`lm-feed-post-wrapper-yzabc-${post?.Id}`}
            />
          ) : null}
          <img
            className="three-dot-menu-image lm-cursor-pointer"
            src={threeDotMenuIcon}
            alt="3-dot-menu"
            onClick={(e) => {
              setAnchor(e.currentTarget);
            }}
            lm-feed-component-id={`lm-feed-post-wrapper-defgh-${post?.Id}`}
          />
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => setAnchor(null)}
            lm-feed-component-id={`lm-feed-post-wrapper-ijklm-${post?.Id}`}
          >
            {menuItems?.map((menuItem) => {
              return (
                <div
                  className="three-dot-menu-options lm-cursor-pointer lm-hover-effect"
                  onClick={onMenuItemClick}
                  id={menuItem?.id?.toString()}
                  key={menuItem?.id}
                  lm-feed-component-id={`lm-feed-post-wrapper-nopqr-${post?.Id}`}
                >
                  {menuItem?.title}
                </div>
              );
            })}
          </Menu>
        </div>
      </div>
    </>
  );
};

export default LMFeedPostHeader;
