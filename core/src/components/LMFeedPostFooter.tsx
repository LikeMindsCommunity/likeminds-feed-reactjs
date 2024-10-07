import React, { useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

import like from "../assets/images/like.svg";
import postLiked from "../assets/images/liked-post.svg";
import commnent from "../assets/images/comment.svg";
// import bookmark from "../assets/images/bookmark.svg";
import { FeedPostContext } from "../contexts/LMFeedPostContext";

import LMCommentsScroller from "./lmReplies/LMFeedCommentsScroller";

import LMFeedReplyTextArea from "../shared/components/LMFeedReplyTextArea";
import { Divider, Drawer } from "@mui/material";
import LMFeedLikedMembers from "./LMFeedLikedMembers";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  changeCommentCase,
  changeLikeCase,
  returnPostId,
} from "../shared/utils";
import { WordAction } from "../shared/enums/wordAction";

const LMFeedPostFooter = () => {
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { post, likePost } = useContext(FeedPostContext);
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const { likesCount, commentsCount, id } = post!;
  const { LMFeedCustomIcons, CustomComponents = {} } = useContext(
    CustomAgentProviderContext,
  );

  if (!post) {
    return null;
  }
  function renderCommentBox() {
    const postId = returnPostId();
    return postId.length ? (
      <>
        <Divider className="lm-footer-reply-divider" />
        <div
          lm-feed-component-id={`lm-feed-post-footer-zabcd-${post?.id}`}
          className="lm-d-flex lm-flex-grow lm-position-relative lm-align-items-center lm-mb-5 lm-feed-reply lm-pl-4 lm-pr-4 lm-pt-4 lm-pb-4"
        >
          {CustomComponents.CustomPostReplyTextArea ? (
            <CustomComponents.CustomPostReplyTextArea />
          ) : (
            <LMFeedReplyTextArea />
          )}
        </div>
      </>
    ) : null;
  }
  return (
    <>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <div className="lmLikedMemberWrapper">
          <LMFeedLikedMembers postId={post?.id} />
        </div>
      </Drawer>
      <div
        className="lm-feed-wrapper__card__footer"
        lm-feed-component-id={`lm-feed-post-footer-vwxyz-${post?.id}`}
      >
        <div className="lm-social-action-bar">
          <div className="lm-social-action-bar__actions">
            <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
              {post?.isLiked ? (
                LMFeedCustomIcons?.postLikesLikedCustomIcon ? (
                  <LMFeedCustomIcons.postLikesLikedCustomIcon />
                ) : (
                  <img
                    onClick={() => {
                      likePost!(id);
                    }}
                    src={postLiked}
                    className="lm-cursor-pointer"
                    alt="Like"
                    lm-feed-component-id={`lm-feed-post-footer-fghij-${post?.id}`}
                  />
                )
              ) : LMFeedCustomIcons?.postLikesNormalCustomIcon ? (
                <LMFeedCustomIcons.postLikesNormalCustomIcon />
              ) : (
                <img
                  onClick={() => {
                    likePost!(id);
                  }}
                  src={like}
                  className="lm-cursor-pointer"
                  alt="Like"
                  lm-feed-component-id={`lm-feed-post-footer-fghij-${post?.id}`}
                />
              )}

              <span
                className="lm-feed-wrapper__card__footer_likes-count"
                lm-feed-component-id={`lm-feed-post-footer-klmno-${post?.id}`}
                onClick={() => {
                  lmfeedAnalyticsClient?.sendPostLikeListClickEvent(post);
                  toggleDrawer(true);
                }}
              >
                {" "}
                {`${likesCount ? likesCount.toString().concat(" ") : ""}${likesCount > 1 ? changeLikeCase(WordAction.FIRST_LETTER_CAPITAL_PLURAL) : changeLikeCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`}
              </span>
            </div>
            <div
              className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer"
              onClick={() => {
                lmfeedAnalyticsClient?.sendPostCommentClickEvent(post!);
                const location = window.location;
                const url = new URL(location.href);
                const search = url.searchParams.get("id");
                if (!search) {
                  url.searchParams.append("id", post?.id);
                  window.open(url, "_self");
                }
              }}
            >
              {LMFeedCustomIcons?.postCommentsCustomIcon ? (
                <LMFeedCustomIcons.postCommentsCustomIcon />
              ) : (
                <img
                  className="lm-cursor-pointer"
                  src={commnent}
                  alt="commnent"
                  lm-feed-component-id={`lm-feed-post-footer-pqrst-${post?.id}`}
                />
              )}
              <span
                className="comments lm-feed-wrapper__card__footer_comments-count"
                lm-feed-component-id={`lm-feed-post-footer-uvwxy-${post?.id}`}
              >
                {`${commentsCount ? commentsCount.toString().concat(" ") : ""}${commentsCount > 1 ? changeCommentCase(WordAction.FIRST_LETTER_CAPITAL_PLURAL) : changeCommentCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`}
              </span>
            </div>
          </div>
          <div className="lm-social-action-bar__actions"></div>
        </div>
        {renderCommentBox()}
        {CustomComponents?.CustomRepliesScroller || <LMCommentsScroller />}
      </div>
    </>
  );
};

export default LMFeedPostFooter;
