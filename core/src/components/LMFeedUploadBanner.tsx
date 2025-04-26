import React, { useContext, useEffect, useState } from "react";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { DeleteTemporaryPostRequest, AddPostRequest, AttachmentType } from "@likeminds.community/feed-js";
import { HelperFunctionsClass } from "../shared/helper";
// import deleteTemporaryPost from "@likeminds.community/feed-js";
const LMFeedUploadBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempPostId, setTempPostId] = useState<string | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);
  const { customEventClient, lmFeedclient } = useContext(
    LMFeedGlobalClientProviderContext
  );
  const { currentUser } = useContext(LMFeedUserProviderContext);
  // const { temporaryPost } = useContext(LMFeedCreatePostContext);

  useEffect(() => {
    // Check for any existing temporary posts when component mounts
    const checkTemporaryPost = async () => {
      try {
        const response = await lmFeedclient?.getTemporaryPost();
        if (response?.data?.tempPost) {
          const tempId = response.data.tempPost.post.id;
          setTempPostId(tempId);
          setIsVisible(true);
          setUploadFailed(true);
          // Dispatch event to disable create post button
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_CREATION_STARTED,
            { tempId }
          );
        }
      } catch (error) {
        console.error('Error checking temporary post:', error);
      }
    };

    checkTemporaryPost();

    // Handle new post creation events
    const handlePostCreationStarted = (event: Event) => {
      const customEvent = event as CustomEvent;
      setTempPostId(customEvent.detail.tempId);
      setIsVisible(true);
    };

    const handlePostCreated = () => {
      setIsVisible(false);
      setTempPostId(null);
    };

    const handlePostCreationFailed = () => {
      setUploadFailed(true);
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
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATION_STARTED);
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATED);
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATION_FAILED);
    };
  }, [customEventClient]);

  const handleRetry = async () => {
    if (tempPostId && lmFeedclient) {
      try {
        // Get the temporary post
        const post = await lmFeedclient.getTemporaryPost();
        const tempPost = post?.data?.tempPost?.post;
        
        if (tempPost) {
          setUploadFailed(false);
          
          // Show banner when we start AWS upload retry
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_CREATION_STARTED,
            { tempId: tempPost.id }
          );

          try {
            // Upload media to AWS S3
            const mediaList = tempPost.attachments || [];
            if (!currentUser?.sdkClientInfo?.uuid) {
              throw new Error("User ID not found");
            }
            for (const attachment of mediaList) {
              if (attachment.type === AttachmentType.IMAGE || 
                  attachment.type === AttachmentType.VIDEO || 
                  attachment.type === AttachmentType.DOCUMENT) {
                if (!attachment.metaData?.url) {
                  console.warn('No URL found for attachment:', attachment);
                  continue;
                }
                try {
                  const response = await fetch(attachment.metaData.url);
                  const blob = await response.blob();
                  const file = new File(
                    [blob],
                    attachment.metaData.name || 'file',
                    { type: response.headers.get('content-type') || 'application/octet-stream' }
                  );
                  await HelperFunctionsClass.uploadMedia(
                    file,
                    currentUser.sdkClientInfo.uuid
                  );
                } catch (error) {
                  console.error('Failed to fetch file from URL:', error);
                  continue;
                }
              } else {
                console.warn('Unsupported attachment type:', attachment.type);
                continue;
              }
            }
            
            // After successful AWS upload, call addPost
            const addPostRequest = AddPostRequest.builder()
              .setAttachments(tempPost.attachments || [])
              .setText(tempPost.text || "")
              .setTopicIds(tempPost.topics || [])
              .setTempId(Date.now().toString())
              .setIsAnonymous(tempPost.isAnonymous || false);

            if (tempPost.heading) {
              addPostRequest.setHeading(tempPost.heading);
            }

            const addPostResponse = await lmFeedclient.addPost(addPostRequest.build());
            
            if (addPostResponse?.success) {
              // Delete temporary post after successful creation
              const deleteRequest = DeleteTemporaryPostRequest.builder()
                .setTemporaryPostId(tempPostId)
                .build();

              await lmFeedclient.deleteTemporaryPost(deleteRequest);

              // Dispatch success event
              customEventClient?.dispatchEvent(
                LMFeedCustomActionEvents.POST_CREATED,
                {}
              );
            }
          } catch (error) {
            console.error("Error in upload/post creation:", error);
            customEventClient?.dispatchEvent(
              LMFeedCustomActionEvents.POST_CREATION_FAILED,
              {}
            );
          }
        }
      } catch (error) {
        console.error("Error getting temporary post:", error);
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
          {}
        );
      }
    }
  };

  const handleCancel = async () => {
    if (tempPostId && lmFeedclient) {
      try {
        // Cancel the AWS upload first
        HelperFunctionsClass.cancelUpload();

        // Then delete the temporary post
        const request = DeleteTemporaryPostRequest.builder()
          .setTemporaryPostId(tempPostId)
          .build();

        // Delete from local storage
        await lmFeedclient?.deleteTemporaryPost(request);

        // Clear the temporary post from state
        setTempPostId(null);
        setIsVisible(false);

        // Dispatch the failed event to hide the banner
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
        );
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
