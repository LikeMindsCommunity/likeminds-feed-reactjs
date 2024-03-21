import { useCallback, useContext, useEffect, useState } from "react";
import { User } from "../shared/types/models/member";
import { Post } from "../shared/types/models/post";
import { Reply } from "../shared/types/models/replies";
import { GetPostDetailsResponse } from "../shared/types/api-responses/getPostDetailsResponse";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetPostRequest } from "@likeminds.community/feed-js";
import { Topic } from "../shared/types/models/topic";

interface UseFeedDetailsInterface {
  post: Post | null;
  users: Record<string, User>;
  getNextPage: () => Promise<void>;
  loadNextPage: boolean;
  replies: Reply[];
  topics: Record<string, Topic>;
}

export const useFeedDetails: (id: string) => UseFeedDetailsInterface = (
  postId: string,
) => {
  const { lmFeedclient } = useContext(GlobalClientProviderContext);

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
  };
};
