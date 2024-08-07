import React, { useContext } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import imgMedia from "../assets/images/img-media.svg";
// import vidMedia from "../assets/images/vid-media.svg";
import docMedia from "../assets/images/doc-media.svg";
import closeIcon from "../assets/images/close-media-upload-icon.svg";
import reelIcon from "../assets/images/close-media-upload-icon.svg";
const LMFeedMediaUpload = () => {
  const { mediaUploadMode, changeMediaUploadMode, addMediaItem } = useContext(
    LMFeedCreatePostContext,
  );

  function renderUpoloadIcon() {
    switch (mediaUploadMode) {
      case LMFeedCreatePostMediaUploadMode.DOCUMENT:
        return <img src={docMedia} alt="attachment" />;
      case LMFeedCreatePostMediaUploadMode.IMAGE:
      case LMFeedCreatePostMediaUploadMode.VIDEO:
        return <img src={imgMedia} alt="attachment" />;
    }
  }
  return (
    <label>
      <div className="lm-feed-create-post-wrapper__media-upload">
        <img
          src={closeIcon}
          className="close-icon"
          alt="close-icon"
          onClick={(e) => {
            e.preventDefault();
            changeMediaUploadMode!(LMFeedCreatePostMediaUploadMode.NULL);
          }}
        />
        <span className="file-upload-icon">{renderUpoloadIcon()}</span>
        <span className="file-upload-text">
          {mediaUploadMode === LMFeedCreatePostMediaUploadMode.DOCUMENT
            ? "Add Files/Documents"
            : "Add Photos/Videos"}
        </span>
        <span className="file-upload-subtext">or drag and drop</span>
        <input
          id="file-upload"
          type="file"
          multiple
          className="file-upload-input"
          onChange={addMediaItem}
          accept={
            mediaUploadMode === LMFeedCreatePostMediaUploadMode.DOCUMENT
              ? "application/pdf"
              : "image/png,image/jpg,image/jpeg,video/mp4"
          }
        />
      </div>
    </label>
  );
};

export default LMFeedMediaUpload;
