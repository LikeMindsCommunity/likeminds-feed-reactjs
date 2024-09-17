import React, { useContext } from "react";
import imgMedia from "../../assets/images/img-media.svg";
import vidMedia from "../../assets/images/vid-media.svg";
import docMedia from "../../assets/images/doc-media.svg";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";
import { LMFeedCreatePostMediaUploadMode } from "../enums/lmCreatePostMediaHandlingMode";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
const LMFeedCreatePostAttachmentController = () => {
  const { changeMediaUploadMode } = useContext(LMFeedCreatePostContext);
  const { LMFeedCustomIcons } = useContext(CustomAgentProviderContext);
  return (
    <div
      className="lm-feed-create-post-wrapper__attachments-controller"
      lm-feed-component-id={`lm-feed-create-post-attachments-controller-zabcd`}
    >
      <span
        lm-feed-component-id={`lm-feed-create-post-attachments-controller-efghi`}
      >
        Add to your post
      </span>
      <span
        className="lm-create-dialog-image-icon-container"
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.IMAGE);
        }}
      >
        {LMFeedCustomIcons?.createPostDialogBoxImageIcon ? (
          <LMFeedCustomIcons.createPostDialogBoxImageIcon />
        ) : (
          <img
            src={imgMedia}
            alt="img-media"
            className="img-media lm-cursor-pointer"
            lm-feed-component-id={`lm-feed-create-post-attachments-controller-jklmn`}
            title="Image"
          />
        )}
      </span>
      <span
        className="lm-create-dialog-video-icon-container"
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.VIDEO);
        }}
      >
        {LMFeedCustomIcons?.createPostDialogBoxVideoIcon ? (
          <LMFeedCustomIcons.createPostDialogBoxVideoIcon />
        ) : (
          <img
            src={vidMedia}
            alt="vid-media"
            className="vid-media lm-cursor-pointer"
            lm-feed-component-id={`lm-feed-create-post-attachments-controller-opqrs`}
            title="Video"
          />
        )}
      </span>
      <span
        className="lm-create-dialog-video-icon-container"
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.REEL);
        }}
      >
        {LMFeedCustomIcons?.createPostDialogBoxVideoIcon ? (
          <LMFeedCustomIcons.createPostDialogBoxVideoIcon />
        ) : (
          <img
            src={vidMedia}
            alt="vid-media"
            className="vid-media lm-cursor-pointer"
            lm-feed-component-id={`lm-feed-create-post-attachments-controller-opqrs`}
            title="Reel"
          />
        )}
      </span>
      <span
        className="lm-create-dialog-document-icon-container"
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.DOCUMENT);
        }}
      >
        {LMFeedCustomIcons?.createPostDialogBoxDocumentIcon ? (
          <LMFeedCustomIcons.createPostDialogBoxDocumentIcon />
        ) : (
          <img
            src={docMedia}
            alt="doc-media"
            className="doc-media lm-cursor-pointer"
            lm-feed-component-id={`lm-feed-create-post-attachments-controller-tuvwx`}
            title="Document"
          />
        )}
      </span>
    </div>
  );
};

export default LMFeedCreatePostAttachmentController;
