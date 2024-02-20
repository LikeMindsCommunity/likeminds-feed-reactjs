import React from "react";
import { Post } from "../types/models/post";
import { User } from "../types/models/member";
import { formatTimeAgo, getAvatar } from "../shared/utils";
import { parseAndReplaceTags } from "../shared/taggingParser";

interface FeedProps {
  post: Post;
  user: User | undefined;
}

const Feed: React.FC<FeedProps> = (props) => {
  console.info(props.post);
  const { text, createdAt } = props.post; // Assuming Post has these properties
  const { name, imageUrl, customTitle } = props.user || {};

  // Determine the avatar content based on imageUrl and name
  const avatarContent = getAvatar({ imageUrl, name });

  return (
    <div className="lm-feed-wrapper__card lm-mb-2">
      <div className="lm-feed-wrapper__card__header">
        <div className="lm-flex-container">
          <div className="lm-avatar lm-mr-5">{avatarContent}</div>
          <div>
            <div className="lm-feed-wrapper__card__header--title">
              {name}
              <span>{customTitle}</span>
            </div>
            <div>Post {formatTimeAgo(createdAt)}</div>
          </div>
        </div>
        <div>right</div>
      </div>
      <div className="lm-feed-wrapper__card__body">
        {parseAndReplaceTags(text)}
      </div>
      <div className="lm-feed-wrapper__card__footer">
        {/* <h1>{footer}</h1> */}
      </div>
    </div>
  );
};

export default Feed;
