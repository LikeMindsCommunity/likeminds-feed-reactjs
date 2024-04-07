import React, { useContext, useMemo, useState } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { formatTimeAgo } from "../shared/utils";
import { EDITED, POST } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/material";
import threeDotMenuIcon from "../assets/images/3-dot-menu-post-header.svg";
import { LMFeedPostMenuItems } from "../shared/constants/lmFeedPostMenuItems";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
const LMFeedPostHeader = () => {
  const { customEventClient } = useContext(LMFeedGlobalClientProviderContext);
  const { post, users } = useContext(FeedPostContext);
  const { createdAt, isEdited, menuItems } = post!;
  const { name, imageUrl, customTitle } = useMemo(
    () => users![post!.uuid],
    [post, users],
  );

  const avatarContent = getAvatar({ imageUrl, name });
  const navigate = useNavigate();
  const { LMPostHeaderStyles, CustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
  const {
    postHeaderAvatarClickCallback,
    postHeaderTitleClickCallback,
    postHeaderCustomTitleClickCallback,
  } = CustomCallbacks;

  function onMenuItemClick(e: React.MouseEvent) {
    const menuId = e.currentTarget.id;
    switch (menuId) {
      case LMFeedPostMenuItems.EDIT_POST: {
        console.log(menuId);
        customEventClient?.dispatchEvent("OPEN_MENU", {
          post: post,
        });
        break;
      }
      case LMFeedPostMenuItems.REPORT_POST: {
        console.log(menuId);
        break;
      }
    }
  }

  const [anchor, setAnchor] = useState<HTMLImageElement | null>(null);
  return (
    <>
      <div className="lm-feed-wrapper__card__header">
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
                  className="three-dot-menu-options"
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
      </div>
    </>
  );
};

export default LMFeedPostHeader;
