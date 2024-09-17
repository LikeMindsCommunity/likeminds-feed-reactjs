import React, { useContext } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import imgMedia from "../assets/images/img-media.svg";
import docMedia from "../assets/images/doc-media.svg";
import closeIcon from "../assets/images/close-media-upload-icon.svg";
import reelIcon from "../assets/images/vid-media.svg";
import { VideoMediaItem } from "./LMFeedCreateMediaPost";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";

const LMFeedMediaUpload = () => {
  const { allowThumbnail } = useContext(GeneralContext);

  const {
    mediaUploadMode,
    changeMediaUploadMode,
    addMediaItem,
    addThumbnailReel,
    addReel,
    tempReel,
    tempReelThumbnail,
  } = useContext(LMFeedCreatePostContext);

  function renderUpoloadIcon() {
    switch (mediaUploadMode) {
      case LMFeedCreatePostMediaUploadMode.DOCUMENT:
        return <img src={docMedia} alt="document" />;
      case LMFeedCreatePostMediaUploadMode.REEL:
        return <img src={reelIcon} alt="reel" />;
      case LMFeedCreatePostMediaUploadMode.IMAGE:
      case LMFeedCreatePostMediaUploadMode.VIDEO:
        return <img src={imgMedia} alt="image and video" />;
    }
  }

  if (mediaUploadMode === LMFeedCreatePostMediaUploadMode.REEL) {
    return (
      <div>
        {tempReel.length ? (
          <div className="tempReel">
            <VideoMediaItem file={tempReel[0]} />
          </div>
        ) : (
          <>
            <label>
              <div className="lm-feed-create-post-wrapper__media-upload">
                <img
                  src={closeIcon}
                  className="close-icon"
                  alt="close-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    changeMediaUploadMode!(
                      LMFeedCreatePostMediaUploadMode.NULL,
                    );
                  }}
                />
                <span className="file-upload-icon">{renderUpoloadIcon()}</span>
                <span className="file-upload-text">Upload Reel</span>
                <span className="file-upload-subtext">or drag and drop</span>
                <input
                  id="file-upload"
                  type="file"
                  className="file-upload-input"
                  onChange={addReel}
                  accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,video/ogg"
                  multiple={
                    mediaUploadMode !== LMFeedCreatePostMediaUploadMode.REEL // This will set multiple only when it's not in REEL mode
                  }
                />
              </div>
            </label>
          </>
        )}

        {/* Thumbnails Image */}
        {tempReelThumbnail.length && allowThumbnail ? (
          <div className="tempReel">
            <img src={URL.createObjectURL(tempReelThumbnail[0])} alt="image" />
          </div>
        ) : (
          <>
            <label>
              <div className="lm-feed-create-post-wrapper__media-upload uploadThumbnail">
                <span className="file-upload-icon">
                  <img src={imgMedia} alt="attachment" />
                </span>
                <span className="file-upload-text">Upload reel thumbnail</span>
                <span className="file-upload-subtext">or drag and drop</span>
                <input
                  id="file-upload-thumbnail"
                  type="file"
                  className="file-upload-input"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={addThumbnailReel}
                />
              </div>
            </label>
          </>
        )}
      </div>
    );
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
          className="file-upload-input"
          onChange={addMediaItem}
          accept={
            mediaUploadMode === LMFeedCreatePostMediaUploadMode.DOCUMENT
              ? "application/pdf"
              : "image/png,image/jpg,image/jpeg,video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,video/ogg"
          }
        />
      </div>
    </label>
  );
};

export default LMFeedMediaUpload;
