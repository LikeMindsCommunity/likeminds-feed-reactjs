import { MutableRefObject, useContext, useRef, useState } from "react";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import { extractTextFromNode } from "../shared/utils";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  AddPostRequest,
  Attachment,
  AttachmentMeta,
} from "@likeminds.community/feed-js-beta";
import { UploadMediaModel } from "../shared/types/models/uploadMedia";
import { HelperFunctionsClass } from "../shared/helper";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

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
}
export function useCreatePost(): UseCreatePost {
  // Getting context values
  const { lmFeedclient } = useContext(LMFeedGlobalClientProviderContext);
  const { currentUser } = useContext(LMFeedUserProviderContext);
  // declating state variables
  const [text, setText] = useState<string>("");
  const [mediaList, setMediaList] = useState<File[]>([]);
  const [mediaUploadMode, setMediaUploadMode] =
    useState<LMFeedCreatePostMediaUploadMode>(
      LMFeedCreatePostMediaUploadMode.NULL,
    );

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
  // async function post(){
  //   try {

  //   } catch (error) {

  //   }
  // }
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
            attachmentResponseArray.push(
              // Attachment.builder()
              //   .setAttachmentType(2)
              //   .setAttachmentMeta(
              //     AttachmentMeta.builder()
              //       .seturl(resp.Location)
              //       .setformat(file?.name?.split('.').slice(-1).toString())
              //       .setsize(file.size)
              //       .setname(file.name)
              //       .setduration(10)
              //       .build()
              //   )
              //   .build()
              Attachment.builder()
                .setAttachmentType(4)
                .setAttachmentMeta(
                  AttachmentMeta.builder().setogTags({}).build(),
                )
                .build(),
            );
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
          // .setTopicIds()
          .setTempId(Date.now().toString())
          .build(),
      );
      console.log(call);
      // feedModerationHandler(ADD_NEW_POST, null, {
      //   topics: topics,
      //   post: response?.data?.post
      // });
    } catch (error) {
      console.log(error);
    }
  };
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
  };
}
