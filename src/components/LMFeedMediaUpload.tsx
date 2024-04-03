import React from "react";
import documentUploadIcon from "../assets/images/upload-icon-document.svg";
const LMFeedMediaUpload = () => {
  function renderUpoloadIcon() {
    return <img src={documentUploadIcon} alt="attachment" />;
  }
  return (
    <label>
      <div className="lm-feed-create-post-wrapper__media-upload">
        <span className="file-upload-icon">{renderUpoloadIcon()}</span>
        <span>Add Files/Documents</span>
        <span className="file-upload-text">or drag and drop</span>
        <input
          id="file-upload"
          type="file"
          multiple
          className="file-upload-input"
          accept="image/*,application/pdf"
        />
      </div>
    </label>
  );
};

export default LMFeedMediaUpload;
