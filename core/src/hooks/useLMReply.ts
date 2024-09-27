import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../shared/types/models/member";
import { Reply } from "../shared/types/models/replies";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetCommentDetailsResponse } from "../shared/types/api-responses/getCommentDetailsResponse";
import { GetCommentRequest } from "@likeminds.community/feed-js-beta";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import {
  DeleteCommentRequest,
  LikeCommentRequest,
} from "@likeminds.community/feed-js-beta";
import { DeleteCommentResponse } from "../shared/types/api-responses/deletePostResponse";
import { LikeCommentResponse } from "../shared/types/api-responses/likeCommentResponse";
import { RepliesActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

import { Post } from "../shared/types/models/post";

interface UseReplyInterface {
  reply: Reply | null;
  users: Record<string, User>;
  loadMoreReplies: boolean;
  getNextPage: () => Promise<void>;
  replies: Reply[];
  deleteReply: (id: string) => Promise<void>;
  likeReply: (id: string) => Promise<void>;
  updateReply: (comment: Reply, usersMap: Record<string, User>) => void;
}

export const useReply: (
  postId: string,
  replyId: string,
  post: Post | null,
) => UseReplyInterface = (
  postId: string,
  replyId: string,
  post: Post | null,
) => {
  // to get the instance of the client from the client context
  const { lmFeedclient, customEventClient, lmfeedAnalyticsClient } = useContext(
    GlobalClientProviderContext,
  );
  const { displaySnackbarMessage, message, showSnackbar, closeSnackbar } =
    useContext(GeneralContext);
  const { RepliesCustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
  const { likeReplyCustomAction, deleteReplyCustomAction } =
    RepliesCustomCallbacks;
  const { currentUser, currentCommunity, logoutUser } = useContext(
    LMFeedUserProviderContext,
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
            .setPostId(postId)
            .setCommentId(replyId)
            .setPage(1)
            .setPageSize(10)
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
            .setPostId(postId)
            .setCommentId(replyId)
            .setPage(pageCount)
            .setPageSize(10)
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
  const deleteReply = useCallback(
    async function (id: string) {
      try {
        const call: DeleteCommentResponse = (await lmFeedclient?.deleteComment(
          DeleteCommentRequest.builder()
            .setCommentId(id)
            .setPostId(postId)
            .build(),
        )) as never;
        if (call.success) {
          if (post) {
            lmfeedAnalyticsClient?.sendReplyDeletedEvent(post, reply!, id);
          }
          const repliesCopy = [...replies].filter((reply) => reply?.id !== id);
          const replyCopy = { ...reply };
          if (replyCopy && replyCopy.commentsCount) {
            replyCopy.commentsCount--;
          }
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.REPLY_DELETED,
            {
              replyId: replyId,
            },
          );
          setReply(replyCopy as Reply);
          setReplies(repliesCopy);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      customEventClient,
      lmFeedclient,
      lmfeedAnalyticsClient,
      post,
      postId,
      replies,
      reply,
      replyId,
    ],
  );
  const likeReply = useCallback(
    async function (id: string) {
      try {
        const call: LikeCommentResponse = (await lmFeedclient?.likeComment(
          LikeCommentRequest.builder()
            .setPostId(postId)
            .setCommentId(id)
            .build(),
        )) as never;
        if (call.success) {
          const repliesCopy = [...replies].map((reply) => {
            if (reply?.id === id) {
              if (reply.isLiked) {
                reply.isLiked = false;
                reply.likesCount--;
              } else {
                reply.isLiked = true;
                reply.likesCount++;
              }
            }
            return reply;
          });
          setReplies(repliesCopy);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedclient, postId, replies],
  );
  const updateReply = useCallback(
    function (comment: Reply, usersMap: Record<string, User>) {
      const repliesCopy = [...replies].map((reply) =>
        reply?.id === comment.id ? comment : reply,
      );
      const usersCopy = { ...users, ...usersMap };
      setReplies(repliesCopy);
      setUser(usersCopy);
    },
    [replies, users],
  );

  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.REPLY_POSTED,
      (e: Event) => {
        const comment: Reply = (e as CustomEvent).detail.comment;
        const userMap: Record<string, User> = (e as CustomEvent).detail.users;
        if (comment.parentComment?.id === replyId) {
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
  const repliesActionAndDataStore: RepliesActionsAndDataStore = useMemo(() => {
    return {
      repliesDataStore: {
        reply,
        setReply,
        pageCount,
        setPageCount,
        loadMoreReplies,
        setLoadMoreReplies,
        replies,
        setReplies,
        users,
        setUser,
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
        updateReply,
        likeReply,
        deleteReply,
      },
    };
  }, [
    closeSnackbar,
    currentCommunity,
    currentUser,
    deleteReply,
    displaySnackbarMessage,
    likeReply,
    loadMoreReplies,
    logoutUser,
    message,
    pageCount,
    replies,
    reply,
    showSnackbar,
    updateReply,
    users,
  ]);

  useEffect(() => {
    loadReply();
  }, [loadReply, postId, replyId]);
  return {
    reply,
    users,
    loadMoreReplies,
    getNextPage,
    replies,
    deleteReply: deleteReplyCustomAction
      ? deleteReplyCustomAction.bind(null, repliesActionAndDataStore)
      : deleteReply,
    likeReply: likeReplyCustomAction
      ? likeReplyCustomAction.bind(null, repliesActionAndDataStore)
      : likeReply,
    updateReply,
  };
};
