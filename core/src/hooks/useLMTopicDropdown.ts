/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Topic } from "../shared/types/models/topic";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetTopicsRequest } from "@likeminds.community/feed-js-beta";
import { GetTopicsResponse } from "../shared/types/api-responses/getTopicsResponse";
import { LMTopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { TopicsActionsAndDataStore } from "../shared/types/cutomCallbacks/dataProvider";

import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import {
  CustomAgentProviderContext,
  TopicComponentCustomClickEventDelegatorCallback,
} from "../contexts/LMFeedCustomAgentProviderContext";

import { ComponentDelegatorListener } from "../shared/types/cutomCallbacks/callbacks";
export function useTopicDropdown(
  currentSelectedTopicIds?: string[],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentSelectedTopicIds?: any,
  preSelectedTopics?: Topic[],
  setPreSelectedTopics?: React.Dispatch<Topic[]>,
  mode?: LMTopicsDropdownMode,
): useTopicDropdownResponse {
  // Getting an instance of the client
  const { lmFeedclient, lmfeedAnalyticsClient } = useContext(
    GlobalClientProviderContext,
  );
  const { TopicsCustomCallbacks = {}, topicComponentClickCustomCallback } =
    useContext(CustomAgentProviderContext);
  const {
    setSearchKeyCustomAction,
    updateCheckedTopicsCustomAction,
    clearAllCheckedTopicsCustomAction,
  } = TopicsCustomCallbacks;
  const { displaySnackbarMessage, closeSnackbar, showSnackbar, message } =
    useContext(GeneralContext);
  const { logoutUser, currentUser, currentCommunity } = useContext(
    LMFeedUserProviderContext,
  );

  // to store the ids of topics that should be checked.

  const [checkedTopics, setCheckedTopics] = useState<Topic[]>([]);

  // to detect whether a new topic page should be loaded or not
  const [loadNewTopics, setLoadNewTopics] = useState<boolean>(true);

  // to store the list of topics || will use this list to render the UI.
  const [topics, setTopics] = useState<Topic[]>([]);

  // to store the page count of the topics list.
  const [currentPageCount, setCurrentPageCount] = useState<number>(1);

  const [searchKey, setSearchKey] = useState<string>("");

  //   function to load the next page of the topics
  const getNextPage = useCallback(async () => {
    try {
      const getTopicsCall: GetTopicsResponse = (await lmFeedclient?.getTopics(
        GetTopicsRequest.builder()
          .setPage(currentPageCount)
          .setSearchType("name")
          .setSearch(searchKey)
          .setPageSize(10)
          .setIsEnabled(LMTopicsDropdownMode.edit === mode ? true : null)
          .build(),
      )) as never;
      if (getTopicsCall.success) {
        setCurrentPageCount((pageCount) => pageCount + 1);
        setTopics([...topics, ...getTopicsCall.data.topics]);
        if (!getTopicsCall.data.topics.length) {
          setLoadNewTopics(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentPageCount, lmFeedclient, mode, searchKey, topics]);

  //   function to load the list of topics initially| | loading with page no 1
  const loadTopics = useCallback(async () => {
    try {
      const getTopicsCall: GetTopicsResponse = (await lmFeedclient?.getTopics(
        GetTopicsRequest.builder()
          .setPage(1)
          .setSearchType("name")
          .setSearch(searchKey)
          .setPageSize(10)
          .setIsEnabled(LMTopicsDropdownMode.edit === mode ? true : null)
          .build(),
      )) as never;
      if (getTopicsCall.success) {
        setCurrentPageCount(2);
        setTopics([...getTopicsCall.data.topics]);
        if (!getTopicsCall.data.topics.length) {
          setLoadNewTopics(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmFeedclient, mode, searchKey]);

  // TODO update the logic for finding index and checking the topics
  const updateCheckedTopics = useCallback(
    (arg: Topic, postId?: string) => {
      const isTopicAlreadyChecked = checkedTopics.some((topic: Topic) => {
        return topic?.id === arg?.id;
      });
      if (isTopicAlreadyChecked) {
        const index = checkedTopics.findIndex((topic: Topic) => {
          return topic?.id === arg?.id;
        });
        const newCheckedTopics = [...checkedTopics];
        newCheckedTopics.splice(index, 1);
        setCheckedTopics(newCheckedTopics);
      } else {
        const newCheckedTopics = [...checkedTopics];
        newCheckedTopics.push(arg);
        lmfeedAnalyticsClient?.sendTopicsAddedInThePostEvent(
          newCheckedTopics,
          postId,
        );
        setCheckedTopics(newCheckedTopics);
      }
    },
    [checkedTopics, lmfeedAnalyticsClient],
  );

  // to remove all the checked topics
  const clearAllCheckedTopics = () => {
    setCheckedTopics([]);
  };

  useEffect(() => {
    loadTopics();
  }, [loadTopics, searchKey]);

  const topicsActionsAndDataStore: TopicsActionsAndDataStore = useMemo(() => {
    return {
      topicsDataStore: {
        checkedTopics,
        setCheckedTopics,
        loadNewTopics,
        setLoadNewTopics,
        topics,
        setTopics,
        currentPageCount,
        setCurrentPageCount,
        searchKey,
        setSearchKey,
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
        setSearchKey,
        updateCheckedTopics,
        clearAllCheckedTopics,
        getNextPage,
      },
    };
  }, [
    checkedTopics,
    closeSnackbar,
    currentCommunity,
    currentPageCount,
    currentUser,
    displaySnackbarMessage,
    getNextPage,
    loadNewTopics,
    logoutUser,
    message,

    searchKey,
    showSnackbar,
    topics,
    updateCheckedTopics,
  ]);

  // update the checkedTopics on useFeed hooks
  useEffect(() => {
    if (setCurrentSelectedTopicIds) {
      setCurrentSelectedTopicIds((prevstate: string[]) => {
        const t = checkedTopics.map((topic) => topic?.id);
        if (checkedTopics.length !== prevstate.length) {
          return t;
        }

        // Create sorted copies of the arrays
        const sortedArr1 = [...prevstate].sort();
        const sortedArr2 = [...t].sort();

        // Iterate over each element in the sorted arrays
        for (let i = 0; i < sortedArr1.length; i++) {
          // Check if the elements at the current index are not equal
          if (sortedArr1[i] !== sortedArr2[i]) {
            return t;
          }
        }
        return prevstate;
      });
    }
  }, [checkedTopics, setCurrentSelectedTopicIds]);
  useEffect(() => {
    if (preSelectedTopics) {
      setCheckedTopics(preSelectedTopics);
    }
  }, [preSelectedTopics]);

  return {
    checkedTopics,
    topics,
    loadNewTopics,
    getNextPage,
    searchKey,
    setSearchKey: setSearchKeyCustomAction
      ? setSearchKeyCustomAction.bind(null, topicsActionsAndDataStore)
      : setSearchKey,
    updateCheckedTopics: updateCheckedTopicsCustomAction
      ? updateCheckedTopicsCustomAction.bind(null, topicsActionsAndDataStore)
      : updateCheckedTopics,
    clearAllCheckedTopics: clearAllCheckedTopicsCustomAction
      ? clearAllCheckedTopicsCustomAction.bind(null, topicsActionsAndDataStore)
      : clearAllCheckedTopics,
    topicComponentClickCustomCallback: topicComponentClickCustomCallback
      ? topicComponentClickCustomCallback.bind(null, topicsActionsAndDataStore)
      : undefined,
  };
}

interface useTopicDropdownResponse {
  checkedTopics: Topic[];
  topics: Topic[];
  loadNewTopics: boolean;
  searchKey: string;
  setSearchKey: React.Dispatch<string>;
  updateCheckedTopics: (topic: Topic) => void;
  clearAllCheckedTopics: () => void;
  getNextPage: () => Promise<void>;
  topicComponentClickCustomCallback?: ComponentDelegatorListener;
}
