import React, { useContext } from "react";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";
import { changePostCase } from "../utils";
import { WordAction } from "../enums/wordAction";

const LMFeedCreatePostSubmitButton = () => {
  const { postFeed, temporaryPost, editPost } = useContext(
    LMFeedCreatePostContext,
  );

  return (
    <div
      className="lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4"
      onClick={() => {
        if (temporaryPost) {
          editPost!();
        } else {
          postFeed!();
        }
      }}
    >
      <span>
        {temporaryPost
          ? "SAVE"
          : changePostCase(WordAction.ALL_CAPITAL_SINGULAR)}
      </span>
    </div>
  );
};

export default LMFeedCreatePostSubmitButton;
