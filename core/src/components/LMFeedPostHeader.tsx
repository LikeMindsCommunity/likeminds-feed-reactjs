import React, { useContext, useMemo, useState } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { changePostCase, formatTimeAgo } from "../shared/utils";
import { EDITED } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";
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
import { WordAction } from "../shared/enums/wordAction";
const LMFeedPostHeader = () => {
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { customEventClient } = useContext(LMFeedGlobalClientProviderContext);
  const { post, users, topics, pinPost, hidePost, widgets } =
    useContext(FeedPostContext);
  const { LMPostHeaderStyles, LMFeedCustomIcons } = useContext(
    CustomAgentProviderContext,
  );

  const [openReportPostDialogBox, setOpenReportPostDialogBox] =
    useState<boolean>(false);
  const [openDeletePostDialog, setOpenDeletePostDialog] =
    useState<boolean>(false);
  const [anchor, setAnchor] = useState<HTMLImageElement | null>(null);
  function closeDeletePostDialog() {
    setOpenDeletePostDialog(false);
  }
  const { createdAt, isEdited, menuItems, isPinned } = post!;
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
  function onMenuItemClick(e: React.MouseEvent) {
    if (!post) {
      return;
    }
    const newPost = { ...post };
    newPost.attachments = newPost.attachments.map((attachment) => {
      if (attachment.attachmentType === 6) {
        const newAttachment = { ...attachment };
        const pollWidget = widgets![attachment.attachmentMeta.entityId!];
        const {
          title,
          pollType,
          multipleSelectState,
          multipleSelectNumber,
          isAnonymous,
          expiryTime,
          allowAddOption,
        } = pollWidget.metadata;
        const options = pollWidget.LmMeta.options.map(
          (option: { text: string }) => option.text,
        );

        Object.assign(newAttachment.attachmentMeta, {
          title,
          pollQuestion: title,
          pollType,
          multipleSelectState,
          multipleSelectNumber,
          isAnonymous,
          expiryTime,
          allowAddOption,
          options,
        });
        return newAttachment;
      } else {
        return attachment;
      }
    });
    setAnchor(null);
    const menuId = e.currentTarget.id;
    switch (menuId) {
      case LMFeedPostMenuItems.EDIT_POST: {
        if (post && topics) {
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.OPEN_CREATE_POST_DIALOUGE,
            {
              post: newPost,
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
          pinPost(post?.id);
        }
        break;
      }
      case LMFeedPostMenuItems.UNPIN_POST: {
        if (pinPost) {
          pinPost(post?.id);
        }
        break;
      }
      case LMFeedPostMenuItems.HIDE_POST: {
        if (hidePost) {
          hidePost(post?.id);
        }
        break;
      }
      case LMFeedPostMenuItems.UNHIDE_POST: {
        if (hidePost) {
          hidePost(post?.id);
        }
        break;
      }
    }
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

      <div
        className="lm-feed-wrapper__card__header"
        lm-feed-component-id={`lm-feed-post-header-abcde-${post?.id}`}
        onClick={() => {
          lmfeedAnalyticsClient?.sendPostCommentClickEvent(post!);
          const location = window.location;
          const url = new URL(location.href);
          const search = url.searchParams.get("id");
          if (!search) {
            url.searchParams.append("id", post?.id || "");
            window.open(url, "_self");
          }
        }}
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
          <img
            className="three-dot-menu-image lm-cursor-pointer"
            src={threeDotMenuIcon}
            alt="3-dot-menu"
            onClick={(e) => {
              setAnchor(e.currentTarget);
              lmfeedAnalyticsClient?.sendPostMenuClickEvent(post!);
            }}
            lm-feed-component-id={`lm-feed-post-header-defgh-${post?.id}`}
          />
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => setAnchor(null)}
            lm-feed-component-id={`lm-feed-post-header-ijklm-${post?.id}`}
          >
            {menuItems?.map((menuItem) => {
              return (
                <div
                  className="three-dot-menu-options lm-cursor-pointer lm-hover-effect"
                  onClick={onMenuItemClick}
                  id={menuItem?.id?.toString()}
                  key={menuItem?.id}
                  lm-feed-component-id={`lm-feed-post-header-nopqr-${post?.id}`}
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
