import React from "react";
import { useLMFeedRetryPost } from "../hooks/useRetryPost";

const LMFeedUploadBanner: React.FC = () => {
  const { isVisible, uploadFailed, handleRetry, handleCancel } = useLMFeedRetryPost();

  if (!isVisible) return null;

  return (
    <div className={`lm-feed-upload-banner ${uploadFailed ? 'lm-feed-upload-banner--error' : ''}`}>
      <div className="lm-feed-upload-banner__container">
        {!uploadFailed ? (
          <>
            <div className="lm-feed-upload-banner__loading" />
            <span className="lm-feed-upload-banner__text">Uploading...</span>
            <button
              className="lm-feed-upload-banner__cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="lm-feed-upload-banner__text">Upload failed</span>
            <button
              className="lm-feed-upload-banner__retry-btn"
              onClick={handleRetry}
            >
              Retry
            </button>
            <button
              className="lm-feed-upload-banner__cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};


export default LMFeedUploadBanner;
