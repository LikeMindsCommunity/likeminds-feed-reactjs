import { useCallback, useContext, useRef, useState } from "react";
// import { PostResponse } from "../shared/types/api-responses/postReplyResponse";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  AddCommentRequest,
  EditCommentRequest,
  ReplyCommentRequest,
} from "@likeminds.community/feed-js-beta";
import { extractTextFromNode } from "../shared/utils";
import {
  EditCommentResponse,
  PostCommentResponse,
  PostReplyResponse,
} from "../shared/types/api-responses/postCommentResponse";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { ReplyContext } from "../contexts/LMFeedReplyContext";

export function useLMPostReply(
  postId: string,
  commentId?: string,
): UseLMPostReply {
  const { lmFeedclient, customEventClient, lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { addNewComment, updateReplyOnPostReply } = useContext(FeedPostContext);
  const { updateReply } = useContext(ReplyContext);
  const [text, setText] = useState<string>("");
  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setReplyText = useCallback(function (replyText: string) {
    setText(replyText);
  }, []);
  async function postReply() {
    try {
      const replyText = extractTextFromNode(textFieldRef.current).trim();
      const call: PostReplyResponse = (await lmFeedclient?.replyComment(
        ReplyCommentRequest.builder()
          .setText(replyText)
          .setPostId(postId)
          .setCommentId(commentId || "")
          .build(),
      )) as never;
      if (call.success) {
        if (updateReplyOnPostReply) {
          updateReplyOnPostReply(call.data.comment.parentComment?.Id || "");
        }
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.REPLY_POSTED,
          {
            comment: call.data.comment,
            users: call.data.users,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function postComment() {
    try {
      const commentText = extractTextFromNode(textFieldRef.current).trim();
      const call: PostCommentResponse = (await lmFeedclient?.addComment(
        AddCommentRequest.builder()
          .settext(commentText)
          .setpostId(postId)
          .build(),
      )) as never;
      if (call.success && addNewComment) {
        lmfeedAnalyticsClient?.sendCommentPostedEvent(
          postId,
          call.data.comment.Id,
        );
        addNewComment(call.data.comment, call.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function editComment() {
    try {
      const commentText = extractTextFromNode(textFieldRef.current).trim();
      const call: EditCommentResponse = (await lmFeedclient?.editComment(
        EditCommentRequest.builder()
          .setcommentId(commentId || "")
          .setpostId(postId)
          .settext(commentText)
          .build(),
      )) as never;

      if (call.success && updateReply) {
        lmfeedAnalyticsClient?.sendCommentEditedEvent();
        updateReply(call.data.comment, call.data.users);
      }
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
    editComment,
  };
}
interface UseLMPostReply {
  replyText: string;
  setReplyText: (text: string) => void;
  textFieldRef: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  postReply: () => void;
  postComment: () => void;
  editComment: () => void;
}
