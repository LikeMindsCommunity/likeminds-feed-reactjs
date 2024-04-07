import React, { useContext } from "react";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";

const LMFeedCreatePostSubmitButton = () => {
  const { postFeed } = useContext(LMFeedCreatePostContext);
  return (
    <div
      className="lm-feed-create-post-wrapper__submit-button"
      onClick={postFeed}
    >
      <span>POST</span>
    </div>
  );
};

export default LMFeedCreatePostSubmitButton;
