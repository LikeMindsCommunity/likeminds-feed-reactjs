/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { extractTextFromNode } from "../shared/utils";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  AddPostRequest,
  Attachment,
  DecodeURLRequest,
  EditPostRequest,
  LMFeedPostAttachment,
  LMFeedPostAttachmentMeta,
} from "@likeminds.community/feed-js-beta";
import { UploadMediaModel } from "../shared/types/models/uploadMedia";
import { HelperFunctionsClass } from "../shared/helper";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { OgTag } from "../shared/types/models/ogTag";
import { GetOgTagResponse } from "../shared/types/api-responses/getOgTagResponse";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import {
  AddPostResponse,
  EditPostResponse,
} from "../shared/types/api-responses/addPostResponse";
import { PostCreationActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
import { LMAppAwsKeys } from "../shared/constants/lmAppAwsKeys";

interface UseCreatePost {
  postText: string | null;
  setPostText: (text: string) => void;
  mediaList: File[];
  addMediaItem: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeMedia: (index: number) => void;
  clearMedia: () => void;
  mediaUploadMode: LMFeedCreatePostMediaUploadMode;
  changeMediaUploadMode: (mode: LMFeedCreatePostMediaUploadMode) => void;
  textFieldRef: MutableRefObject<HTMLDivElement | null>;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  postFeed: () => Promise<void>;
  editPost: () => Promise<void>;
  ogTag: OgTag | null;
  openCreatePostDialog: boolean;
  setOpenCreatePostDialog: React.Dispatch<boolean>;
  temporaryPost: Post | null;
  selectedTopicIds: string[];
  setSelectedTopicIds: React.Dispatch<string[]>;
  preSelectedTopics: Topic[];
  setPreSelectedTopics: React.Dispatch<Topic[]>;
  showOGTagViewContainer: boolean;
  closeOGTagContainer: () => void;
  createPostComponentClickCustomCallback?: ComponentDelegatorListener;
}

export function useCreatePost(): UseCreatePost {
  // Getting context values

  const { lmFeedclient, customEventClient, lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );
  const { displaySnackbarMessage, closeSnackbar, showSnackbar, message } =
    useContext(GeneralContext);
  const {
    PostCreationCustomCallbacks = {},
    createPostComponentClickCustomCallback,
  } = useContext(CustomAgentProviderContext);
  const { postFeedCustomAction, editPostCustomAction } =
    PostCreationCustomCallbacks;

  // declating state variables
  const [openCreatePostDialog, setOpenCreatePostDialog] =
    useState<boolean>(false);
  const [showOGTagViewContainer, setShowOGTagViewContainer] =
    useState<boolean>(true);
  const [text, setText] = useState<string | null>("");
  const [temporaryPost, setTemporaryPost] = useState<Post | null>(null);
  const [mediaList, setMediaList] = useState<File[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [preSelectedTopics, setPreSelectedTopics] = useState<Topic[]>([]);
  const [mediaUploadMode, setMediaUploadMode] =
    useState<LMFeedCreatePostMediaUploadMode>(
      LMFeedCreatePostMediaUploadMode.NULL,
    );
  const [ogTag, setOgtag] = useState<OgTag | null>(null);
  // declaring refs
  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  function changeMediaUploadMode(mode: LMFeedCreatePostMediaUploadMode) {
    setMediaUploadMode(mode);
  }

  function resetStates() {
    setShowOGTagViewContainer(true);
    setText(null);
    setTemporaryPost(null);
    setMediaList([]);
    setPreSelectedTopics([]);
    setSelectedTopicIds([]);
    setMediaUploadMode(LMFeedCreatePostMediaUploadMode.NULL);
    setOgtag(null);
  }

  function setPostText(txt: string) {
    setText(txt);
  }

  function addMediaItem(event: React.ChangeEvent<HTMLInputElement>) {
    const mediaArray = event.target.files;
    const mediaCopy = [...mediaList, ...Array.from(mediaArray!)];
    if (temporaryPost) {
      const feedAttachmentType = mediaArray?.item(0)?.type;
      lmfeedAnalyticsClient?.sendAddMoreAttachmentClickedEvent(
        temporaryPost.id,
        feedAttachmentType || "",
      );
    }

    setMediaList(mediaCopy);
  }

  function removeMedia(index: number) {
    const mediaCopy = [...mediaList];
    mediaCopy.splice(index, 1);
    setMediaList(mediaCopy);
  }

  function clearMedia() {
    setMediaList([]);
  }

  function closeOGTagContainer() {
    setShowOGTagViewContainer(false);
  }

  const postFeed = useCallback(
    async function (customWidgetsData?: Record<string, any>[]) {
      try {
        setOpenCreatePostDialog(false);

        const textContent: string = extractTextFromNode(
          textFieldRef.current,
        ).trim();

        const attachmentResponseArray: Attachment[] = [];
        for (let index = 0; index < mediaList.length; index++) {
          const file: File = mediaList[index];

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const resp: UploadMediaModel =
            (await HelperFunctionsClass.uploadMedia(
              file,
              currentUser?.sdkClientInfo.uuid || "",
            )) as never;
          const uploadedFileKey = `https://${LMAppAwsKeys.bucketNameProd}.s3.${LMAppAwsKeys.region}.amazonaws.com/${`files/post/${currentUser?.sdkClientInfo.uuid || ""}/${file.name}`}`;
          const attachmentType = file.type.includes("image")
            ? 1
            : file.type.includes("video") &&
                mediaUploadMode === LMFeedCreatePostMediaUploadMode.REEL
              ? 11 // Setting attachmentType to 11 for reels
              : file.type.includes("video")
                ? 2
                : file.type.includes("pdf")
                  ? 3
                  : 4;

          switch (attachmentType) {
            case 1: {
              attachmentResponseArray.push(
                LMFeedPostAttachment.builder()
                  .setAttachmentType(1)
                  .setAttachmentMeta(
                    LMFeedPostAttachmentMeta.builder()
                      .seturl(uploadedFileKey)
                      .setformat(file?.name?.split(".").slice(-1).toString())
                      .setsize(file.size)
                      .setname(file.name)
                      .build(),
                  )
                  .build(),
              );
              break;
            }
            case 2: {
              attachmentResponseArray.push(
                LMFeedPostAttachment.builder()
                  .setAttachmentType(2)
                  .setAttachmentMeta(
                    LMFeedPostAttachmentMeta.builder()
                      .seturl(uploadedFileKey)
                      .setformat(file?.name?.split(".").slice(-1).toString())
                      .setsize(file.size)
                      .setname(file.name)
                      .setduration(10)
                      .build(),
                  )
                  .build(),
              );
              break;
            }
            case 3: {
              attachmentResponseArray.push(
                LMFeedPostAttachment.builder()
                  .setAttachmentType(3)
                  .setAttachmentMeta(
                    LMFeedPostAttachmentMeta.builder()
                      .seturl(uploadedFileKey)
                      .setformat(file?.name?.split(".").slice(-1).toString())
                      .setsize(file.size)
                      .setname(file.name)
                      .build(),
                  )
                  .build(),
              );
              break;
            }
            case 11: {
              // New case for attachmentType 11 (Reels)
              attachmentResponseArray.push(
                LMFeedPostAttachment.builder()
                  .setAttachmentType(11)
                  .setAttachmentMeta(
                    LMFeedPostAttachmentMeta.builder()
                      .seturl(uploadedFileKey)
                      .setformat(file?.name?.split(".").slice(-1).toString())
                      .setsize(file.size)
                      .setname(file.name)
                      .setduration(10) // Assuming duration is applicable to reels
                      .build(),
                  )
                  .build(),
              );
              break;
            }
          }
        }

        if (!mediaList.length && ogTag) {
          attachmentResponseArray.push(
            LMFeedPostAttachment.builder()
              .setAttachmentType(4)
              .setAttachmentMeta(
                LMFeedPostAttachmentMeta.builder().setogTags(ogTag).build(),
              )
              .build(),
          );
        }
        if (customWidgetsData) {
          for (const customWidgetData of customWidgetsData) {
            attachmentResponseArray.push(
              LMFeedPostAttachment.builder()
                .setAttachmentType(5)
                .setAttachmentMeta(
                  LMFeedPostAttachmentMeta.builder()
                    .setMeta(customWidgetData)
                    .build(),
                )
                .build(),
            );
          }
        }

        const call: AddPostResponse = await lmFeedclient!.addPost(
          AddPostRequest.builder()
            .setAttachments(attachmentResponseArray)
            .setText(textContent)
            .setTopicIds(selectedTopicIds)
            .setTempId(Date.now().toString())
            .build(),
        );
        if (call.success) {
          lmfeedAnalyticsClient?.sendPostCreatedEvent(call.data.post);
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_CREATED,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      currentUser?.sdkClientInfo.uuid,
      customEventClient,
      lmFeedclient,
      lmfeedAnalyticsClient,
      mediaList,
      mediaUploadMode,
      ogTag,
      selectedTopicIds,
    ],
  );

  const editPost = useCallback(
    async function (customWidgetsData?: Record<string, any>[]) {
      try {
        setOpenCreatePostDialog(false);
        const textContent: string = extractTextFromNode(
          textFieldRef.current,
        ).trim();
        const attachmentResponseArray: Attachment[] = temporaryPost?.attachments
          ? temporaryPost.attachments
          : [];
        if (ogTag) {
          if (
            !attachmentResponseArray.some(
              (attachment) =>
                attachment.attachmentType === 1 ||
                attachment.attachmentType === 2 ||
                attachment.attachmentType === 3 ||
                attachment.attachmentType === 11,
            )
          ) {
            attachmentResponseArray.pop();
            attachmentResponseArray.push(
              LMFeedPostAttachment.builder()
                .setAttachmentType(4)
                .setAttachmentMeta(
                  LMFeedPostAttachmentMeta.builder().setogTags(ogTag).build(),
                )
                .build(),
            );
          }
        } else {
          if (
            attachmentResponseArray.some(
              (attachment) => attachment.attachmentType === 4,
            )
          ) {
            attachmentResponseArray.pop();
          }
        }
        if (customWidgetsData) {
          for (const customWidgetData of customWidgetsData) {
            attachmentResponseArray.push(
              LMFeedPostAttachment.builder()
                .setAttachmentType(5)
                .setAttachmentMeta(
                  LMFeedPostAttachmentMeta.builder()
                    .setMeta(customWidgetData)
                    .build(),
                )
                .build(),
            );
          }
        }
        const call: EditPostResponse = (await lmFeedclient?.editPost(
          EditPostRequest.builder()
            .setattachments(attachmentResponseArray)
            .settext(textContent)
            .setTopicIds(selectedTopicIds)
            .setpostId(temporaryPost?.id || "")
            .build(),
        )) as never;
        if (call.success) {
          lmfeedAnalyticsClient?.sendPostEditedEvent(call.data.post);
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_EDITED,
            {
              post: call.data.post,
              usersMap: call.data.users,
              topicsMap: call.data.topics,
            },
          );
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_EDITED_TARGET_DETAILS,
            {
              post: call.data.post,
              usersMap: call.data.users,
              topicsMap: call.data.topics,
            },
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      customEventClient,
      lmFeedclient,
      lmfeedAnalyticsClient,
      ogTag,
      selectedTopicIds,
      temporaryPost?.id,
      temporaryPost?.attachments,
    ],
  );

  useEffect(() => {
    const checkForLinksTimeout = setTimeout(async () => {
      try {
        const linksDetected = HelperFunctionsClass.detectLinks(text || "");
        if (linksDetected.length) {
          const firstLinkDetected = linksDetected[0];
          if (firstLinkDetected.toString() !== ogTag?.url.toString()) {
            const getOgTagData: GetOgTagResponse =
              await lmFeedclient!.decodeURL(
                DecodeURLRequest.builder().setURL(firstLinkDetected).build(),
              );
            if (getOgTagData?.success) {
              setOgtag(getOgTagData.data.ogTags);
            }
          }
        } else {
          if (ogTag !== null) {
            setOgtag(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);

    return () => clearTimeout(checkForLinksTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lmFeedclient, text]);

  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.OPEN_CREATE_POST_DIALOUGE,
      (event: Event) => {
        setOpenCreatePostDialog(true);
        const details = (event as CustomEvent).detail;
        const tempPost = details.post;
        const topicsMap = details.topics;
        setTemporaryPost(tempPost);
        const preSelectedTopicsArr = tempPost.topics.map((topicId: string) => {
          return topicsMap[topicId];
        });
        const ogTagAttchmentObject = tempPost?.attachments?.filter(
          (attachment: Attachment) => {
            return attachment.attachmentType === 4;
          },
        );
        if (ogTagAttchmentObject.length) {
          setOgtag(ogTagAttchmentObject[0].LMFeedPostAttachmentMeta.ogTags);
        }
        setPreSelectedTopics(preSelectedTopicsArr);
      },
    );
    return () => {
      customEventClient?.remove("OPEN_MENU");
    };
  }, [customEventClient]);
  useEffect(() => {
    if (!openCreatePostDialog) {
      resetStates();
    }
  }, [openCreatePostDialog]);
  const postCreationActionAndDataStore: PostCreationActionsAndDataStore =
    useMemo(() => {
      return {
        postCreationDataStore: {
          openCreatePostDialog,
          setOpenCreatePostDialog,
          showOGTagViewContainer,
          setShowOGTagViewContainer,
          text,
          setText,
          temporaryPost,
          setTemporaryPost,
          mediaList,
          setMediaList,
          selectedTopicIds,
          setSelectedTopicIds,
          preSelectedTopics,
          setPreSelectedTopics,
          mediaUploadMode,
          setMediaUploadMode,
          ogTag,
          setOgtag,
          textFieldRef,
          containerRef,
        },
        applicationGeneralStore: {
          userDataStore: {
            lmFeedUser: currentUser,
            lmFeedUserCurrentCommunity: currentCommunity,
            logOutUser: logoutUser,
          },
          generalDataStore: {
            displaySnackbarMessage,
            closeSnackbar,
            showSnackbar,
            message,
          },
        },
        defaultActions: {
          postFeed,
          editPost,
        },
      };
    }, [
      closeSnackbar,
      currentCommunity,
      currentUser,
      displaySnackbarMessage,
      editPost,
      logoutUser,
      mediaList,
      mediaUploadMode,
      message,
      ogTag,
      openCreatePostDialog,
      postFeed,
      preSelectedTopics,
      selectedTopicIds,
      showOGTagViewContainer,
      showSnackbar,
      temporaryPost,
      text,
    ]);

  // effects fo running analytics
  useEffect(() => {
    if (openCreatePostDialog) {
      lmfeedAnalyticsClient?.sendPostCreationStartedEvent();
    }
  }, [lmfeedAnalyticsClient, openCreatePostDialog]);
  useEffect(() => {
    if (!temporaryPost) {
      lmfeedAnalyticsClient?.sendClickedOnAttachmentEvent(
        null,
        mediaUploadMode,
      );
    } else {
      lmfeedAnalyticsClient?.sendClickedOnAttachmentEvent(
        temporaryPost.id,
        mediaUploadMode,
      );
    }
  }, [lmfeedAnalyticsClient, mediaUploadMode, temporaryPost]);
  useEffect(() => {
    if (ogTag && temporaryPost) {
      lmfeedAnalyticsClient?.sendLinkAttachedEvent(ogTag.url, temporaryPost.id);
    } else if (ogTag) {
      lmfeedAnalyticsClient?.sendLinkAttachedEvent(ogTag.url);
    }
  }, [lmfeedAnalyticsClient, ogTag, temporaryPost]);
  return {
    postText: text,
    mediaList,
    setPostText,
    addMediaItem,
    removeMedia,
    clearMedia,
    mediaUploadMode,
    changeMediaUploadMode,
    textFieldRef,
    containerRef,
    postFeed: postFeedCustomAction
      ? postFeedCustomAction.bind(null, postCreationActionAndDataStore)
      : postFeed,
    editPost: editPostCustomAction
      ? editPostCustomAction.bind(null, postCreationActionAndDataStore)
      : editPost,
    ogTag,
    openCreatePostDialog,
    setOpenCreatePostDialog,
    temporaryPost,
    selectedTopicIds,
    setSelectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    showOGTagViewContainer,
    closeOGTagContainer,
    createPostComponentClickCustomCallback:
      createPostComponentClickCustomCallback
        ? createPostComponentClickCustomCallback.bind(
            null,
            postCreationActionAndDataStore,
          )
        : undefined,
  };
}
