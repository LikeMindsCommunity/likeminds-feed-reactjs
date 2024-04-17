import React, { useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

import like from "../assets/images/like.svg";
import postLiked from "../assets/images/liked-post.svg";
import commnent from "../assets/images/comment.svg";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import {
  COMMNENT,
  COMMNENTS,
  GUEST_USER_ACTION_MESSAGE,
  LIKE,
  LIKES,
} from "../shared/constants/lmAppConstant";
import LMCommentsScroller from "./lmReplies/LMFeedCommentsScroller";
import { useNavigate } from "react-router-dom";
import LMFeedReplyTextArea from "../shared/components/LMFeedReplyTextArea";
import { Divider } from "@mui/material";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";

const LMFeedPostFooter = () => {
  const { post } = useContext(FeedPostContext);
  const { likesCount, commentsCount, Id } = post!;
  const {
    LMPostFooterStyles,
    CustomComponents = null,
    CustomCallbacks = {},
  } = useContext(CustomAgentProviderContext);
  const {
    likeTextCountClickCallback,
    commentIconClickCallback,
    commentTextCountClickCallback,
    postFooterClickCallback,
  } = CustomCallbacks;
  const { likePost } = useContext(LMFeedDataContext);
  const navigation = useNavigate();
  function renderCommentBox() {
    return window.location.pathname.includes("post") ? (
      <>
        <Divider className="lm-footer-reply-divider" />
        <div className="lm-d-flex lm-flex-grow lm-position-relative lm-align-items-center lm-mb-5 lm-feed-reply lm-pl-4 lm-pr-4 lm-pt-4 lm-pb-4">
          <LMFeedReplyTextArea />
        </div>
      </>
    ) : null;
  }
  return (
    <>
      <div
        className="lm-feed-wrapper__card__footer"
        onClick={() =>
          postFooterClickCallback ? postFooterClickCallback(navigation) : null
        }
      >
        <div className="lm-social-action-bar">
          <div className="lm-social-action-bar__actions">
            <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
              {post?.isLiked ? (
                <img
                  onClick={() => {
                    console.log(Id);
                    likePost!(Id);
                  }}
                  src={postLiked}
                  className="lm-cursor-pointer"
                  alt="Like"
                />
              ) : (
                <img
                  onClick={() => {
                    console.log(Id);
                    likePost!(Id);
                  }}
                  src={like}
                  className="lm-cursor-pointer"
                  alt="Like"
                />
              )}

              <span
                style={LMPostFooterStyles?.likesCountStyles}
                onClick={() =>
                  likeTextCountClickCallback
                    ? likeTextCountClickCallback(navigation)
                    : null
                }
              >
                {" "}
                {`${likesCount ? likesCount.toString().concat(" ") : ""}${likesCount > 1 ? LIKES : LIKE}`}
              </span>
            </div>
            <div
              className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer"
              onClick={() => {
                navigation(
                  `/community/post/${`${Id}-${post?.heading}`.substring(0, 59)}`,
                );
              }}
            >
              {LMPostFooterStyles?.commentButtonCustom ? (
                <LMPostFooterStyles.commentButtonCustom />
              ) : (
                <img
                  onClick={() => {
                    if (commentIconClickCallback) {
                      commentIconClickCallback(navigation);
                    } else {
                      alert(GUEST_USER_ACTION_MESSAGE);
                    }
                  }}
                  className="lm-cursor-pointer"
                  src={commnent}
                  alt="commnent"
                />
              )}
              <span
                style={LMPostFooterStyles?.commentsCountStyles}
                className="comments"
                onClick={() =>
                  commentTextCountClickCallback
                    ? commentTextCountClickCallback(navigation)
                    : null
                }
              >
                {`${commentsCount ? commentsCount.toString().concat(" ") : ""}${commentsCount > 1 ? COMMNENTS : COMMNENT}`}
              </span>
            </div>
          </div>
          <div className="lm-social-action-bar__actions">
            {/* <div className="lm-d-flex lm-align-items-center lm-cursor-pointer">
              <img src={bookmark} alt="bookmark" />
            </div>
            <div className="lm-d-flex lm-align-items-center lm-cursor-pointer">
              <img src={share} alt="share" />
            </div> */}
          </div>
        </div>
        {renderCommentBox()}
        {CustomComponents?.RepliesScroller || <LMCommentsScroller />}
      </div>
    </>
  );
};

export default LMFeedPostFooter;
