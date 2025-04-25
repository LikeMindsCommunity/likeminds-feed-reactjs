import React, { useContext, useEffect, useState } from "react";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { DeleteTemporaryPostRequest } from "@likeminds.community/feed-js";
import { HelperFunctionsClass } from "../shared/helper";
// import deleteTemporaryPost from "@likeminds.community/feed-js";
const LMFeedUploadBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempPostId, setTempPostId] = useState<string | null>(null);
  const { customEventClient, lmFeedclient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  // const { temporaryPost } = useContext(LMFeedCreatePostContext);

  useEffect(() => {
    console.log("LMFeedUploadBanner mounted");
    const handlePostCreationStarted = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Post creation started", customEvent.detail);
      setTempPostId(customEvent.detail.tempId);
      setIsVisible(true);
    };

    const handlePostCreated = () => {
      console.log("Post created");
      setIsVisible(false);
      setTempPostId(null);
    };

    const handlePostCreationFailed = () => {
      console.log("Post creation failed");
      setIsVisible(false);
      setTempPostId(null);
    };

    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_CREATION_STARTED,
      handlePostCreationStarted,
    );

    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_CREATED,
      handlePostCreated,
    );

    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_CREATION_FAILED,
      handlePostCreationFailed,
    );

    return () => {
      console.log("LMFeedUploadBanner unmounting");
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATION_STARTED);
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATED);
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATION_FAILED);
    };
  }, [customEventClient]);

  const handleCancel = async () => {
    console.log("entry mil  gayi ji");
    console.log("tempPostId:", tempPostId);
    if (tempPostId && lmFeedclient) {
      try {
        console.log("Cancelling upload for post:", tempPostId);
        // Cancel the AWS upload first
        HelperFunctionsClass.cancelUpload();
        console.log("aws upload cancel");

        // Then delete the temporary post
        const request = DeleteTemporaryPostRequest.builder()
          .setTemporaryPostId(tempPostId)
          .build();

        // Delete from local storage
        await lmFeedclient?.deleteTemporaryPost(request);
        console.log("hello", request.temporaryPostId);
        console.log("deleted temporary post from local storage");

        // Clear the temporary post from state
        setTempPostId(null);
        setIsVisible(false);

        // Dispatch the failed event to hide the banner
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
        );
        console.log("event cancelled");
      } catch (error) {
        console.error("Error during cancellation:", error);
        // Even if there's an error, try to hide the banner and clear state
        setTempPostId(null);
        setIsVisible(false);
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
        );
      }
    } else {
      console.log("No temporary post ID or client available");
    }
  };

  console.log(
    "LMFeedUploadBanner rendering, isVisible:",
    isVisible,
    "tempPostId:",
    tempPostId,
  );

  if (!isVisible) return null;

  return (
    <div
      className="lm-feed-upload-banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="lm-feed-upload-banner__content"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "white",
        }}
      >
        <div className="lm-feed-upload-banner__spinner"></div>
        <span className="lm-feed-upload-banner__text">Uploading post...</span>
        <button
          className="lm-feed-upload-banner__cancel-btn"
          onClick={handleCancel}
          style={{
            cursor: "pointer",
            padding: "5px 10px",
            backgroundColor: "white",
            border: "none",
            borderRadius: "4px",
            color: "black",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LMFeedUploadBanner;
