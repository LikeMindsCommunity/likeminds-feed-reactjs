import { useContext, useState } from "react";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import { formatTimeAgo } from "../../shared/utils";
import likeIcon from "../../assets/images/like-sm.svg";
import LMFeedRepliesScroller from "./LMFeedRepliesScroller";
import { useNavigate, useParams } from "react-router-dom";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
import {
  COMMENT_TILE_MODE,
  COMMNENT,
  COMMNENTS,
  LIKE,
  LIKES,
} from "../../shared/constants/lmAppConstant";
interface LMFeedReplyInterface {
  mode: string;
}
const LMFeedReply = ({ mode }: LMFeedReplyInterface) => {
  const { reply, user } = useContext(ReplyContext);
  const { CustomCallbacks = {} } = useContext(CustomAgentProviderContext);
  const {
    commentLikeActionCallback,
    commentTextContentClickCallback,
    commentUsernameClickCallback,
    replyLikeActionCallback,
    repliesCountClickCallback,
    replyTextContentClickCallback,
    replyUsernameClickCallback,
    replyActionButtonClickCallback,
  } = CustomCallbacks;
  const { id = "" } = useParams();
  const { name } = user || {};
  const [openReplies, setOpenReplies] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div className="lm-social-action-bar__lmReply">
      <div className="lm-social-action-bar__lmReply__userMeta lm-flex-direction">
        <div className="lm-social-action-bar__lmReply__userMeta__content lm-mb-5">
          <div
            className="lm-social-action-bar__lmReply__userMeta__content--name"
            onClick={() => {
              switch (mode) {
                case COMMENT_TILE_MODE: {
                  if (commentUsernameClickCallback) {
                    commentUsernameClickCallback(navigate);
                  }
                  break;
                }
                default: {
                  if (replyUsernameClickCallback) {
                    replyUsernameClickCallback(navigate);
                  }
                }
              }
            }}
          >
            {name}
          </div>

          <div
            className="lm-social-action-bar__lmReply__userMeta__content--title"
            onClick={() => {
              switch (mode) {
                case COMMENT_TILE_MODE: {
                  if (commentTextContentClickCallback) {
                    commentTextContentClickCallback(navigate);
                  }
                  break;
                }
                default: {
                  if (replyTextContentClickCallback) {
                    replyTextContentClickCallback(navigate);
                  }
                }
              }
            }}
          >
            {reply?.text}
          </div>
        </div>

        <div className="lm-d-flex lm-justify-content-space-between lm-align-items-center lm-mb-5">
          <div className="like lm-d-flex">
            <img
              src={likeIcon}
              className="lm-cursor-pointer"
              alt="Like"
              onClick={() => {
                switch (mode) {
                  case COMMENT_TILE_MODE: {
                    if (commentLikeActionCallback) {
                      commentLikeActionCallback(navigate);
                    }
                    break;
                  }
                  default: {
                    if (replyLikeActionCallback) {
                      replyLikeActionCallback(navigate);
                    }
                  }
                }
              }}
            />
            <span>{`${reply?.likesCount ? reply?.likesCount.toString().concat(" ") : ""}${(reply?.likesCount || 0) > 1 ? LIKES : LIKE}`}</span>
            <span>|</span>
            <span>
              <span
                className="reply-badge"
                onClick={() => {
                  if (replyActionButtonClickCallback) {
                    replyActionButtonClickCallback(navigate);
                  }
                }}
              >
                Reply{" "}
              </span>
              <span
                className="replies lm-cursor-pointer"
                onClick={() => {
                  if (repliesCountClickCallback) {
                    repliesCountClickCallback(navigate);
                  }
                  setOpenReplies((current) => !current);
                }}
              >{`${reply?.commentsCount ? reply.commentsCount.toString().concat(" ") : ""}${(reply?.commentsCount || 0) > 1 ? COMMNENTS : COMMNENT}`}</span>
            </span>
          </div>
          <div className="like">{formatTimeAgo(reply?.createdAt || 0)}</div>
        </div>
      </div>
      <div className="lm-social-action-bar__lmReply__commentsScroller">
        {openReplies && (
          <LMFeedRepliesScroller
            postId={id.split("-")[0]}
            replyId={reply?.Id || ""}
          />
        )}
      </div>
    </div>
  );
};

export default LMFeedReply;
