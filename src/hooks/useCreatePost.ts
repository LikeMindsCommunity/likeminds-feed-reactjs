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
} from "@likeminds.community/feed-js-beta";
import { UploadMediaModel } from "../shared/types/models/uploadMedia";
import { HelperFunctionsClass } from "../shared/helper";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { OgTag } from "../shared/types/models/ogTag";
import { GetOgTagResponse } from "../shared/types/api-responses/getOgTagResponse";
import { Post } from "../shared/types/models/post";

interface UseCreatePost {
  postText: string;
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
  ogTag: OgTag | null;
  openCreatePostDialog: boolean;
  setOpenCreatePostDialog: React.Dispatch<boolean>;
  temporaryPost: Post | null;
  selectedTopicIds: string[];
  setSelectedTopicIds: React.Dispatch<string[]>;
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

  const [text, setText] = useState<string>("");
  const [temporaryPost, setTemporaryPost] = useState<Post | null>(null);
  const [mediaList, setMediaList] = useState<File[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
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
          case 4: {
            if (!mediaList.length) {
              attachmentResponseArray.push(
                Attachment.builder()
                  .setAttachmentType(4)
                  .setAttachmentMeta(
                    AttachmentMeta.builder().setogTags(ogTag).build(),
                  )
                  .build(),
              );
            }
            break;
          }
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

  // const editPost = async function () {
  //   // try {
  //   // } catch (error) {
  //   // }
  // };

  useEffect(() => {
    const checkForLinksTimeout = setTimeout(async () => {
      try {
        const linksDetected = HelperFunctionsClass.detectLinks(text);
        if (linksDetected.length) {
          const firstLinkDetected = linksDetected[0];
          console.log(firstLinkDetected !== ogTag?.url);
          if (firstLinkDetected.toString() !== ogTag?.url.toString()) {
            const getOgTagData: GetOgTagResponse =
              await lmFeedclient?.decodeURL(
                DecodeURLRequest.builder().setURL(firstLinkDetected).build(),
              );
            if (getOgTagData.success) {
              console.log(getOgTagData);
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
  }, [lmFeedclient, ogTag, text]);
  useEffect(() => {
    customEventClient?.listen("OPEN_MENU", (event: Event) => {
      setOpenCreatePostDialog(true);
      const details = (event as CustomEvent).detail;
      setTemporaryPost(details.post);
      setSelectedTopicIds(details.post.topics);
    });
    return () => {
      customEventClient?.remove("OPEN_MENU");
    };
  }, [customEventClient]);
  useEffect(() => {
    if (!setOpenCreatePostDialog) {
      setTemporaryPost(null);
      setSelectedTopicIds([]);
    }
  }, [setOpenCreatePostDialog]);
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
    ogTag,
    openCreatePostDialog,
    setOpenCreatePostDialog,
    temporaryPost,
    selectedTopicIds,
    setSelectedTopicIds,
  };
}
