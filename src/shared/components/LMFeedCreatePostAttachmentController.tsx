import React, { useContext } from "react";
import imgMedia from "../../assets/images/img-media.svg";
import vidMedia from "../../assets/images/vid-media.svg";
import docMedia from "../../assets/images/doc-media.svg";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";
import { LMFeedCreatePostMediaUploadMode } from "../enums/lmCreatePostMediaHandlingMode";
const LMFeedCreatePostAttachmentController = () => {
  const { changeMediaUploadMode } = useContext(LMFeedCreatePostContext);
  return (
    <div className="lm-feed-create-post-wrapper__attachments-controller">
      <span>Add to your post</span>
      <img
        src={imgMedia}
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.IMAGE);
        }}
        alt="img-media"
        className="img-media lm-cursor-pointer"
      />
      <img
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.VIDEO);
        }}
        src={vidMedia}
        alt="vid-media"
        className="vid-media lm-cursor-pointer"
      />
      <img
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.DOCUMENT);
        }}
        src={docMedia}
        alt="doc-media"
        className="doc-media lm-cursor-pointer"
      />
    </div>
  );
};

export default LMFeedCreatePostAttachmentController;
