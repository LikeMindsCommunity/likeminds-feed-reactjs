/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { GetUniversalFeedResponse } from "../shared/types/api-responses/getUniversalFeed";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetFeedRequest, HidePostRequest } from "@likeminds.community/feed-js";
import { Topic } from "../shared/types/models/topic";
import {
  DeletePostRequest,
  LikePostRequest,
  // GetReportTagsRequest,
  PinPostRequest,
  // PostReportRequest,
} from "@likeminds.community/feed-js";
import { GetPinPostResponse } from "../shared/types/api-responses/getPinPostResponse";
import { DeletePostResponse } from "../shared/types/api-responses/deletePostResponse";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import { LikePostResponse } from "../shared/types/api-responses/likePostResponse";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";
import { LMFeedPostMenuItems } from "../shared/constants/lmFeedPostMenuItems";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedListActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { LMFeedCurrentUserState } from "../shared/enums/lmCurrentUserState";

import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
import { getDisplayMessage } from "../shared/utils";

interface useFetchFeedsResponse {
  topics: Record<string, Topic>;
  widgets: Record<string, any>;
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<string[]>;
  loadMoreFeeds: boolean;
  getNextPage: () => Promise<void>;
  feedList: Post[];
  feedUsersList: Record<string, User>;
  deletePost: (id: string) => Promise<void>;
  pinPost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  hidePost: (postId: string) => Promise<void>;
  postComponentClickCustomCallback?: ComponentDelegatorListener;
}

export function useFetchFeeds(topicId?: string): useFetchFeedsResponse {
  const { lmFeedclient, customEventClient, lmfeedAnalyticsClient } = useContext(
    GlobalClientProviderContext,
  );

  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );
  const { displaySnackbarMessage, closeSnackbar, showSnackbar, message } =
    useContext(GeneralContext);
  const { FeedListCustomActions = {}, postComponentClickCustomCallback } =
    useContext(CustomAgentProviderContext);
  const { deletePostCustomAction, pinPostCustomAction, likePostCustomAction } =
    FeedListCustomActions;

  // to maintain the list of selected topics for rendering posts
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // to maintain the list of selected topics for rendering posts
  const [topics, setTopics] = useState<Record<string, Topic>>({});

  // to maintain the list of widgets for rendering posts
  const [widgets, setWidgets] = useState<Record<string, any>>({});

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
              .setPage(1)
              .setPageSize(10)
              .build(),
          )) as never;

        if (fetchFeedsCall.success) {
          setCurrentPageCount(2);
          setFeedList([...fetchFeedsCall.data.posts]);
          setFeedUsersList({ ...fetchFeedsCall.data.users });
          setTopics({ ...fetchFeedsCall.data.topics });
          setWidgets({ ...fetchFeedsCall.data.widgets });
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
  const getNextPage = useCallback(
    async function () {
      try {
        const fetchFeedsCall: GetUniversalFeedResponse =
          (await lmFeedclient?.getFeed(
            GetFeedRequest.builder()
              .setTopicIds(selectedTopics)
              .setPage(currentPageCount)
              .setPageSize(10)
              .build(),
          )) as never;
        if (fetchFeedsCall.success) {
          setCurrentPageCount((oldPageCount: number) => oldPageCount + 1);
          setFeedList([...feedList, ...fetchFeedsCall.data.posts]);
          setFeedUsersList({ ...feedUsersList, ...fetchFeedsCall.data.users });
          setTopics({ ...topics, ...fetchFeedsCall.data.topics });
          setWidgets({ ...widgets, ...fetchFeedsCall.data.widgets });
        }
        if (!fetchFeedsCall.data.posts.length) {
          setLoadMoreFeeds(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      currentPageCount,
      feedList,
      feedUsersList,
      lmFeedclient,
      selectedTopics,
      topics,
      widgets,
    ],
  );

  // function to delete a post
  const deletePost = useCallback(
    async function (id: string) {
      try {
        const call: DeletePostResponse = (await lmFeedclient?.deletePost(
          DeletePostRequest.builder().setPostId(id).build(),
        )) as never;
        if (call.success) {
          const feedListCopy = [...feedList];
          const index = feedListCopy.findIndex((feed) => feed.id === id);
          const post = feedListCopy[index];
          lmfeedAnalyticsClient?.sendPostDeletedEvent(
            post,
            topics,
            currentUser?.state === LMFeedCurrentUserState.MEMBER ? "member" : "CM",
          );
          feedListCopy.splice(index, 1);
          setFeedList(feedListCopy);
          if (displaySnackbarMessage)
            displaySnackbarMessage(
              getDisplayMessage(LMDisplayMessages.POST_DELETED_SUCCESSFULLY)!,
            );
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      currentUser?.state,
      displaySnackbarMessage,
      feedList,
      lmFeedclient,
      lmfeedAnalyticsClient,
      topics,
    ],
  );
  // function to pin a post
  const pinPost = useCallback(
    async function (id: string) {
      try {
        const call: GetPinPostResponse = (await lmFeedclient?.pinPost(
          PinPostRequest.builder().setPostId(id).build(),
        )) as never;
        if (call.success) {
          const feedListCopy = [...feedList];
          const index = feedListCopy.findIndex((feed) => feed.id === id);
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

          setFeedList(feedListCopy);
          if (displaySnackbarMessage) {
            if (tempPost.isPinned) {
              displaySnackbarMessage(
                getDisplayMessage(LMDisplayMessages.POST_PINNED_SUCCESS)!,
              );
            } else {
              displaySnackbarMessage(
                getDisplayMessage(LMDisplayMessages.PIN_REMOVED_SUCCESS)!,
              );
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [displaySnackbarMessage, feedList, lmFeedclient],
  );
  const hidePost = useCallback(
    async (postId: string) => {
      try {
        const call = await lmFeedclient?.hidePost(
          HidePostRequest.builder().setPostId(postId).build(),
        );
        if (call?.success) {
          const post = feedList.find((post) => post.id === postId);

          const tempPost = { ...post };
          if (tempPost.isHidden) {
            tempPost.isHidden = false;
            // TODO
            lmfeedAnalyticsClient?.sendPostUnPinnedEvent(post!, topics);
            tempPost.menuItems = tempPost.menuItems?.map((menuItem) => {
              if (menuItem.id.toString() === LMFeedPostMenuItems.UNHIDE_POST) {
                return {
                  id: parseInt(LMFeedPostMenuItems.HIDE_POST),
                  title: "Hide Post",
                };
              } else {
                return menuItem;
              }
            });
          } else {
            tempPost.isHidden = true;
            lmfeedAnalyticsClient?.sendPostPinnedEvent(post!, topics);
            tempPost.menuItems = tempPost.menuItems?.map((menuItem) => {
              if (menuItem.id.toString() === LMFeedPostMenuItems.HIDE_POST) {
                return {
                  id: parseInt(LMFeedPostMenuItems.UNHIDE_POST),
                  title: "Unhide this Post",
                };
              } else {
                return menuItem;
              }
            });
          }

          setFeedList((currentFeedList) => {
            return currentFeedList.map((post) => {
              if (post.id === postId) {
                return tempPost as Post;
              }
              return post;
            });
          });

          if (displaySnackbarMessage) {
            if (tempPost.isHidden) {
              displaySnackbarMessage(
                getDisplayMessage(LMDisplayMessages.POST_HIDE_SUCCESS) || "",
              );
            } else {
              displaySnackbarMessage(
                getDisplayMessage(LMDisplayMessages.POST_UNHIDE_SUCCESS) || "",
              );
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      displaySnackbarMessage,
      feedList,
      lmFeedclient,
      lmfeedAnalyticsClient,
      topics,
    ],
  );
  const likePost = useCallback(
    async function (id: string) {
      try {
        const call: LikePostResponse = (await lmFeedclient?.likePost(
          LikePostRequest.builder().setPostId(id).build(),
        )) as never;
        if (call.success) {
          const feedListCopy = [...feedList];
          const index = feedListCopy.findIndex((feed) => feed.id === id);
          const post = feedListCopy[index];
          feedListCopy[index].isLiked = !feedListCopy[index].isLiked;
          if (feedListCopy[index].isLiked) {
            lmfeedAnalyticsClient?.sendPostLikedEvent(post, topics);
            feedListCopy[index].likesCount++;
          } else {
            lmfeedAnalyticsClient?.sendPostUnLikedEvent(post, topics);
            feedListCopy[index].likesCount--;
          }
          setFeedList(feedListCopy);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [feedList, lmFeedclient, lmfeedAnalyticsClient, topics],
  );

  useEffect(() => {
    customEventClient?.listen(LMFeedCustomActionEvents.MODERATION_UPDATED, () => {
      loadFeed();
    });
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.MODERATION_UPDATED);
  });

  useEffect(() => {
    customEventClient?.listen(LMFeedCustomActionEvents.POST_CREATED, () => {
      loadFeed();
      if (displaySnackbarMessage) {
        displaySnackbarMessage(
          getDisplayMessage(LMDisplayMessages.POST_CREATED_SUCCESS)!,
        );
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
        const { post, usersMap, topicsMap, widgetsMap } = detail;
        const feedListCopy = [...feedList].map((feed) => {
          if (feed.id === post?.id) {
            return post;
          } else {
            return feed;
          }
        });
        const feedUsersCopy = { ...feedUsersList, ...usersMap };
        const topicsCopy = { ...topics, ...topicsMap };
        const widgetsCopy = { ...widgets, ...widgetsMap };
        setFeedList(feedListCopy);
        setTopics(topicsCopy);
        setFeedUsersList(feedUsersCopy);
        setWidgets(widgetsCopy);
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getDisplayMessage(LMDisplayMessages.POST_EDIT_SUCCESS)!,
          );
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
          if (post?.id === id) {
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
          if (post?.id === id) {
            post.commentsCount++;
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
          if (post?.id === id) {
            post.commentsCount--;
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
          if (post?.id === id) {
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
      LMFeedCustomActionEvents.HIDDEN_ON_DETAIL,
      (e: Event) => {
        const id = (e as CustomEvent).detail.id;
        const feedListCopy = [...feedList].map((post) => {
          if (post?.id === id) {
            post.menuItems = post.menuItems.map((menuItem) => {
              if (menuItem.id.toString() === LMFeedPostMenuItems.HIDE_POST) {
                menuItem.id = parseInt(LMFeedPostMenuItems.UNHIDE_POST);
                menuItem.title = "Unhine This Post";
              } else if (
                menuItem.id.toString() === LMFeedPostMenuItems.UNHIDE_POST
              ) {
                menuItem.id = parseInt(LMFeedPostMenuItems.HIDE_POST);
                menuItem.title = "Hide Post";
              }
              return menuItem;
            });
            post.isHidden = !post.isHidden;
          }

          return post;
        });
        setFeedList(feedListCopy);
      },
    );
    return () =>
      customEventClient?.remove(LMFeedCustomActionEvents.HIDDEN_ON_DETAIL);
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
  const feedListActionsAndDataStore: FeedListActionsAndDataStore =
    useMemo(() => {
      return {
        feedListDataStore: {
          selectedTopics,
          setSelectedTopics,
          topics,
          setTopics,
          loadMoreFeeds,
          setLoadMoreFeeds,
          currentPageCount,
          setCurrentPageCount,
          feedList,
          setFeedList,
          feedUsersList,
          setFeedUsersList,
          widgets,
          setWidgets,
        },
        applicationGeneralsStore: {
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
          deletePost,
          pinPost,
          likePost,
          getNextPage,
        },
      };
    }, [
      selectedTopics,
      topics,
      loadMoreFeeds,
      currentPageCount,
      feedList,
      feedUsersList,
      widgets,
      currentUser,
      currentCommunity,
      logoutUser,
      displaySnackbarMessage,
      closeSnackbar,
      showSnackbar,
      message,
      deletePost,
      pinPost,
      likePost,
      getNextPage,
    ]);
  return {
    topics,
    widgets,
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds,
    feedList,
    feedUsersList,
    getNextPage,
    hidePost,
    deletePost: deletePostCustomAction
      ? deletePostCustomAction.bind(null, feedListActionsAndDataStore)
      : deletePost,
    pinPost: pinPostCustomAction
      ? pinPostCustomAction.bind(null, feedListActionsAndDataStore)
      : pinPost,
    likePost: likePostCustomAction
      ? likePostCustomAction.bind(null, feedListActionsAndDataStore)
      : likePost,
    postComponentClickCustomCallback: postComponentClickCustomCallback
      ? postComponentClickCustomCallback.bind(null, feedListActionsAndDataStore)
      : undefined,
  };
}
