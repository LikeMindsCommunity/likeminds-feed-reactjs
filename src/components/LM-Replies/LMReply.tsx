import React, { useContext } from "react";
import { ReplyContext } from "../../contexts/ReplyContext";
import { timeFromNow } from "../../shared/utils";

const LMReply = () => {
  const { reply, user } = useContext(ReplyContext);

  return (
    <>
      <div className="lm-social-action-bar__user-meta">{user?.name}</div>
      <div className="lm-social-action-bar__answer">{reply?.text}</div>
      <div className="lm-social-action-bar__footer">
        <div className="lm-social-action-bar__footer__post-actions">
          <div className="lm-social-action-bar__footer__post-actions__likes"></div>
          {"|"}
          <div className="lm-social-action-bar__footer__post-actions__comments">
            Reply
            {"."}
            <div className="lm-social-action-bar__footer__post-actions__comments__action">
              {reply?.commentsCount} Replies
            </div>
          </div>
        </div>
        <div className="lm-social-action-bar__footer__duration">
          {timeFromNow(reply?.createdAt.toString() || "")}
        </div>
      </div>
      <div className="lm-social-action-bar__replies-collapse"></div>{" "}
    </>
  );
};

export default LMReply;
