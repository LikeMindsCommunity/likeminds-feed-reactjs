/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTempPost } from "../shared/utils/createTempPost";
import { isMediaAttachmentType } from "../shared/utils/attachmentUtils";
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
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import {
  AddPostRequest,
  Attachment,
  AttachmentType,
  DecodeURLRequest,
  EditPostRequest,
  LMFeedPostAttachment,
  LMFeedPostAttachmentMeta,
} from "@likeminds.community/feed-js";
import { UploadMediaModel } from "../shared/types/models/uploadMedia";
import { HelperFunctionsClass } from "../shared/helper";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { OgTag } from "../shared/types/models/ogTag";
import { GetOgTagResponse } from "../shared/types/api-responses/getOgTagResponse";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { EditPostResponse } from "../shared/types/api-responses/addPostResponse";
import { PostCreationActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
import { LMAppAwsKeys } from "../shared/constants/lmAppAwsKeys";
import { numberToPollMultipleSelectState } from "../shared/utils";
import { PollType } from "../shared/enums/ImPollType";
import { getDisplayMessage, getVideoDimensions, getImageDimensions } from "../shared/utils";

import {
  OneArgVoidReturns,
  TwoArgVoidReturns,
  ZeroArgVoidReturns,
} from "./useInputs";
import { SelectChangeEvent } from "@mui/material";
import { SaveTemporaryPostRequest } from "@likeminds.community/feed-js";
import { DeleteTemporaryPostRequest } from "@likeminds.community/feed-js";

interface UseCreatePost {
  postText: string | null;
  setPostText: (text: string) => void;
  question: string | null;
  setQuestionText: (text: string) => void;
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
  clearPollFunction: () => void;
  editPollFunction: () => void;
  selectedTopicIds: string[];
  setSelectedTopicIds: React.Dispatch<string[]>;
  preSelectedTopics: Topic[];
  setPreSelectedTopics: React.Dispatch<Topic[]>;
  showOGTagViewContainer: boolean;
  closeOGTagContainer: () => void;
  removeThumbnailReel: () => void;
  removeAddReel: () => void;
  createPostComponentClickCustomCallback?: ComponentDelegatorListener;
  addThumbnailReel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addReel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tempReel: File[];
  tempReelThumbnail: File[];
  isAnonymousPost: boolean;
  changeAnonymousPostStatus: () => void;

  openCreatePollDialog: boolean;
  setOpenCreatePollDialog: React.Dispatch<boolean>;
  pollOptions: PollOption[];
  addPollOption: ZeroArgVoidReturns;
  updatePollOption: TwoArgVoidReturns<string, number>;
  removePollOption: OneArgVoidReturns<number>;
  changePollText: OneArgVoidReturns<React.ChangeEvent<HTMLTextAreaElement>>;
  pollText: string;
  updatePollExpirationDate: OneArgVoidReturns<number | null>;
  pollExpirationDate: number | null;
  advancedOptions: AdvancedPollOptions;
  validatePoll: boolean;
  previewPoll: boolean;
  setPreviewPoll: React.Dispatch<boolean>;
  updateAdvancedOptions: OneArgVoidReturns<
    React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>
  >;
  pollExpiryTimeClickFunction: () => void;
}

export interface AdvancedPollOptions {
  ALLOW_VOTERS_TO_ADD_OPTIONS: boolean;
  ALLOW_ANONYMOUS_VOTING: boolean;
  DONT_SHOW_LIVE_RESULTS: boolean;
  MULTIPLE_SELECTION_STATE: number;
  MULTIPLE_SELECTION_NO: number;
}

export interface PollOption {
  text: string;
}

export function useCreatePost(): UseCreatePost {
  const [openCreatePollDialog, setOpenCreatePollDialog] =
    useState<boolean>(false);

  const [pollText, setPollText] = useState<string>("");
  const [validatePoll, setValidatePoll] = useState<boolean>(false);
  const [previewPoll, setPreviewPoll] = useState<boolean>(false);
  const [advancedPollOptions, setAdvancedPollOptions] =
    useState<AdvancedPollOptions>({
      ALLOW_ANONYMOUS_VOTING: false,
      ALLOW_VOTERS_TO_ADD_OPTIONS: false,
      MULTIPLE_SELECTION_NO: 1,
      MULTIPLE_SELECTION_STATE: 0,
      DONT_SHOW_LIVE_RESULTS: false,
    });
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    {
      text: "",
    },
    {
      text: "",
    },
  ]);
  const [pollExpirationDate, setPollExpirationDate] = useState<number | null>(
    null,
  );
  const updatePollExpirationDate = (
    expiryDateInMilliseconds: number | null,
  ) => {
    setPollExpirationDate(expiryDateInMilliseconds);
  };
  const addPollOption = () => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions = [...currentPollOptions];
      currentPollOptions.push({
        text: "",
      });
      return currentPollOptions;
    });
  };
  const removePollOption = (index: number) => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions = [...currentPollOptions];
      currentPollOptions.splice(index, 1);
      return currentPollOptions;
    });
  };
  const updatePollOption = (text: string, index: number) => {
    setPollOptions((currentPollOptions) => {
      currentPollOptions = [...currentPollOptions];
      currentPollOptions[index].text = text;
      return currentPollOptions;
    });
  };
  const updateAdvancedOptions = (
    clickedEvent:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<number>,
  ) => {
    setAdvancedPollOptions((currentOptions) => {
      const option = clickedEvent.currentTarget
        ? clickedEvent.target.name
        : clickedEvent.target.name;
      switch (option) {
        case "ALLOW_VOTERS_TO_ADD_OPTIONS":
          return {
            ...currentOptions,
            ALLOW_VOTERS_TO_ADD_OPTIONS:
              !currentOptions.ALLOW_VOTERS_TO_ADD_OPTIONS,
          };
        case "ALLOW_ANONYMOUS_VOTING":
          return {
            ...currentOptions,
            ALLOW_ANONYMOUS_VOTING: !currentOptions.ALLOW_ANONYMOUS_VOTING,
          };
        case "DONT_SHOW_LIVE_RESULTS":
          return {
            ...currentOptions,
            DONT_SHOW_LIVE_RESULTS: !currentOptions.DONT_SHOW_LIVE_RESULTS,
          };
        case "MULTIPLE_SELECTION_STATE":
          return {
            ...currentOptions,
            MULTIPLE_SELECTION_STATE: parseInt(
              clickedEvent.target.value.toString(),
            ),
          };
        case "MULTIPLE_SELECTION_NO":
          return {
            ...currentOptions,
            MULTIPLE_SELECTION_NO: parseInt(
              clickedEvent.target.value.toString(),
            ),
          };
        default:
          return currentOptions;
      }
    });
  };
  const {
    displaySnackbarMessage,
    closeSnackbar,
    allowThumbnail,
    showSnackbar,
    message,
    setOpenPostCreationProgressBar,
  } = useContext(GeneralContext);

  const changePollText = (
    changeEvent: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = changeEvent.target.value;
    setPollText(text);
  };

  useEffect(() => {
    try {
      if (pollText.length === 0) {
        setValidatePoll(false);
        return;
      }
      if (pollOptions.length < 2) {
        setValidatePoll(false);
        return;
      }
      const emptyOption = pollOptions.find((option) => option.text === "");
      if (emptyOption) {
        setValidatePoll(false);
        return;
      }
      if (pollExpirationDate === null) {
        setValidatePoll(false);
        return;
      }
      const pollOptionsMap: Record<string, PollOption> = {};
      for (const option of pollOptions) {
        const optionText = option.text;
        const existingOption = pollOptionsMap[optionText];
        if (existingOption) {
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              getDisplayMessage(
                LMDisplayMessages.POLL_OPTIONS_SHOULD_BE_UNIQUE,
              )!,
            );
          }
          setValidatePoll(false);
          return;
        } else {
          pollOptionsMap[optionText] = option;
        }
      }
      setValidatePoll(true);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollText, pollOptions, pollExpirationDate]);

  const { lmFeedclient, customEventClient, lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );

  const {
    PostCreationCustomCallbacks = {},
    createPostComponentClickCustomCallback,
  } = useContext(CustomAgentProviderContext);
  const {
    postFeedCustomAction,
    editPostCustomAction,

    onPollExpiryTimeClicked,
    onAddOptionClicked,
    onPollOptionCleared,
    onPollCompleteClicked,
    onPollClearClicked,
    onPollEditClicked,
  } = PostCreationCustomCallbacks;

  // declating state variables
  const [openCreatePostDialog, setOpenCreatePostDialog] =
    useState<boolean>(false);
  const [postCreationStarted, setPostCreationStarted] = useState<boolean>(false);
  const [showOGTagViewContainer, setShowOGTagViewContainer] =
    useState<boolean>(true);
  const [text, setText] = useState<string | null>("");

  const [question, setQuestion] = useState<string | null>("");

  const [tempReel, setTempReel] = useState<File[]>([]);
  const [tempReelThumbnail, setTempReelThumbnail] = useState<File[]>([]);
  const [isAnonymousPost, setIsAnonymousPost] = useState<boolean>(false);
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
    setQuestion("");
    setText(null);
    setTemporaryPost(null);
    setMediaList([]);
    setPreSelectedTopics([]);
    setSelectedTopicIds([]);
    setMediaUploadMode(LMFeedCreatePostMediaUploadMode.NULL);
    setOgtag(null);
    setTempReel([]);
    setTempReelThumbnail([]);

    setPollText("");
    setValidatePoll(false);
    setPreviewPoll(false);
    setAdvancedPollOptions({
      ALLOW_ANONYMOUS_VOTING: false,
      ALLOW_VOTERS_TO_ADD_OPTIONS: false,
      MULTIPLE_SELECTION_NO: 1,
      MULTIPLE_SELECTION_STATE: 0,
      DONT_SHOW_LIVE_RESULTS: false,
    });
    setPollOptions([
      {
        text: "",
      },
      {
        text: "",
      },
    ]);
    setPollExpirationDate(null);
  }

  function setPostText(txt: string) {
    setText(txt);
  }

  function setQuestionText(txt: string) {
    setQuestion(txt);
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

  const changeAnonymousPostStatus = (): void => {
    setIsAnonymousPost((current) => !current);
  };
  function addReel(event: React.ChangeEvent<HTMLInputElement>) {
    const mediaArray = event.target.files;
    if (!allowThumbnail) {
      setMediaList(Array.from(mediaArray!));
      return;
    }

    if (tempReelThumbnail.length) {
      const mediaCopy = [
        ...Array.from(tempReelThumbnail),
        ...Array.from(mediaArray!),
      ];
      setMediaList(mediaCopy);
    } else {
      setTempReel(Array.from(mediaArray!));
    }
  }

  function addThumbnailReel(event: React.ChangeEvent<HTMLInputElement>) {
    const mediaArray = event.target.files;
    if (tempReel.length) {
      const mediaCopy = [...Array.from(tempReel), ...Array.from(mediaArray!)];
      setMediaList(mediaCopy);
    } else {
      setTempReelThumbnail(Array.from(mediaArray!));
    }
  }

  function removeThumbnailReel() {
    setTempReelThumbnail([]);
  }

  function removeAddReel() {
    setTempReel([]);
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

  function pollExpiryTimeClickFunction() {}

  function editPollFunction() {
    setPreviewPoll(false);
  }

  function clearPollFunction() {
    if (setOpenCreatePollDialog) {
      setOpenCreatePollDialog(false);
    }
    if (setOpenCreatePostDialog) {
      setOpenCreatePostDialog(true);
    }
  }

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const postFeed = useCallback(
    async function (customWidgetsData?: Record<string, any>[]) {
      try {
        setPostCreationStarted(true);
        if (openCreatePostDialog) setOpenCreatePostDialog(false);
        if (openCreatePollDialog) setOpenCreatePollDialog(false);

        const textContent: string = extractTextFromNode(
          textFieldRef.current,
        ).trim();

        const isCustomWidgetsDataEmpty =
          !customWidgetsData || customWidgetsData.length === 0;

        if (
          !textContent &&
          mediaList.length === 0 &&
          isCustomWidgetsDataEmpty &&
          pollText.length === 0
        ) {
          return;
        }

        const attachmentResponseArray: Attachment[] = [];

        let localTempId = null;
        const tempId = `-${Date.now()}`;

        if (pollText.length !== 0) {
          const pollOtionsList: string[] = pollOptions.map((obj) => obj.text);

          const multipleSelectState =
            numberToPollMultipleSelectState[
              advancedPollOptions.MULTIPLE_SELECTION_STATE
            ];

          const pollType = advancedPollOptions.DONT_SHOW_LIVE_RESULTS
            ? PollType.DEFERRED
            : PollType.INSTANT;
          attachmentResponseArray.push(
            LMFeedPostAttachment.builder()
              .setType(AttachmentType.POLL)
              .setMetadata(
                LMFeedPostAttachmentMeta.builder()
                  .setTitle(pollText)
                  .setPollQuestion(pollText)
                  .setExpiryTime(pollExpirationDate ?? 0)
                  .setOptions(pollOtionsList)
                  .setMultipleSelectState(multipleSelectState)
                  .setPollType(pollType)
                  .setMultipleSelectNumber(
                    advancedPollOptions.MULTIPLE_SELECTION_NO,
                  )
                  .setIsAnonymous(advancedPollOptions.ALLOW_ANONYMOUS_VOTING)
                  .setAllowAddOption(
                    advancedPollOptions.ALLOW_VOTERS_TO_ADD_OPTIONS,
                  )
                  .build(),
              )
              .build(),
          );
        } else {
          // First create attachments with local file paths
          const localAttachments: Attachment[] = [];
          if (mediaList.length) {
            setOpenPostCreationProgressBar!(true);

            localTempId = tempId;
            for (const file of mediaList) {
              const attachmentType = file.type.includes("image")
                ? AttachmentType.IMAGE
                : file.type.includes("video") &&
                    mediaUploadMode === LMFeedCreatePostMediaUploadMode.REEL
                  ? AttachmentType.REEL
                  : file.type.includes("video")
                    ? AttachmentType.VIDEO
                    : file.type.includes("pdf")
                      ? AttachmentType.DOCUMENT
                      : AttachmentType.DOCUMENT;
              const base64 = await readFileAsBase64(file);

              const LMFeedPostAttachmentMetaBuilder =
                LMFeedPostAttachmentMeta.builder()
                  .setUrl(base64) // Store local file URL
                  .setFormat(file?.name?.split(".").slice(-1).toString())
                  .setSize(file.size)
                  .setName(file.name);

              if (attachmentType === AttachmentType.IMAGE) {
                const { width, height } = await getImageDimensions(file);
                LMFeedPostAttachmentMetaBuilder.setWidth(width).setHeight(
                  height,
                );
              }

              if (
                attachmentType === AttachmentType.VIDEO ||
                attachmentType === AttachmentType.REEL
              ) {
                const { width, height } = await getVideoDimensions(file);
                LMFeedPostAttachmentMetaBuilder.setWidth(width).setHeight(
                  height,
                );
              }

              const localAttachment = LMFeedPostAttachment.builder()
                .setType(attachmentType)
                .setMetadata(LMFeedPostAttachmentMetaBuilder.build())
                .build();

              localAttachments.push(localAttachment);
            }

            // Save temporary post with local attachments first
            const tempPost = SaveTemporaryPostRequest.builder()
              .setTempPost({
                post: createTempPost({
                  textContent,
                  attachments: localAttachments,
                  selectedTopicIds,
                  isAnonymousPost,
                  question: question || "",
                  tempId,
                  uuid: currentUser?.sdkClientInfo.uuid || "",
                }),
              })
              .build();

            // Save to local storage
            await lmFeedclient?.saveTemporaryPost(tempPost);

            // Set the temporary post in the context
            setTemporaryPost(tempPost.tempPost.post);

            // Now proceed with AWS upload
            try {
              customEventClient?.dispatchEvent(
                LMFeedCustomActionEvents.POST_CREATION_STARTED,
                { tempId },
              );

              for (const file of mediaList) {
                await HelperFunctionsClass.uploadMedia(
                  file,
                  currentUser?.sdkClientInfo.uuid || "",
                );
              }
            } catch (error) {
              // Hide banner if upload fails
              customEventClient?.dispatchEvent(
                LMFeedCustomActionEvents.POST_CREATION_FAILED,
              );
              throw error; // Re-throw to handle in the outer catch block
            }
          }
          for (let index = 0; index < mediaList.length; index++) {
            const file: File = mediaList[index];

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const resp: UploadMediaModel =
              (await HelperFunctionsClass.uploadMedia(
                file,
                currentUser?.sdkClientInfo.uuid || "",
              )) as never;
            const uploadedFileKey = `https://${LMAppAwsKeys.bucketName}.s3.${LMAppAwsKeys.region}.amazonaws.com/${`files/post/${currentUser?.sdkClientInfo.uuid || ""}/${file.name}`}`;
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
                    .setType(AttachmentType.IMAGE)
                    .setMetadata(
                      LMFeedPostAttachmentMeta.builder()
                        .setUrl(uploadedFileKey)
                        .setFormat(file?.name?.split(".").slice(-1).toString())
                        .setSize(file.size)
                        .setName(file.name)
                        .setHeight(localAttachments[index]?.metaData?.height || 0)
                        .setWidth(localAttachments[index]?.metaData?.width || 0)
                        .build(),
                    )
                    .build(),
                );
                break;
              }
              case 2: {
                attachmentResponseArray.push(
                  LMFeedPostAttachment.builder()
                    .setType(AttachmentType.VIDEO)
                    .setMetadata(
                      LMFeedPostAttachmentMeta.builder()
                        .setUrl(uploadedFileKey)
                        .setFormat(file?.name?.split(".").slice(-1).toString())
                        .setSize(file.size)
                        .setName(file.name)
                        .setDuration(10)
                        .setHeight(localAttachments[index]?.metaData?.height || 0)
                        .setWidth(localAttachments[index]?.metaData?.width || 0)
                        .build(),
                    )
                    .build(),
                );
                break;
              }
              case 3: {
                attachmentResponseArray.push(
                  LMFeedPostAttachment.builder()
                    .setType(AttachmentType.DOCUMENT)
                    .setMetadata(
                      LMFeedPostAttachmentMeta.builder()
                        .setUrl(uploadedFileKey)
                        .setFormat(file?.name?.split(".").slice(-1).toString())
                        .setSize(file.size)
                        .setName(file.name)
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
                    .setType(AttachmentType.REEL)
                    .setMetadata(
                      LMFeedPostAttachmentMeta.builder()
                        .setUrl(uploadedFileKey)
                        .setFormat(file?.name?.split(".").slice(-1).toString())
                        .setSize(file.size)
                        .setName(file.name)
                        .setDuration(10) // Assuming duration is applicable to reels
                        .setHeight(localAttachments[index]?.metaData?.height || 0)
                        .setWidth(localAttachments[index]?.metaData?.width || 0)
                        .build(),
                    )
                    .build(),
                );
                break;
              }
            }
          }
        }

        if (allowThumbnail) {
          if (
            attachmentResponseArray.some(
              (attachment) => attachment.type === AttachmentType.REEL,
            )
          ) {
            if (
              attachmentResponseArray.some(
                (attachment) => attachment.type === AttachmentType.IMAGE,
              )
            ) {
              const imageAttachment = attachmentResponseArray.find(
                (attachment) => attachment.type === AttachmentType.IMAGE,
              );
              const reelAttachment = attachmentResponseArray.find(
                (attachment) => attachment.type === AttachmentType.REEL,
              );
              const thumbnailUrl = imageAttachment?.metaData.url;
              const newAttachmentObject = LMFeedPostAttachment.builder()
                .setType(AttachmentType.REEL)
                .setMetadata(
                  LMFeedPostAttachmentMeta.builder()
                    .setUrl(reelAttachment?.metaData.url || "")
                    .setFormat(
                      reelAttachment?.metaData?.name
                        ?.split(".")
                        .slice(-1)
                        .toString() || "",
                    )
                    .setSize(reelAttachment?.metaData?.size || 0)
                    .setName(reelAttachment?.metaData?.name || "")
                    .setThumbnailUrl(thumbnailUrl || "")
                    // .setDuration(10) // Assuming duration is applicable to reels
                    .build(),
                )
                .build();
              while (attachmentResponseArray.length) {
                attachmentResponseArray.pop();
              }
              attachmentResponseArray.push(newAttachmentObject);
            }
          }
        }

        if (!mediaList.length && ogTag) {
          attachmentResponseArray.push(
            LMFeedPostAttachment.builder()
              .setType(AttachmentType.LINK)
              .setMetadata(
                LMFeedPostAttachmentMeta.builder().setOgTags(ogTag).build(),
              )
              .build(),
          );
        }
        if (customWidgetsData) {
          // Modifies user prodived custom widgets data to the format required by the API
          const newCustomWidgetsData = customWidgetsData.map((customData) => {
            return {
              meta: customData,
            };
          });
          for (const customWidgetData of newCustomWidgetsData) {
            attachmentResponseArray.push(
              LMFeedPostAttachment.builder()
                .setType(AttachmentType.CUSTOM)
                .setMetadata(
                  LMFeedPostAttachmentMeta.builder()
                    .setWidgetMeta(customWidgetData)
                    .build(),
                )
                .build(),
            );
          }
        }

        const addPostRequestBuilder = AddPostRequest.builder()
          .setAttachments(attachmentResponseArray)
          .setText(textContent)
          .setTopicIds(selectedTopicIds)
          .setTempId(Date.now().toString())
          .setIsAnonymous(isAnonymousPost);

        if (question && question?.length > 0) {
          addPostRequestBuilder.setHeading(question);
        }

        const addPostRequest = addPostRequestBuilder.build();

        // Check if post has media attachments
        const hasMediaAttachments = attachmentResponseArray.some((attachment) =>
          isMediaAttachmentType(attachment.type),
        );
        const call = await lmFeedclient?.addPost(addPostRequest);
        if (call?.success) {
          if (hasMediaAttachments && localTempId) {
            const deleteRequest = DeleteTemporaryPostRequest.builder()
              .setTemporaryPostId(localTempId) // Use the same ID that was saved
              .build();

            // Delete the temporary post from IndexedDB
            await lmFeedclient?.deleteTemporaryPost(deleteRequest);
          }

          lmfeedAnalyticsClient?.sendPostCreatedEvent(call?.data?.post);
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_CREATED,
          );
        }
      } catch (error) {
        console.log(error);
        // Dispatch failed event with upload failure flag
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.POST_CREATION_FAILED,
          { isUploadFailure: true },
        );
      } finally {
        setOpenPostCreationProgressBar!(false);
        setPostCreationStarted(false);
        resetStates();
      }
    },
    [
      openCreatePostDialog,
      openCreatePollDialog,
      pollText,
      allowThumbnail,
      mediaList,
      ogTag,
      selectedTopicIds,
      isAnonymousPost,
      question,
      lmFeedclient,
      pollOptions,
      advancedPollOptions.MULTIPLE_SELECTION_STATE,
      advancedPollOptions.DONT_SHOW_LIVE_RESULTS,
      advancedPollOptions.MULTIPLE_SELECTION_NO,
      advancedPollOptions.ALLOW_ANONYMOUS_VOTING,
      advancedPollOptions.ALLOW_VOTERS_TO_ADD_OPTIONS,
      pollExpirationDate,
      setOpenPostCreationProgressBar,
      currentUser?.sdkClientInfo.uuid,
      mediaUploadMode,
      lmfeedAnalyticsClient,
      customEventClient,
    ],
  );

  const editPost = useCallback(
    async function (customWidgetsData?: Record<string, any>[]) {
      try {
        setOpenCreatePostDialog(false);
        const textContent: string = extractTextFromNode(
          textFieldRef.current,
        ).trim();
        let attachmentResponseArray: Attachment[] =
          temporaryPost?.attachments && temporaryPost.attachments.length > 0
            ? temporaryPost.attachments
            : [];

        if (ogTag) {
          if (
            !attachmentResponseArray.some((attachment) =>
              isMediaAttachmentType(attachment.type),
            )
          ) {
            attachmentResponseArray.pop();
            attachmentResponseArray.push(
              LMFeedPostAttachment.builder()
                .setType(AttachmentType.LINK)
                .setMetadata(
                  LMFeedPostAttachmentMeta.builder().setOgTags(ogTag).build(),
                )
                .build(),
            );
          }
        } else {
          if (
            attachmentResponseArray.some(
              (attachment) => attachment.type === AttachmentType.LINK,
            )
          ) {
            attachmentResponseArray.pop();
          }
        }
        if (customWidgetsData) {
          attachmentResponseArray = attachmentResponseArray.filter(
            (attachment) => attachment.type !== AttachmentType.CUSTOM,
          );
          // Modifies user prodived custom widgets data to the format required by the API
          const newCustomWidgetsData = customWidgetsData.map((customData) => {
            return {
              meta: customData,
            };
          });
          for (const customWidgetData of newCustomWidgetsData) {
            attachmentResponseArray.push(
              LMFeedPostAttachment.builder()
                .setType(AttachmentType.CUSTOM)
                .setMetadata(
                  LMFeedPostAttachmentMeta.builder()
                    .setWidgetMeta(customWidgetData)
                    .build(),
                )
                .build(),
            );
          }
        }

        const editPostRequestBuilder = EditPostRequest.builder()
          .setAttachments(attachmentResponseArray)
          .setText(textContent)
          .setTopicIds(selectedTopicIds)
          .setPostId(temporaryPost?.id || "");

        // let questionText;
        if (question && question?.length > 0) {
          editPostRequestBuilder.setHeading(question);
        }

        const editPostRequest = editPostRequestBuilder.build();

        const call: EditPostResponse = (await lmFeedclient?.editPost(
          editPostRequest,
        )) as never;
        if (call.success) {
          lmfeedAnalyticsClient?.sendPostEditedEvent(call.data.post);
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_EDITED,
            {
              post: call.data.post,
              usersMap: call.data.users,
              topicsMap: call.data.topics,
              widgets: call.data.widgets,
            },
          );
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_EDITED_TARGET_DETAILS,
            {
              post: call.data.post,
              usersMap: call.data.users,
              topicsMap: call.data.topics,
              widgetsMap: call.data.widgets,
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
      question,
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
    // Listen for post creation started event
    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_CREATION_STARTED,
      () => {
        setPostCreationStarted(true);
      }
    );

    // Listen for post creation completed/failed events
    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_CREATED,
      () => {
        setPostCreationStarted(false);
      }
    );

    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_CREATION_FAILED,
      () => {
        setPostCreationStarted(false);
      }
    );

    // Listen for retry upload event
    customEventClient?.listen(
      LMFeedCustomActionEvents.RETRY_POST_UPLOAD,
      async (event: Event) => {
        const customEvent = event as CustomEvent;
        const post = customEvent.detail?.post;
        if (post) {
          // Reset states and start upload again
          setTemporaryPost(post);
          try {
            setOpenPostCreationProgressBar!(true);
            // Re-upload media attachments
            for (const attachment of post.attachments) {
              if (isMediaAttachmentType(attachment.type)) {
                const file = attachment.metaData.file;
                await HelperFunctionsClass.uploadMedia(
                  file,
                  currentUser?.sdkClientInfo.uuid || "",
                );
              }
            }
            // If upload successful, create the post
            const addPostRequest = AddPostRequest.builder()
              .setAttachments(post.attachments)
              .setText(post.text)
              .setTopicIds(post.topics)
              .setTempId(post.id)
              .setIsAnonymous(post.isAnonymous)
              .build();

            const call = await lmFeedclient?.addPost(addPostRequest);
            if (call?.success) {
              // Delete temporary post after successful creation
              const deleteRequest = DeleteTemporaryPostRequest.builder()
                .setTemporaryPostId(post.id)
                .build();
              await lmFeedclient?.deleteTemporaryPost(deleteRequest);

              customEventClient?.dispatchEvent(
                LMFeedCustomActionEvents.POST_CREATED,
              );
            }
          } catch (error) {
            customEventClient?.dispatchEvent(
              LMFeedCustomActionEvents.POST_CREATION_FAILED,
              { isUploadFailure: true },
            );
          } finally {
            setOpenPostCreationProgressBar!(false);
            resetStates();
          }
        }
      },
    );

    customEventClient?.listen(
      LMFeedCustomActionEvents.OPEN_CREATE_POST_DIALOUGE,
      (event: Event) => {
        if (!postCreationStarted) {
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
              return attachment.type === AttachmentType.LINK;
            },
          );
          if (ogTagAttchmentObject.length) {
            setOgtag(ogTagAttchmentObject[0].LMFeedPostAttachmentMeta.ogTags);
          }
          setPreSelectedTopics(preSelectedTopicsArr);
        }
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
  }, [openCreatePostDialog, openCreatePollDialog]);
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
          removeThumbnailReel,
          removeAddReel,
          mediaUploadMode,
          setMediaUploadMode,
          ogTag,
          setOgtag,
          textFieldRef,
          containerRef,
          isAnonymousPost,
          changeAnonymousPostStatus,

          openCreatePollDialog,
          setOpenCreatePollDialog,
          pollOptions,
          pollText,
          pollExpirationDate,
          advancedOptions: advancedPollOptions,
          validatePoll,
          previewPoll,
          setPreviewPoll,
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
      advancedPollOptions,
      closeSnackbar,
      currentCommunity,
      currentUser,
      displaySnackbarMessage,
      editPost,
      isAnonymousPost,
      logoutUser,
      mediaList,
      mediaUploadMode,
      message,
      ogTag,
      openCreatePollDialog,
      openCreatePostDialog,
      pollExpirationDate,
      pollOptions,
      pollText,
      postFeed,
      preSelectedTopics,
      previewPoll,
      selectedTopicIds,
      showOGTagViewContainer,
      showSnackbar,
      temporaryPost,
      text,
      validatePoll,
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

  useEffect(() => {
    if (temporaryPost && temporaryPost.heading) {
      setQuestion(temporaryPost.heading);
    }
  }, [temporaryPost]);

  return {
    postText: text,
    setPostText,
    question: question,
    setQuestionText,
    mediaList,
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
    setOpenCreatePostDialog: (value: boolean) => {
      if (!postCreationStarted) {
        setOpenCreatePostDialog(value);
      }
    },
    temporaryPost,
    clearPollFunction: onPollClearClicked
      ? onPollClearClicked.bind(null, postCreationActionAndDataStore)
      : clearPollFunction,
    editPollFunction: onPollEditClicked
      ? onPollEditClicked.bind(null, postCreationActionAndDataStore)
      : editPollFunction,
    isAnonymousPost,
    changeAnonymousPostStatus,
    selectedTopicIds,
    setSelectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    showOGTagViewContainer,
    addReel,
    tempReel,
    tempReelThumbnail,
    addThumbnailReel,
    removeThumbnailReel,
    removeAddReel,
    closeOGTagContainer,
    createPostComponentClickCustomCallback:
      createPostComponentClickCustomCallback
        ? createPostComponentClickCustomCallback.bind(
            null,
            postCreationActionAndDataStore,
          )
        : undefined,
    openCreatePollDialog,
    setOpenCreatePollDialog: (value: boolean) => {
      if (!postCreationStarted) {
        setOpenCreatePollDialog(value);
      }
    },
    pollOptions,
    addPollOption: onAddOptionClicked
      ? onAddOptionClicked.bind(null, postCreationActionAndDataStore)
      : addPollOption,
    removePollOption: onPollOptionCleared
      ? onPollOptionCleared.bind(null, postCreationActionAndDataStore)
      : removePollOption,
    updatePollOption,
    changePollText,
    pollText,
    updatePollExpirationDate,
    pollExpirationDate,
    advancedOptions: advancedPollOptions,
    validatePoll,
    previewPoll,
    setPreviewPoll: onPollCompleteClicked
      ? onPollCompleteClicked.bind(null, postCreationActionAndDataStore)
      : setPreviewPoll,
    updateAdvancedOptions,
    pollExpiryTimeClickFunction: onPollExpiryTimeClicked
      ? onPollExpiryTimeClicked.bind(null, postCreationActionAndDataStore)
      : pollExpiryTimeClickFunction,
  };
}
