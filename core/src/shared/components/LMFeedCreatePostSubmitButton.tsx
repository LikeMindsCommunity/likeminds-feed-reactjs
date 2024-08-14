import React, { useContext } from "react";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";

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
      <span>{temporaryPost ? "SAVE" : "POST"}</span>
    </div>
  );
};

export default LMFeedCreatePostSubmitButton;
