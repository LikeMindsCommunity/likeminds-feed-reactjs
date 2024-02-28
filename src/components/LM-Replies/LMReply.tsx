// import React, { useContext } from "react";
// import { ReplyContext } from "../../contexts/ReplyContext";
// import { timeFromNow } from "../../shared/utils";

import like from "../../assets/images/like.svg";
// import liked from "../../assets/images/liked.svg";
import commnent from "../../assets/images/comment.svg";
import bookmark from "../../assets/images/bookmark.svg";
// import bookmarked from "../../assets/images/bookmarked.svg";
import share from "../../assets/images/share.svg";
import { COMMNENT, LIKE } from "../../shared/constants/app.constant";

const LMReply = () => {
  // const { reply, user } = useContext(ReplyContext);

  return (
    <div className="lm-social-action-bar">
      <div className="lm-social-action-bar__actions">
        <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
          <img src={like} alt="Like" />
          <span>{LIKE}</span>
        </div>
        <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
          <img src={commnent} alt="commnent" />
          <span>{COMMNENT}</span>
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

      {/* <div className="lm-social-action-bar__user-meta">{user?.name}</div>

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
      <div className="lm-social-action-bar__replies-collapse"></div> */}
    </div>
  );
};

export default LMReply;
