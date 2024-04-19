import { useCallback, useContext, useEffect, useState } from "react";
import { User } from "../shared/types/models/member";
import { Post } from "../shared/types/models/post";
import { Reply } from "../shared/types/models/replies";
import { GetPostDetailsResponse } from "../shared/types/api-responses/getPostDetailsResponse";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetPostRequest } from "@likeminds.community/feed-js";
import { Topic } from "../shared/types/models/topic";
import { DeleteCommentResponse } from "../shared/types/api-responses/deletePostResponse";
import {
  DeleteCommentRequest,
  LikeCommentRequest,
  LikePostRequest,
  PinPostRequest,
} from "@likeminds.community/feed-js-beta";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import { LikeCommentResponse } from "../shared/types/api-responses/likeCommentResponse";
import { LikePostResponse } from "../shared/types/api-responses/likePostResponse";
import { GetPinPostResponse } from "../shared/types/api-responses/getPinPostResponse";
// import { DeletePostResponse } from "../shared/types/api-responses/deletePostResponse";
// import { DeletePostRequest } from "@likeminds.community/feed-js-beta";
// import { GeneralContext } from "../contexts/LMFeedGeneralContext";
// import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";

interface UseFeedDetailsInterface {
  post: Post | null;
  users: Record<string, User>;
  getNextPage: () => Promise<void>;
  loadNextPage: boolean;
  replies: Reply[];
  topics: Record<string, Topic>;
  addNewComment: (comment: Reply, userMap: Record<string, User>) => void;
  removeAComment: (id: string) => void;
  updateReplyOnPostReply: (id: string) => void;
  updateReply: (comment: Reply, usersMap: Record<string, User>) => void;
  likeReply: (id: string) => void;
  likePost: (id: string) => void;
  pinPost: (id: string) => Promise<void>;
}

export const useFeedDetails: (id: string) => UseFeedDetailsInterface = (
  postId: string,
) => {
  const { lmFeedclient, customEventClient } = useContext(
    GlobalClientProviderContext,
  );
  const { displaySnackbarMessage } = useContext(GeneralContext);

  // state for storing the post
  const [post, setPost] = useState<Post | null>(null);

  // state for storing the record if the users
  const [users, setUsers] = useState<Record<string, User>>({});

  // state for storing replies
  const [replies, setReplies] = useState<Reply[]>([]);

  // state to indicate whether new replies should be loaded
  const [loadNextPage, setLoadNextPage] = useState<boolean>(true);

  //   state to store the topics of post
  const [topics, setTopics] = useState<Record<string, Topic>>({});

  //   state to store page count
  const [pageCount, setPageCount] = useState<number>(1);

  const loadPost = useCallback(async () => {
    try {
      const getPostDetailsCall: GetPostDetailsResponse =
        (await lmFeedclient?.getPost(
          GetPostRequest.builder()
            .setpage(1)
            .setpageSize(20)
            .setpostId(postId)
            .build(),
        )) as never;

      if (getPostDetailsCall.success) {
        setPost({ ...getPostDetailsCall.data.post });
        setReplies([...(getPostDetailsCall.data.post.replies || [])]);
        setUsers({ ...getPostDetailsCall.data.users });
        setTopics({ ...getPostDetailsCall.data.topics });
        setPageCount((currentPage) => currentPage + 1);
        if (!getPostDetailsCall.data.post.replies?.length) {
          setLoadNextPage(false);
        }
      } else {
        if (displaySnackbarMessage) {
          alert(LMDisplayMessages.ERROR_LOADING_POST);
          displaySnackbarMessage(
            getPostDetailsCall?.errorMessage ||
              LMDisplayMessages.ERROR_LOADING_POST,
          );
        }
        window.history.back();
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmFeedclient, postId]);

  //   function to load next page of replies
  const getNextPage = async () => {
    try {
      const getPostDetailsCall: GetPostDetailsResponse =
        (await lmFeedclient?.getPost(
          GetPostRequest.builder()
            .setpage(pageCount)
            .setpageSize(20)
            .setpostId(postId)
            .build(),
        )) as never;
      if (getPostDetailsCall.success) {
        setReplies([
          ...replies,
          ...(getPostDetailsCall.data.post.replies || []),
        ]);
        setUsers({ ...users, ...getPostDetailsCall.data.users });
        setTopics({ ...topics, ...getPostDetailsCall.data.topics });
        setPageCount((currentPage) => currentPage + 1);
        if (!getPostDetailsCall.data.post.replies?.length) {
          setLoadNextPage(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  function updateReplyOnPostReply(replyId: string) {
    const repliesCopy = [...replies];
    const targetReply = repliesCopy.find((reply) => reply.Id === replyId);
    if (targetReply) {
      console.log(targetReply);
      targetReply.commentsCount++;
    }
    setReplies(repliesCopy);
  }

  function addNewComment(comment: Reply, usersMap: Record<string, User>) {
    const repliesCopy = [comment, ...replies];
    const usersCopy = { ...users, ...usersMap };
    const postCopy = { ...post };
    if (postCopy && postCopy?.commentsCount) {
      postCopy.commentsCount++;
      setPost(postCopy as Post);
    }
    setReplies(repliesCopy);
    setUsers(usersCopy);
    if (customEventClient) {
      customEventClient.dispatchEvent(LMFeedCustomActionEvents.COMMENT_ADDED, {
        postId: post?.Id,
      });
    }
  }
  async function removeAComment(id: string) {
    try {
      const call: DeleteCommentResponse = (await lmFeedclient?.deleteComment(
        DeleteCommentRequest.builder()
          .setpostId(post?.Id || "")
          .setcommentId(id)
          .build(),
      )) as never;
      if (call.success) {
        const repliesCopy = [...replies].filter((reply) => reply.Id !== id);

        const postCopy = { ...post };
        if (postCopy && postCopy?.commentsCount) {
          postCopy.commentsCount--;
          setPost(postCopy as Post);
          setReplies(repliesCopy);
          if (displaySnackbarMessage) {
            displaySnackbarMessage(LMDisplayMessages.COMMENT_DELETED_SUCCESS);
          }
        }
        if (customEventClient) {
          customEventClient.dispatchEvent(
            LMFeedCustomActionEvents.COMMENT_REMOVED,
            {
              postId: post?.Id,
            },
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  function updateReply(comment: Reply, usersMap: Record<string, User>) {
    const repliesCopy = [...replies].map((reply) =>
      reply.Id === comment.Id ? comment : reply,
    );
    const usersCopy = { ...users, ...usersMap };
    const postCopy = { ...post };
    if (postCopy && postCopy.isEdited) {
      postCopy.isEdited = true;
      setPost(postCopy as Post);
    }
    setReplies(repliesCopy);
    setUsers(usersCopy);
  }
  async function likeReply(id: string) {
    try {
      const call: LikeCommentResponse = (await lmFeedclient?.likeComment(
        LikeCommentRequest.builder().setpostId(postId).setcommentId(id).build(),
      )) as never;
      if (call.success) {
        const repliesCopy = [...replies].map((reply) => {
          if (reply.Id === id) {
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
  }
  async function likePost(id: string) {
    try {
      const call: LikePostResponse = (await lmFeedclient?.likePost(
        LikePostRequest.builder().setpostId(id).build(),
      )) as never;
      if (call.success) {
        const postCopy = { ...post };
        if (postCopy.isLiked) {
          postCopy.isLiked = false;
          postCopy.likesCount ? postCopy.likesCount-- : null;
        } else {
          postCopy.isLiked = true;
          postCopy.likesCount
            ? postCopy.likesCount++
            : (postCopy.likesCount = 1);
        }
        setPost(postCopy as Post);
        if (customEventClient) {
          customEventClient.dispatchEvent(
            LMFeedCustomActionEvents.LIKE_POST_CALLED,
            {
              postId: id,
            },
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function pinPost(id: string) {
    try {
      const call: GetPinPostResponse = (await lmFeedclient?.pinPost(
        PinPostRequest.builder().setpostId(id).build(),
      )) as never;
      if (call.success) {
        const tempPost = { ...post };

        if (tempPost.isPinned) {
          tempPost.isPinned = false;
        } else {
          tempPost.isPinned = true;
        }
        // feedListCopy.splice(index, 1);

        setPost(tempPost as Post);
        if (customEventClient) {
          customEventClient.dispatchEvent(
            LMFeedCustomActionEvents.PINNED_ON_DETAIL,
            {
              id: postId,
            },
          );
        }
        if (displaySnackbarMessage) {
          if (tempPost.isPinned) {
            displaySnackbarMessage(LMDisplayMessages.PIN_REMOVED_SUCCESS);
          } else {
            displaySnackbarMessage(LMDisplayMessages.POST_PINNED_SUCCESS);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.REPLY_DELETED,
      (e: Event) => {
        const replyId = (e as CustomEvent).detail.replyId;
        const repliesCopy = [...replies];

        const tempReply = repliesCopy.find((reply) => reply.Id === replyId);
        if (tempReply) {
          tempReply.commentsCount--;
        }

        setReplies(repliesCopy);
        if (displaySnackbarMessage)
          displaySnackbarMessage(LMDisplayMessages.REPLY_DELETED_SUCCESS);
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.REPLY_DELETED);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_EDITED_TARGET_DETAILS,
      (e: Event) => {
        const detail = (e as CustomEvent).detail;
        const { post, usersMap, topicsMap } = detail;
        const postCopy = { ...post };
        const feedUsersCopy = { ...users, ...usersMap };
        const topicsCopy = { ...topics, ...topicsMap };
        setPost(postCopy);
        setTopics(topicsCopy);
        setUsers(feedUsersCopy);
        if (displaySnackbarMessage) {
          displaySnackbarMessage(LMDisplayMessages.POST_EDIT_SUCCESS);
        }
      },
    );
    return () =>
      customEventClient?.remove(
        LMFeedCustomActionEvents.POST_EDITED_TARGET_DETAILS,
      );
  });

  useEffect(() => {
    loadPost();
  }, [loadPost, postId]);
  return {
    post,
    users,
    getNextPage,
    replies,
    loadNextPage,
    topics,
    addNewComment,
    removeAComment,
    updateReply,
    updateReplyOnPostReply,
    likeReply,
    likePost,
    pinPost,
  };
};
