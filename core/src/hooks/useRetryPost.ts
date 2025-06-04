import { useContext, useEffect, useState } from "react";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import {
  DeleteTemporaryPostRequest,
  AddPostRequest,
  AttachmentType,
  Attachment,
  LMFeedPostAttachment,
  LMFeedPostAttachmentMeta,
} from "@likeminds.community/feed-js";
import { HelperFunctionsClass } from "../shared/helper";
import { LMAppAwsKeys } from "../shared/constants/lmAppAwsKeys";

export interface LMFeedRetryPostHook {
  isVisible: boolean;
  tempPostId: string | null;
  uploadFailed: boolean;
  handleRetry: () => Promise<void>;
  handleCancel: () => Promise<void>;
}

export const useLMFeedRetryPost = (): LMFeedRetryPostHook => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempPostId, setTempPostId] = useState<string | null>(null);
  const [uploadFailed, setUploadFailed] = useState(false);

  const { customEventClient, lmFeedclient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { currentUser } = useContext(LMFeedUserProviderContext);

  useEffect(() => {
    const checkTemporaryPost = async () => {
      try {
        const response = await lmFeedclient?.getTemporaryPost();
        if (response?.data?.tempPost) {
          const tempId = response.data.tempPost.post.id;
          setTempPostId(tempId);
          setIsVisible(true);
          setUploadFailed(true);
        }
      } catch (error) {
        console.error("Error checking temporary post:", error);
      }
    };

    checkTemporaryPost();

    const handlePostCreationStarted = (event: Event) => {
      const customEvent = event as CustomEvent;
      setTempPostId(customEvent.detail.tempId);
      setIsVisible(true);
      setUploadFailed(false);
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
        setUploadFailed(false);
        setIsVisible(false);
        const post = await lmFeedclient.getTemporaryPost();
        const tempPost = post?.data?.tempPost?.post;

        if (tempPost) {
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_CREATION_STARTED,
            { tempId: tempPost.id },
          );
          try {
            const mediaList = tempPost.attachments || [];
            const attachmentResponseArray: Attachment[] = [];
            if (!currentUser?.sdkClientInfo?.uuid) {
              throw new Error("User ID not found");
            }
            for (const attachment of mediaList) {
              if (
                attachment.type === AttachmentType.IMAGE ||
                attachment.type === AttachmentType.REEL ||
                attachment.type === AttachmentType.VIDEO ||
                attachment.type === AttachmentType.DOCUMENT
              ) {
                if (!attachment.metaData?.url) {
                  console.warn("No URL found for attachment:", attachment);
                  continue;
                }
                try {
                  const response = await fetch(attachment.metaData.url);
                  const blob = await response.blob();
                  const file = new File(
                    [blob],
                    attachment.metaData.name || "file",
                    {
                      type:
                        response.headers.get("content-type") ||
                        "application/octet-stream",
                    },
                  );
                  (await HelperFunctionsClass.uploadMedia(
                    file,
                    currentUser?.sdkClientInfo.uuid || "",
                  )) as never;

                  const uploadedFileKey = `https://${LMAppAwsKeys.bucketName}.s3.${LMAppAwsKeys.region}.amazonaws.com/${`files/post/${currentUser?.sdkClientInfo.uuid || ""}/${file.name}`}`;
                  attachment.metaData.url = uploadedFileKey;

                  switch (attachment.type) {
                    case AttachmentType.IMAGE: {
                      attachmentResponseArray.push(
                        LMFeedPostAttachment.builder()
                          .setType(AttachmentType.IMAGE)
                          .setMetadata(
                            LMFeedPostAttachmentMeta.builder()
                              .setUrl(uploadedFileKey)
                              .setFormat(
                                file?.name?.split(".").slice(-1).toString(),
                              )
                              .setSize(file.size)
                              .setName(file.name)
                              .setHeight(attachment.metaData.height || 0)
                              .setWidth(attachment.metaData.width || 0)
                              .build(),
                          )
                          .build(),
                      );
                      break;
                    }
                    case AttachmentType.VIDEO: {
                      attachmentResponseArray.push(
                        LMFeedPostAttachment.builder()
                          .setType(AttachmentType.VIDEO)
                          .setMetadata(
                            LMFeedPostAttachmentMeta.builder()
                              .setUrl(uploadedFileKey)
                              .setFormat(
                                file?.name?.split(".").slice(-1).toString(),
                              )
                              .setSize(file.size)
                              .setName(file.name)
                              .setDuration(10)
                              .setHeight(attachment.metaData.height || 0)
                              .setWidth(attachment.metaData.width || 0)
                              .build(),
                          )
                          .build(),
                      );
                      break;
                    }
                    case AttachmentType.DOCUMENT: {
                      attachmentResponseArray.push(
                        LMFeedPostAttachment.builder()
                          .setType(AttachmentType.DOCUMENT)
                          .setMetadata(
                            LMFeedPostAttachmentMeta.builder()
                              .setUrl(uploadedFileKey)
                              .setFormat(
                                file?.name?.split(".").slice(-1).toString(),
                              )
                              .setSize(file.size)
                              .setName(file.name)
                              .build(),
                          )
                          .build(),
                      );
                      break;
                    }
                    case AttachmentType.REEL: {
                      // New case for attachmentType 11 (Reels)
                      attachmentResponseArray.push(
                        LMFeedPostAttachment.builder()
                          .setType(AttachmentType.REEL)
                          .setMetadata(
                            LMFeedPostAttachmentMeta.builder()
                              .setUrl(uploadedFileKey)
                              .setFormat(
                                file?.name?.split(".").slice(-1).toString(),
                              )
                              .setSize(file.size)
                              .setName(file.name)
                              .setDuration(10) // Assuming duration is applicable to reels
                              .setHeight(attachment.metaData.height || 0)
                              .setWidth(attachment.metaData.width || 0)
                              .build(),
                          )
                          .build(),
                      );
                      break;
                    }
                  }
                } catch (error) {
                  continue;
                }
              } else {
                continue;
              }
            }

            if (attachmentResponseArray.length > 0) {
              const addPostRequest = AddPostRequest.builder()
                .setAttachments(attachmentResponseArray)
                .setText(tempPost.text || "")
                .setTopicIds(tempPost.topics || [])
                .setTempId(Date.now().toString())
                .setIsAnonymous(tempPost.isAnonymous || false);

              if (tempPost.heading) {
                addPostRequest.setHeading(tempPost.heading);
              }

              const addPostResponse = await lmFeedclient.addPost(
                addPostRequest.build(),
              );
              if (addPostResponse?.success) {
                const deleteRequest = DeleteTemporaryPostRequest.builder()
                  .setTemporaryPostId(tempPostId)
                  .build();

                await lmFeedclient.deleteTemporaryPost(deleteRequest);

                customEventClient?.dispatchEvent(
                  LMFeedCustomActionEvents.POST_CREATED,
                  {},
                );
              }
            }
          } catch (error) {
            customEventClient?.dispatchEvent(
              LMFeedCustomActionEvents.POST_CREATION_FAILED,
              {},
            );
          }
        }
      } catch (error) {
        console.error("Error getting temporary post:", error);
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
          {},
        );
      }
    }
  };

  const handleCancel = async () => {
    if (tempPostId && lmFeedclient) {
      try {
        HelperFunctionsClass.cancelUpload();

        const request = DeleteTemporaryPostRequest.builder()
          .setTemporaryPostId(tempPostId)
          .build();

        await lmFeedclient?.deleteTemporaryPost(request);

        setTempPostId(null);
        setIsVisible(false);
        setUploadFailed(false);

        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
        );
      } catch (error) {
        console.error("Error during cancellation:", error);
        setTempPostId(null);
        setIsVisible(false);
        setUploadFailed(false);
      }
    }
  };

  return {
    isVisible,
    tempPostId,
    uploadFailed,
    handleRetry,
    handleCancel,
  };
};
