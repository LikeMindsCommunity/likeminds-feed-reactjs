import React from "react";
import imgMedia from "../../assets/images/img-media.svg";
import vidMedia from "../../assets/images/vid-media.svg";
import docMedia from "../../assets/images/doc-media.svg";
const LMFeedCreatePostAttachmentController = () => {
  return (
    <div className="lm-feed-create-post-wrapper__attachments-controller">
      <span>Add to your post</span>
      <img src={imgMedia} alt="img-media" className="img-media" />
      <img src={vidMedia} alt="vid-media" className="vid-media" />
      <img src={docMedia} alt="doc-media" className="doc-media" />
    </div>
  );
};

export default LMFeedCreatePostAttachmentController;
