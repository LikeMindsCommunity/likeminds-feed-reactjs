import { useState } from "react";

interface UseCreatePost {
  postText: string;
  setPostText: (text: string) => void;
  mediaList: File[];
  addMediaItem: (media: File) => void;
  removeMedia: (index: number) => void;
  clearMedia: () => void;
}
export function useCreatePost(): UseCreatePost {
  const [text, setText] = useState<string>("");
  const [mediaList, setMediaList] = useState<File[]>([]);
  function setPostText(txt: string) {
    setText(txt);
  }
  function addMediaItem(media: File) {
    const mediaCopy = [...mediaList];
    mediaCopy.push(media);
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
  return {
    postText: text,
    mediaList,
    setPostText,
    addMediaItem,
    removeMedia,
    clearMedia,
  };
}
