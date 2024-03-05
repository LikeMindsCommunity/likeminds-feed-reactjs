import React, { useContext, useMemo } from "react";
import { FeedPostContext } from "../contexts/FeedPostContext";
import { formatTimeAgo, getAvatar } from "../shared/utils";
import { EDITED, POST } from "../shared/constants/app.constant";
import { CustomAgentProviderContext } from "../contexts/CustomAgentProviderContext";

const LMPostHeader = () => {
  const { post, users } = useContext(FeedPostContext);
  const { createdAt, isEdited } = post!;
  const { name, imageUrl, customTitle } = useMemo(
    () => users![post!.uuid],
    [post, users],
  );
  // Determine the avatar content based on imageUrl and name
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
              {POST}
              <span>{formatTimeAgo(createdAt)}</span>
              {isEdited ? (
                <span
                  className="lm-primary-text"
                  style={LMPostHeaderStyles?.editBadge}
                >
                  {LMPostHeaderStyles?.editBadgeCustomText
                    ? LMPostHeaderStyles.editBadgeCustomText
                    : EDITED}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div>{/* menu drop down */}</div>
      </div>
    </>
  );
};

export default LMPostHeader;
