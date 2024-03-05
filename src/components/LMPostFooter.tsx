import React, { useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/CustomAgentProviderContext";
import { LMLikeAction } from "../shared/actions";
import like from "../assets/images/like.svg";
import commnent from "../assets/images/comment.svg";
import bookmark from "../assets/images/bookmark.svg";
import share from "../assets/images/share.svg";
import { FeedPostContext } from "../contexts/FeedPostContext";
import { ROUTES } from "../shared/constants/routes.constant";
import { Link } from "react-router-dom";
import {
  COMMNENT,
  COMMNENTS,
  LIKE,
  LIKES,
} from "../shared/constants/app.constant";
import LMCommentsScroller from "./LM-Replies/LMCommentsScroller";
const LMPostFooter = () => {
  const { post } = useContext(FeedPostContext);
  const { likesCount, commentsCount, Id } = post!;
  const { likeActionCall } = useContext(CustomAgentProviderContext);

  return (
    <>
      <div className="lm-feed-wrapper__card__footer">
        <div className="lm-social-action-bar">
          <div className="lm-social-action-bar__actions">
            <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
              <img
                onClick={() => {
                  if (likeActionCall) {
                    likeActionCall();
                  } else {
                    LMLikeAction();
                  }
                }}
                src={like}
                className="lm-cursor-pointer"
                alt="Like"
              />
              <span>
                {" "}
                {`${likesCount ? likesCount.toString().concat(" ") : ""}${likesCount > 1 ? LIKES : LIKE}`}
              </span>
            </div>
            <div className="lm-d-flex lm-align-items-center lm-flex-gap lm-cursor-pointer">
              <Link to={ROUTES.POST.concat("/").concat(Id.toString())}>
                <img
                  className="lm-cursor-pointer"
                  src={commnent}
                  alt="commnent"
                />
              </Link>
              <span>
                {`${commentsCount ? commentsCount.toString().concat(" ") : ""}${commentsCount > 1 ? COMMNENTS : COMMNENT}`}
              </span>
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
        </div>
        <LMCommentsScroller />
      </div>
    </>
  );
};

export default LMPostFooter;
