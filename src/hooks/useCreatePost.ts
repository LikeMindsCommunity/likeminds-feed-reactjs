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
  AttachmentMeta,
  DecodeURLRequest,
  EditPostRequest,
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
}
export function useCreatePost(): UseCreatePost {
  // Getting context values

  const { lmFeedclient, customEventClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );
  const { displaySnackbarMessage, closeSnackbar, showSnackbar, message } =
    useContext(GeneralContext);
  const { PostCreationCustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
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
    console.log(mediaCopy);
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
    async function () {
      try {
        setOpenCreatePostDialog(false);
        const textContent: string = extractTextFromNode(
          textFieldRef.current,
        ).trim();
        const attachmentResponseArray: Attachment[] = [];
        for (let index = 0; index < mediaList.length; index++) {
          const file: File = mediaList[index];
          const resp: UploadMediaModel = await HelperFunctionsClass.uploadMedia(
            file,
            currentUser?.uuid,
          );
          const attachmentType = file.type.includes("image")
            ? 1
            : file.type.includes("video")
              ? 2
              : file.type.includes("pdf")
                ? 3
                : 4;
          switch (attachmentType) {
            case 1: {
              attachmentResponseArray.push(
                Attachment.builder()
                  .setAttachmentType(1)
                  .setAttachmentMeta(
                    AttachmentMeta.builder()
                      .seturl(resp.Location)
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
                Attachment.builder()
                  .setAttachmentType(2)
                  .setAttachmentMeta(
                    AttachmentMeta.builder()
                      .seturl(resp.Location)
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
            // case 4: {
            //   if (!mediaList.length) {
            //     attachmentResponseArray.push(
            //       Attachment.builder()
            //         .setAttachmentType(4)
            //         .setAttachmentMeta(
            //           AttachmentMeta.builder().setogTags(ogTag).build(),
            //         )
            //         .build(),
            //     );
            //   }
            //   break;
            // }
            case 3: {
              attachmentResponseArray.push(
                Attachment.builder()
                  .setAttachmentType(3)
                  .setAttachmentMeta(
                    AttachmentMeta.builder()
                      .seturl(resp.Location)
                      .setformat(file?.name?.split(".").slice(-1).toString())
                      .setsize(file.size)
                      .setname(file.name)
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
            Attachment.builder()
              .setAttachmentType(4)
              .setAttachmentMeta(
                AttachmentMeta.builder().setogTags(ogTag).build(),
              )
              .build(),
          );
        }
        const call: AddPostResponse = await lmFeedclient?.addPost(
          AddPostRequest.builder()
            .setAttachments(attachmentResponseArray)
            .setText(textContent)
            .setTopicIds(selectedTopicIds)
            .setTempId(Date.now().toString())
            .build(),
        );
        if (call.success) {
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.POST_CREATED,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      currentUser?.uuid,
      customEventClient,
      lmFeedclient,
      mediaList,
      ogTag,
      selectedTopicIds,
    ],
  );

  const editPost = useCallback(
    async function () {
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
                attachment.attachmentType === 3,
            )
          ) {
            console.log(attachmentResponseArray);
            attachmentResponseArray.pop();
            attachmentResponseArray.push(
              Attachment.builder()
                .setAttachmentType(4)
                .setAttachmentMeta(
                  AttachmentMeta.builder().setogTags(ogTag).build(),
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
        const call: EditPostResponse = (await lmFeedclient?.editPost(
          EditPostRequest.builder()
            .setattachments(attachmentResponseArray)
            .settext(textContent)
            .setTopicIds(selectedTopicIds)
            .setpostId(temporaryPost?.Id || "")
            .build(),
        )) as never;
        if (call.success) {
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
      ogTag,
      selectedTopicIds,
      temporaryPost?.Id,
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
              await lmFeedclient?.decodeURL(
                DecodeURLRequest.builder().setURL(firstLinkDetected).build(),
              );
            if (getOgTagData?.success) {
              setOgtag(getOgTagData.data.og_tags);
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
          console.log(ogTagAttchmentObject[0].attachmentMeta.ogTags);
          setOgtag(ogTagAttchmentObject[0].attachmentMeta.ogTags);
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
  };
}
