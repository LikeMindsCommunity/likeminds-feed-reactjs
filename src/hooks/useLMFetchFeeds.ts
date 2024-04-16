import { useCallback, useContext, useEffect, useState } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { GetUniversalFeedResponse } from "../shared/types/api-responses/getUniversalFeed";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetFeedRequest } from "@likeminds.community/feed-js";
import { Topic } from "../shared/types/models/topic";
import {
  DeletePostRequest,
  // GetReportTagsRequest,
  PinPostRequest,
  // PostReportRequest,
} from "@likeminds.community/feed-js-beta";
import { GetPinPostResponse } from "../shared/types/api-responses/getPinPostResponse";
import { DeletePostResponse } from "../shared/types/api-responses/deletePostResponse";
// import { GetPinPostResponse } from "../shared/types/api-responses/getPinPostResponse";

interface useFetchFeedsResponse {
  topics: Record<string, Topic>;
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<string[]>;
  loadMoreFeeds: boolean;
  getNextPage: () => Promise<void>;
  feedList: Post[];
  feedUsersList: Record<string, User>;
  deletePost: (id: string) => Promise<void>;
  pinPost: (id: string) => Promise<void>;
}

export function useFetchFeeds(topicId?: string): useFetchFeedsResponse {
  const { lmFeedclient } = useContext(GlobalClientProviderContext);
  // to maintain the list of selected topics for rendering posts
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // to maintain the list of selected topics for rendering posts
  const [topics, setTopics] = useState<Record<string, Topic>>({});

  // to detect whether we should load more posts || it will turn false if we reached the end of pagination with the current set of topics.
  const [loadMoreFeeds, setLoadMoreFeeds] = useState<boolean>(true);

  // to maintain the page count of current feeds || it will reset to one whenever the topics are changed
  const [currentPageCount, setCurrentPageCount] = useState<number>(1);

  //   to maintain the list of feeds || it will reset to [] whenever the topics are changed
  const [feedList, setFeedList] = useState<Post[]>([]);

  //   to maintain the map of users for the feedlist
  const [feedUsersList, setFeedUsersList] = useState<Record<string, User>>({});

  //   function to load the first page of the feed
  const loadFeed = useCallback(
    async function () {
      try {
        const fetchFeedsCall: GetUniversalFeedResponse =
          (await lmFeedclient?.getFeed(
            GetFeedRequest.builder()
              .setTopicIds(topicId ? [topicId] : selectedTopics)
              .setpage(1)
              .setpageSize(10)
              .build(),
          )) as never;
        if (fetchFeedsCall.success) {
          setCurrentPageCount(2);
          setFeedList([...fetchFeedsCall.data.posts]);
          setFeedUsersList({ ...fetchFeedsCall.data.users });
          setTopics({ ...fetchFeedsCall.data.topics });
        }
        if (!fetchFeedsCall.data.posts.length) {
          setLoadMoreFeeds(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [selectedTopics, lmFeedclient, topicId],
  );

  //   function to load the next page for the current selected topics
  async function getNextPage() {
    try {
      const fetchFeedsCall: GetUniversalFeedResponse =
        (await lmFeedclient?.getFeed(
          GetFeedRequest.builder()
            .setTopicIds(selectedTopics)
            .setpage(currentPageCount)
            .setpageSize(10)
            .build(),
        )) as never;
      if (fetchFeedsCall.success) {
        setCurrentPageCount((oldPageCount: number) => oldPageCount + 1);
        setFeedList([...feedList, ...fetchFeedsCall.data.posts]);
        setFeedUsersList({ ...feedUsersList, ...fetchFeedsCall.data.users });
        setTopics({ ...topics, ...fetchFeedsCall.data.topics });
      }
      if (!fetchFeedsCall.data.posts.length) {
        setLoadMoreFeeds(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // function to delete a post
  async function deletePost(id: string) {
    try {
      const call: DeletePostResponse = (await lmFeedclient?.deletePost(
        DeletePostRequest.builder().setpostId(id).build(),
      )) as never;
      if (call.success) {
        // TODO delete call action
      }
    } catch (error) {
      console.log(error);
    }
  }
  // function to pin a post
  async function pinPost(id: string) {
    try {
      const call: GetPinPostResponse = (await lmFeedclient?.pinPost(
        PinPostRequest.builder().setpostId(id).build(),
      )) as never;
      if (call.success) {
        // TODO pin post actions
      }
    } catch (error) {
      console.log(error);
    }
  }

  // function to pin a post
  // async function reportPost(id: string) {
  //   try {
  //     const tagsCall = await lmFeedclient?.getReportTags(
  //       GetReportTagsRequest.builder().settype().build(),
  //     );
  //     console.log(tagsCall);
  //     const call = await lmFeedclient?.postReport(
  //       PostReportRequest.builder()
  //         .setEntityId()
  //         .setEntityType()
  //         .setReason()
  //         .setTagId()
  //         .setUuid()
  //         .build(),
  //     );
  //     ;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //  Effect to run when selectedTopics changes or during the initial loading of the page
  useEffect(() => {
    loadFeed();
  }, [selectedTopics, loadFeed]);

  return {
    topics,
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds,
    feedList,
    feedUsersList,
    getNextPage,
    deletePost,
    pinPost,
  };
}
