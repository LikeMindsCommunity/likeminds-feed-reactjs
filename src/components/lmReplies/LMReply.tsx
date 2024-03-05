import React, { useContext } from "react";
import { ReplyContext } from "../../contexts/ReplyContext";
import { getAvatar, timeFromNow } from "../../shared/utils";
import likeIcon from "../../assets/images/like-sm.svg";
// import commnentIcon from "../../assets/images/comment.svg";

const LMReply = () => {
  const { reply, user } = useContext(ReplyContext);

  const { name, imageUrl } = user || {};

  console.log(user);
  // Determine the avatar content based on imageUrl and name
  const avatarContent = getAvatar({ imageUrl, name });

  return (
    <div className="lm-social-action-bar__lmReply">
      <div className="lm-social-action-bar__lmReply__userMeta">
        <div className="lm-d-flex">
          <div className="lm-social-action-bar__lmReply__userMeta__image">
            <div className="lm-avatar lm-mr-5">{avatarContent}</div>
          </div>
          <div>
            <div className="lm-social-action-bar__lmReply__userMeta__content lm-mb-5">
              <div className="lm-social-action-bar__lmReply__userMeta__content--title">
                {name}
              </div>

              <div className="lm-social-action-bar__answer">{reply?.text}</div>
            </div>

            <div className="lm-d-flex lm-justify-content-space-between lm-align-items-center lm-mb-5">
              <div className="like lm-d-flex">
                <img src={likeIcon} className="lm-cursor-pointer" alt="Like" />
                <span>Likes</span>
                <span>|</span>
                <span>Reply</span>
              </div>
              <div className="like">
                {timeFromNow(reply?.createdAt.toString() || "")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMReply;
