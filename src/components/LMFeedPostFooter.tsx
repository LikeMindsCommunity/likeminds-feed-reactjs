import React, { useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

import like from "../assets/images/like.svg";
import postLiked from "../assets/images/liked-post.svg";
import commnent from "../assets/images/comment.svg";
// import bookmark from "../assets/images/bookmark.svg";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import {
  COMMNENT,
  COMMNENTS,
  // GUEST_USER_ACTION_MESSAGE,
  LIKE,
  LIKES,
} from "../shared/constants/lmAppConstant";
import LMCommentsScroller from "./lmReplies/LMFeedCommentsScroller";
import { useNavigate } from "react-router-dom";
import LMFeedReplyTextArea from "../shared/components/LMFeedReplyTextArea";
import { Divider, Drawer } from "@mui/material";
import LMFeedLikedMembers from "./LMFeedLikedMembers";

const LMFeedPostFooter = () => {
  const { post, likePost } = useContext(FeedPostContext);
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const { likesCount, commentsCount, Id } = post!;
  const {
    LMPostFooterStyles,
    CustomComponents = null,
    CustomCallbacks = {},
  } = useContext(CustomAgentProviderContext);
  const {
    likeTextCountClickCallback,
    // commentIconClickCallback,
    commentTextCountClickCallback,
    postFooterClickCallback,
  } = CustomCallbacks;

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
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <div className="lmLikedMemberWrapper">
          <LMFeedLikedMembers postId={post?.Id} />
        </div>
      </Drawer>
      <div
        className="lm-feed-wrapper__card__footer"
        onClick={() =>
          postFooterClickCallback ? postFooterClickCallback(navigation) : null
        }
      >
        <div className="lm-social-action-bar">
          <div className="lm-social-action-bar__actions">
            <div
              className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer"
              onClick={toggleDrawer(true)}
            >
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
                sessionStorage.setItem("scroll-pos", Id);
                navigation(
                  `/community/post/${`${Id}-${post?.heading}`.substring(0, 59)}`,
                );
              }}
            >
              {LMPostFooterStyles?.commentButtonCustom ? (
                <LMPostFooterStyles.commentButtonCustom />
              ) : (
                <img
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
            </div> */}
            {/* <div className="lm-d-flex lm-align-items-center lm-cursor-pointer">
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
