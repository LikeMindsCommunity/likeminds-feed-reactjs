import { useContext, useRef, useState } from "react";
// import { PostResponse } from "../shared/types/api-responses/postReplyResponse";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  AddCommentRequest,
  ReplyCommentRequest,
} from "@likeminds.community/feed-js-beta";
import { extractTextFromNode } from "../shared/utils";

export function useLMPostReply(
  postId: string,
  commentId?: string,
): UseLMPostReply {
  const { lmFeedclient } = useContext(LMFeedGlobalClientProviderContext);

  const [text, setText] = useState<string>("");
  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  function setReplyText(replyText: string) {
    setText(replyText);
  }
  async function postReply() {
    try {
      const replyText = extractTextFromNode(textFieldRef.current).trim();
      const call = await lmFeedclient?.replyComment(
        ReplyCommentRequest.builder()
          .setText(replyText)
          .setPostId(postId)
          .setCommentId(commentId || "")
          .build(),
      );
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  }
  async function postComment() {
    try {
      const commentText = extractTextFromNode(textFieldRef.current).trim();
      const call = await lmFeedclient?.addComment(
        AddCommentRequest.builder()
          .settext(commentText)
          .setpostId(postId)
          .build(),
      );
      console.log(call);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    replyText: text,
    setReplyText,
    textFieldRef,
    containerRef,
    postReply,
    postComment,
  };
}
interface UseLMPostReply {
  replyText: string;
  setReplyText: (text: string) => void;
  textFieldRef: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  postReply: () => void;
  postComment: () => void;
}
