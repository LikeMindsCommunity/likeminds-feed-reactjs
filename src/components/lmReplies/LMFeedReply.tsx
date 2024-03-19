import { useContext, useState } from "react";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import { formatTimeAgo } from "../../shared/utils";
import likeIcon from "../../assets/images/like-sm.svg";
import LMFeedRepliesScroller from "./LMFeedRepliesScroller";
import { useParams } from "react-router-dom";
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
    // commentLikeActionCallback,
    // commentLikeTextClickCallback,
    commentTextContentClickCallback,
    commentUsernameClickCallback,
    // repliesCountClickCallback,
    // replyActionButtonClickCallback,
    replyTextContentClickCallback,
    replyUsernameClickCallback,
  } = CustomCallbacks;
  const { id = "" } = useParams();
  const { name } = user || {};
  const [openReplies, setOpenReplies] = useState<boolean>(false);

  return (
    <div className="lm-social-action-bar__lmReply">
      <div className="lm-social-action-bar__lmReply__userMeta lm-flex-direction">
        <div className="lm-social-action-bar__lmReply__userMeta__content lm-mb-5">
          <div
            className="lm-social-action-bar__lmReply__userMeta__content--name"
            onClick={
              mode === COMMENT_TILE_MODE
                ? commentUsernameClickCallback
                : replyUsernameClickCallback
            }
          >
            {name}
          </div>

          <div
            className="lm-social-action-bar__lmReply__userMeta__content--title"
            onClick={
              mode === COMMENT_TILE_MODE
                ? commentTextContentClickCallback
                : replyTextContentClickCallback
            }
          >
            {reply?.text}
          </div>
        </div>

        <div className="lm-d-flex lm-justify-content-space-between lm-align-items-center lm-mb-5">
          <div className="like lm-d-flex">
            <img src={likeIcon} className="lm-cursor-pointer" alt="Like" />
            <span>{`${reply?.likesCount ? reply?.likesCount.toString().concat(" ") : ""}${(reply?.likesCount || 0) > 1 ? LIKES : LIKE}`}</span>
            <span>|</span>
            <span>
              Reply{" "}
              <span
                className="replies lm-cursor-pointer"
                onClick={() => setOpenReplies((current) => !current)}
              >{`${reply?.commentsCount ? reply.commentsCount.toString().concat(" ") : ""}${(reply?.commentsCount || 0) > 1 ? COMMNENTS : COMMNENT}`}</span>
            </span>
          </div>
          <div className="like">{formatTimeAgo(reply?.createdAt || 0)}</div>
        </div>
      </div>
      <div className="lm-social-action-bar__lmReply__commentsScroller">
        {openReplies && (
          <LMFeedRepliesScroller postId={id} replyId={reply?.Id || ""} />
        )}
      </div>
    </div>
  );
};

export default LMFeedReply;
