import React from "react";
import { useLMFeedRetryPost } from "../hooks/useRetryPost";
import { CircularProgress, Snackbar } from "@mui/material";
import RetryIcon from "../assets/images/retry-mechanism.svg";
import CancelIcon from "../assets/images/X.svg";

const LMFeedUploadBanner: React.FC = () => {
  const { isVisible, uploadFailed, handleRetry, handleCancel } =
    useLMFeedRetryPost();

  if (!isVisible) return null;

  const postingMessage = (
    <div className="lm-feed-upload-banner__uploading">
      <CircularProgress size={30} />
      <div className="lm-feed-upload-banner-text">Uploading...</div>
    </div>
  );

  const postingAction = (
    <React.Fragment>
      <button
        className="lm-feed-upload-banner__cancel-btn"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </React.Fragment>
  );

  const failedMessage = (
    <div className="lm-feed-upload-banner-text">Upload Failed.</div>
  );

  const failedAction = (
    <React.Fragment>
      <button
        className="lm-feed-upload-banner__retry-btn"
        onClick={handleRetry}
      >
        <img src={RetryIcon} alt="" className="retry-banner-img" />
        Retry
      </button>
      <button
        className="lm-feed-upload-banner__retry-cancel-btn"
        onClick={handleCancel}
      >
        <img src={CancelIcon} alt="cancel" className="retry-cancel-img" />
      </button>
    </React.Fragment>
  );

  return (
    <>
      <div className="lm-feed-upload-banner__container">
        {!uploadFailed ? (
          <div className="mobile-upload-banner">
            <div className="lm-feed-upload-banner__uploading">
              <CircularProgress size={30} />
              <div className="lm-feed-upload-banner-text">Uploading...</div>
            </div>
            <button
              className="lm-feed-upload-banner__cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mobile-upload-banner">
            <div className="lm-feed-upload-banner-text">Upload Failed.</div>
            <div className="lm-feed-mobile-upload-banner">
              <button
                className="lm-feed-upload-banner__retry-btn"
                onClick={handleRetry}
              >
                <img src={RetryIcon} alt="retry" className="retry-banner-img" />
                Retry
              </button>
              <button
                className="lm-feed-upload-banner__retry-cancel-btn"
                onClick={handleCancel}
              >
                <img
                  src={CancelIcon}
                  alt="cancel"
                  className="retry-cancel-img"
                />
              </button>
            </div>
          </div>
        )}
        {!uploadFailed ? (
          <Snackbar
            className="lm-feed-upload-banner-snackbar"
            open={isVisible}
            message={postingMessage}
            action={postingAction}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            ContentProps={{
              sx: {
                backgroundColor: "#ffffff",
                color: "#000",
                width: "420px",
                "& .MuiSnackbarContent-message": {
                  margin: "8px 0 8px 8px",
                },
                "& .MuiSnackbarContent-action": {
                  marginRight: "8px",
                },
              },
            }}
          />
        ) : (
          <Snackbar
            className="lm-feed-upload-banner-snackbar"
            open={isVisible}
            message={failedMessage}
            action={failedAction}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            ContentProps={{
              sx: {
                backgroundColor: "#ffffff",
                color: "#000",
                width: "420px",
                "& .MuiSnackbarContent-message": {
                  margin: "12px 0 12px 12px",
                },
                "& .MuiSnackbarContent-action": {
                  marginRight: "12px",
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
};

export default LMFeedUploadBanner;
