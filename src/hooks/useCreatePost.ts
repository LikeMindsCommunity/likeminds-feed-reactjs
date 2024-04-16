import {
  MutableRefObject,
  useContext,
  useEffect,
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
  const { currentUser } = useContext(LMFeedUserProviderContext);
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
    console.log(text?.length);
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
  const postFeed = async function () {
    try {
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
      const call = await lmFeedclient?.addPost(
        AddPostRequest.builder()
          .setAttachments(attachmentResponseArray)
          .setText(textContent)
          .setTopicIds(selectedTopicIds)
          .setTempId(Date.now().toString())
          .build(),
      );
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };

  const editPost = async function () {
    try {
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
      const call = await lmFeedclient?.editPost(
        EditPostRequest.builder()
          .setattachments(attachmentResponseArray)
          .settext(textContent)
          .setTopicIds(selectedTopicIds)
          .setpostId(temporaryPost?.Id || "")
          .build(),
      );
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  };

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
            if (getOgTagData.success) {
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
    console.log(text);
  }, [text]);
  useEffect(() => {
    customEventClient?.listen("OPEN_MENU", (event: Event) => {
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
    });
    return () => {
      customEventClient?.remove("OPEN_MENU");
    };
  }, [customEventClient]);
  useEffect(() => {
    if (!openCreatePostDialog) {
      resetStates();
    }
  }, [openCreatePostDialog]);
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
    postFeed,
    editPost,
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
