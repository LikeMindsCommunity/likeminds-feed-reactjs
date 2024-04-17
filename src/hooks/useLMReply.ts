import { useCallback, useContext, useEffect, useState } from "react";
import { User } from "../shared/types/models/member";
import { Reply } from "../shared/types/models/replies";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetCommentDetailsResponse } from "../shared/types/api-responses/getCommentDetailsResponse";
import { GetCommentRequest } from "@likeminds.community/feed-js";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";

interface UseReplyInterface {
  reply: Reply | null;
  users: Record<string, User>;
  loadMoreReplies: boolean;
  getNextPage: () => Promise<void>;
  replies: Reply[];
}

export const useReply: (
  postId: string,
  replyId: string,
) => UseReplyInterface = (postId: string, replyId: string) => {
  // to get the instance of the client from the client context
  const { lmFeedclient, customEventClient } = useContext(
    GlobalClientProviderContext,
  );

  // to store the reply
  const [reply, setReply] = useState<Reply | null>(null);

  // to strore the page count
  const [pageCount, setPageCount] = useState<number>(1);

  // to indecate whether should we load new Replies
  const [loadMoreReplies, setLoadMoreReplies] = useState<boolean>(true);

  // to store the list of replies
  const [replies, setReplies] = useState<Reply[]>([]);

  // to store the list of users
  const [users, setUser] = useState<Record<string, User>>({});

  // function to get the reply
  const loadReply: () => Promise<void> = useCallback(async () => {
    try {
      const getCommentDetailsCall: GetCommentDetailsResponse =
        (await lmFeedclient?.getComments(
          postId,
          GetCommentRequest.builder()
            .setpostId(postId)
            .setcommentId(replyId)
            .setpage(1)
            .setpageSize(10)
            .build(),
          replyId,
          1,
        )) as never;
      if (getCommentDetailsCall.success) {
        setReply({ ...getCommentDetailsCall.data.comment });
        setUser({ ...getCommentDetailsCall.data.users });
        setPageCount(2);
        setReplies([...getCommentDetailsCall.data.comment.replies]);
        if (!getCommentDetailsCall.data.comment.replies.length) {
          setLoadMoreReplies(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmFeedclient, postId, replyId]);

  // function to load the next page of replies
  const getNextPage: () => Promise<void> = async () => {
    try {
      const getCommentDetailsCall: GetCommentDetailsResponse =
        (await lmFeedclient?.getComments(
          postId,
          GetCommentRequest.builder()
            .setpostId(postId)
            .setcommentId(replyId)
            .setpage(pageCount)
            .setpageSize(10)
            .build(),
          replyId,
          pageCount,
        )) as never;
      if (getCommentDetailsCall.success) {
        setUser({ ...users, ...getCommentDetailsCall.data.users });
        setPageCount((oldPageCount) => oldPageCount + 1);
        setReplies([...replies, ...getCommentDetailsCall.data.comment.replies]);
        if (!getCommentDetailsCall.data.comment.replies.length) {
          setLoadMoreReplies(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.REPLY_POSTED,
      (e: Event) => {
        const comment: Reply = (e as CustomEvent).detail.comment;
        const userMap: Record<string, User> = (e as CustomEvent).detail.users;
        if (comment.parentComment?.Id === replyId) {
          const repliesCopy = [comment, ...replies];
          const usersCopy = { ...users, ...userMap };
          setReplies(repliesCopy);
          setUser(usersCopy);
        }
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.REPLY_POSTED);
  });
  useEffect(() => {
    loadReply();
  }, [loadReply, postId, replyId]);
  return {
    reply,
    users,
    loadMoreReplies,
    getNextPage,
    replies,
  };
};
