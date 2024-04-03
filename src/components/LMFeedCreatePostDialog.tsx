import React, { useContext } from "react";

import { getAvatar } from "../shared/components/LMUserMedia";
import LMFeedTextArea from "../shared/components/LMFeedTextArea";
import LMFeedMediaUpload from "./LMFeedMediaUpload";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

const LMFeedCreatePostDialog = () => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  return (
    <div className="lm-feed-create-post-wrapper">
      <div className="lm-feed-create-post-wrapper__dialog-heading">
        Create Post
      </div>
      <div className="lm-feed-create-post-wrapper__user-meta">
        {getAvatar({
          imageUrl: currentUser?.imageUrl,
          name: currentUser?.name,
        })}
        <span>{currentUser?.name}</span>
      </div>
      <LMFeedTextArea />
      <LMFeedMediaUpload />
    </div>
  );
};

export default LMFeedCreatePostDialog;
