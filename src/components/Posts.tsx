import React, { useContext } from "react";
import { Post } from "../types/models/post";
import { User } from "../types/models/member";
import { formatTimeAgo, getAvatar } from "../shared/utils";
import { parseAndReplaceTags } from "../shared/taggingParser";
import like from "../assets/images/like.svg";
import commnent from "../assets/images/comment.svg";
import bookmark from "../assets/images/bookmark.svg";
import share from "../assets/images/share.svg";
import LMCommentsScroller from "./LM-Replies/LMCommentsScroller";
import Attachment from "../shared/components/Attachments";
import {
  COMMNENTS,
  EDITED,
  LIKES,
  POST,
} from "../shared/constants/app.constant";
import { COMMNENT, LIKE } from "../shared/constants/app.constant";
import { CustomAgentProviderContext } from "../contexts/CustomAgentProviderContext";
import { LMLikeAction } from "../shared/actions";
interface PostsProps {
  post: Post;
  user: User | undefined;
}

const Posts: React.FC<PostsProps> = (props) => {
  const { text, createdAt, isEdited, attachments, likesCount, commentsCount } =
    props.post;
  const { name, imageUrl, customTitle } = props.user || {};

  const { likeActionCall } = useContext(CustomAgentProviderContext);

  // Determine the avatar content based on imageUrl and name
  const avatarContent = getAvatar({ imageUrl, name });

  // Render attachments
  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) {
      return null;
    }

    return (
      <div className="attachments">
        <Attachment attachments={attachments} />
      </div>
    );
  };

  return (
    <div className="lm-feed-wrapper__card lm-mb-2">
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
      <div className="lm-feed-wrapper__card__body">
        <div className="lm-feed-wrapper__card__body__content">
          {parseAndReplaceTags(text)}
        </div>
        <div className="lm-feed-wrapper__card__body__attachment">
          {renderAttachments()}
        </div>
      </div>
      <div className="lm-feed-wrapper__card__footer">
        <div className="lm-social-action-bar">
          <div className="lm-social-action-bar__actions">
            <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
              <img
                onClick={() => {
                  if (likeActionCall) {
                    likeActionCall();
                  } else {
                    LMLikeAction();
                  }
                }}
                src={like}
                alt="Like"
              />
              <span>
                {" "}
                {`${likesCount ? likesCount.toString().concat(" ") : ""}${likesCount > 1 ? LIKES : LIKE}`}
              </span>
            </div>
            <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
              <img src={commnent} alt="commnent" />
              <span>
                {`${commentsCount ? commentsCount.toString().concat(" ") : ""}${commentsCount > 1 ? COMMNENTS : COMMNENT}`}
              </span>
            </div>
          </div>
          <div className="lm-social-action-bar__actions">
            <div className="lm-d-flex lm-align-items-center lm-cursor-pointer">
              <img src={bookmark} alt="bookmark" />
            </div>
            <div className="lm-d-flex lm-align-items-center lm-cursor-pointer">
              <img src={share} alt="share" />
            </div>
          </div>
        </div>
        <LMCommentsScroller />
      </div>
    </div>
  );
};

export default Posts;
