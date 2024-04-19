import { useCallback, useContext, useEffect, useState } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { GetUniversalFeedResponse } from "../shared/types/api-responses/getUniversalFeed";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetFeedRequest } from "@likeminds.community/feed-js";
import { Topic } from "../shared/types/models/topic";
import {
  DeletePostRequest,
  LikePostRequest,
  // GetReportTagsRequest,
  PinPostRequest,
  // PostReportRequest,
} from "@likeminds.community/feed-js-beta";
import { GetPinPostResponse } from "../shared/types/api-responses/getPinPostResponse";
import { DeletePostResponse } from "../shared/types/api-responses/deletePostResponse";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import { LikePostResponse } from "../shared/types/api-responses/likePostResponse";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { LMFeedPostMenuItems } from "../shared/constants/lmFeedPostMenuItems";

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
  likePost: (id: string) => Promise<void>;
}

export function useFetchFeeds(topicId?: string): useFetchFeedsResponse {
  const { lmFeedclient, customEventClient } = useContext(
    GlobalClientProviderContext,
  );
  const { displaySnackbarMessage } = useContext(GeneralContext);
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
    [lmFeedclient, topicId, selectedTopics],
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
        const feedListCopy = [...feedList];
        const index = feedListCopy.findIndex((feed) => feed.Id === id);
        feedListCopy.splice(index, 1);
        setFeedList(feedListCopy);
        if (displaySnackbarMessage)
          displaySnackbarMessage(LMDisplayMessages.POST_DELETED_SUCCESSFULLY);
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
        const feedListCopy = [...feedList];
        const index = feedListCopy.findIndex((feed) => feed.Id === id);
        const tempPost = feedListCopy[index];
        if (tempPost.isPinned) {
          tempPost.isPinned = false;
          tempPost.menuItems = tempPost.menuItems.map((menuItem) => {
            if (menuItem.id.toString() === LMFeedPostMenuItems.UNPIN_POST) {
              return {
                id: parseInt(LMFeedPostMenuItems.PIN_POST),
                title: "Pin Post",
              };
            } else {
              return menuItem;
            }
          });
        } else {
          tempPost.isPinned = true;
          tempPost.menuItems = tempPost.menuItems.map((menuItem) => {
            if (menuItem.id.toString() === LMFeedPostMenuItems.PIN_POST) {
              return {
                id: parseInt(LMFeedPostMenuItems.UNPIN_POST),
                title: "Unpin This Post",
              };
            } else {
              return menuItem;
            }
          });
        }

        // feedListCopy.splice(index, 1);
        console.log(tempPost);
        setFeedList(feedListCopy);
        if (displaySnackbarMessage) {
          if (tempPost.isPinned) {
            displaySnackbarMessage(LMDisplayMessages.POST_PINNED_SUCCESS);
          } else {
            displaySnackbarMessage(LMDisplayMessages.PIN_REMOVED_SUCCESS);
          }
        }
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
        const feedListCopy = [...feedList];
        const index = feedListCopy.findIndex((feed) => feed.Id === id);
        feedListCopy[index].isLiked = !feedListCopy[index].isLiked;
        if (feedListCopy[index].isLiked) {
          feedListCopy[index].likesCount++;
        } else {
          feedListCopy[index].likesCount--;
        }
        setFeedList(feedListCopy);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    customEventClient?.listen(LMFeedCustomActionEvents.POST_CREATED, () => {
      loadFeed();
      if (displaySnackbarMessage) {
        displaySnackbarMessage(LMDisplayMessages.POST_CREATED_SUCCESS);
      }
    });
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.POST_CREATED);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.POST_EDITED,
      (e: Event) => {
        const detail = (e as CustomEvent).detail;
        const { post, usersMap, topicsMap } = detail;
        const feedListCopy = [...feedList].map((feed) => {
          if (feed.Id === post.Id) {
            return post;
          } else {
            return feed;
          }
        });
        const feedUsersCopy = { ...feedUsersList, ...usersMap };
        const topicsCopy = { ...topics, ...topicsMap };
        setFeedList(feedListCopy);
        setTopics(topicsCopy);
        setFeedUsersList(feedUsersCopy);
        if (displaySnackbarMessage) {
          displaySnackbarMessage(LMDisplayMessages.POST_EDIT_SUCCESS);
        }
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.POST_EDITED);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.LIKE_POST_CALLED,
      (e: Event) => {
        const id = (e as CustomEvent).detail.postId;
        const feedListCopy = [...feedList].map((post) => {
          if (post.Id === id) {
            if (post.isLiked) {
              post.isLiked = false;
              post.likesCount--;
            } else {
              post.isLiked = true;
              post.likesCount++;
            }
          }
          return post;
        });
        setFeedList(feedListCopy);
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.LIKE_POST_CALLED);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.COMMENT_ADDED,
      (e: Event) => {
        const id = (e as CustomEvent).detail.postId;
        const feedListCopy = [...feedList].map((post) => {
          if (post.Id === id) {
            console.log(post);
            post.commentsCount++;
            console.log(post);
          }

          return post;
        });
        setFeedList(feedListCopy);
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.COMMENT_ADDED);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.COMMENT_REMOVED,
      (e: Event) => {
        const id = (e as CustomEvent).detail.postId;
        const feedListCopy = [...feedList].map((post) => {
          if (post.Id === id) {
            console.log(post);
            post.commentsCount--;
            console.log(post);
          }

          return post;
        });
        setFeedList(feedListCopy);
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.COMMENT_REMOVED);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.PINNED_ON_DETAIL,
      (e: Event) => {
        const id = (e as CustomEvent).detail.id;
        const feedListCopy = [...feedList].map((post) => {
          if (post.Id === id) {
            post.menuItems = post.menuItems.map((menuItem) => {
              if (menuItem.id.toString() === LMFeedPostMenuItems.PIN_POST) {
                menuItem.id = parseInt(LMFeedPostMenuItems.UNPIN_POST);
                menuItem.title = "Unpin This Post";
              }
              return menuItem;
            });
            post.isPinned = !post.isPinned;
          }

          return post;
        });
        setFeedList(feedListCopy);
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.PINNED_ON_DETAIL);
  });
  useEffect(() => {
    customEventClient?.listen(
      LMFeedCustomActionEvents.DELETE_POST_ON_DETAILS,
      async (e: Event) => {
        const id = (e as CustomEvent).detail.postId;

        await deletePost(id);
        window.history.back();
      },
    );

    return () =>
      customEventClient?.remove(
        LMFeedCustomActionEvents.DELETE_POST_ON_DETAILS,
      );
  });
  //  Effect to run when selectedTopics changes or during the initial loading of the page
  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

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
    likePost,
  };
}
