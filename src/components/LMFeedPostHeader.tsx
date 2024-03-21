import React, { useContext, useMemo } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { formatTimeAgo } from "../shared/utils";
import { EDITED, POST } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";
import { useNavigate } from "react-router-dom";

const LMFeedPostHeader = () => {
  const { post, users } = useContext(FeedPostContext);
  const { createdAt, isEdited } = post!;
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
        <div>{/* menu drop down */}</div>
      </div>
    </>
  );
};

export default LMFeedPostHeader;
