import React, { useContext } from "react";
import { ReplyContext } from "../../contexts/ReplyContext";
import { timeFromNow } from "../../shared/utils";
import { renderIconReplyLike } from "../../shared/icons/Icons";

const LMReply = () => {
  const { reply, user } = useContext(ReplyContext);
  return (
    <div className="lm-replies-wrapper">
      <div className="lm-replies-wrapper__user-meta">{user?.name}</div>
      {/* TODO Add logic for read more */}
      <div className="lm-replies-wrapper__answer">{reply?.text}</div>
      <div className="lm-replies-wrapper__footer">
        <div className="lm-replies-wrapper__footer__post-actions">
          <div className="lm-replies-wrapper__footer__post-actions__likes">
            <span className="lm-replies-wrapper__footer__post-actions__likes__action-button">
              {renderIconReplyLike(reply?.isLiked || false)}
            </span>
          </div>
          {"|"}
          <div className="lm-replies-wrapper__footer__post-actions__comments">
            Reply
            {"."}
            <div className="lm-replies-wrapper__footer__post-actions__comments__action">
              {/* TODO logic for appending Replies, Reply and likes */}
              {reply?.commentsCount} Replies
            </div>
          </div>
        </div>
        <div className="lm-replies-wrapper__footer__duration">
          {timeFromNow(reply?.createdAt.toString() || "")}
        </div>
      </div>
      <div className="lm-replies-wrapper__replies-collapse"></div>
    </div>
  );
};

export default LMReply;
