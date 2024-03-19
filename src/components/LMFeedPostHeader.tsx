import React, { useContext, useMemo } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { formatTimeAgo } from "../shared/utils";
import { EDITED, POST } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { getAvatar } from "../shared/components/LMUserMedia";

const LMFeedPostHeader = () => {
  const { post, users } = useContext(FeedPostContext);
  const { createdAt, isEdited } = post!;
  const { name, imageUrl, customTitle } = useMemo(
    () => users![post!.uuid],
    [post, users],
  );

  const avatarContent = getAvatar({ imageUrl, name });

  const { LMPostHeaderStyles } = useContext(CustomAgentProviderContext);
  return (
    <>
      <div className="lm-feed-wrapper__card__header">
        <div className="lm-flex-container">
          <div className="lm-avatar lm-mr-5" style={LMPostHeaderStyles?.avatar}>
            {avatarContent}
          </div>
          <div>
            <div
              className="lm-feed-wrapper__card__header--title"
              style={LMPostHeaderStyles?.title}
            >
              {name}{" "}
              {customTitle ? (
                <span style={LMPostHeaderStyles?.customTitle}>
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
