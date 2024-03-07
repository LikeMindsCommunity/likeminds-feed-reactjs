import React, { useContext, useMemo } from "react";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { formatTimeAgo, getAvatar } from "../shared/utils";
import { EDITED, POST } from "../shared/constants/lmAppConstant";

const LMPostHeader = () => {
  const { post, users } = useContext(FeedPostContext);
  const { createdAt, isEdited } = post!;
  const { name, imageUrl, customTitle } = useMemo(
    () => users![post!.uuid],
    [post, users],
  );
  // Determine the avatar content based on imageUrl and name
  const avatarContent = getAvatar({ imageUrl, name });
  return (
    <>
      <div className="lm-feed-wrapper__card__header">
        <div className="lm-flex-container">
          <div className="lm-avatar lm-mr-5">{avatarContent}</div>
          <div>
            <div className="lm-feed-wrapper__card__header--title">
              {name} {customTitle ? <span>{customTitle}</span> : null}
            </div>
            <div className="lm-feed-wrapper__card__header--text">
              {POST}
              <span>{formatTimeAgo(createdAt)}</span>
              {isEdited ? (
                <span className="lm-primary-text">{EDITED}</span>
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