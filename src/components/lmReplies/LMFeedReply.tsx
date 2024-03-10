import { useContext } from "react";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import { timeFromNow } from "../../shared/utils";
import likeIcon from "../../assets/images/like-sm.svg";
// import commnentIcon from "../../assets/images/comment.svg";

const LMFeedReply = () => {
  const { reply, user } = useContext(ReplyContext);

  const { name } = user || {};

  return (
    <div className="lm-social-action-bar__lmReply">
      <div className="lm-social-action-bar__lmReply__userMeta lm-flex-direction">
        <div className="lm-social-action-bar__lmReply__userMeta__content lm-mb-5">
          <div className="lm-social-action-bar__lmReply__userMeta__content--name">
            {name}
          </div>

          <div className="lm-social-action-bar__lmReply__userMeta__content--title">
            {reply?.text}
          </div>
        </div>

        <div className="lm-d-flex lm-justify-content-space-between lm-align-items-center lm-mb-5">
          <div className="like lm-d-flex">
            <img src={likeIcon} className="lm-cursor-pointer" alt="Like" />
            <span>2 likes </span>
            <span>|</span>
            <span>
              Reply <span className="replies lm-cursor-pointer">3 Replies</span>
            </span>
          </div>
          <div className="like">
            {timeFromNow(reply?.createdAt.toString() || "")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMFeedReply;
