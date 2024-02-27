/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import { Topic } from "../types/models/topic";
import GlobalClientProviderContext from "../contexts/GlobalClientProviderContext";
import { GetTopicsRequest } from "@likeminds.community/feed-js-beta";
import { GetTopicsResponse } from "../types/api-responses/getTopicsResponse";
export function useTopicDropdown(
  currentSelectedTopicIds?: string[],
  setCurrentSelectedTopicIds?: React.Dispatch<string[]>,
): useTopicDropdownResponse {
  // Getting an instance of the client
  const { lmFeedclient } = useContext(GlobalClientProviderContext);

  // to store the ids of topics that should be checked.
  const [checkedTopics, setCheckedTopics] = useState<Topic[]>([]);

  // to detect whether a new topic page should be loaded or not
  const [loadNewTopics, setLoadNewTopics] = useState<boolean>(false);

  // to store the list of topics || will use this list to render the UI.
  const [topics, setTopics] = useState<Topic[]>([]);

  // to store the page count of the topics list.
  const [currentPageCount, setCurrentPageCount] = useState<number>(1);

  const [searchKey, setSearchKey] = useState<string>("");

  //   function to load the next page of the topics
  const getNextPage = async () => {
    try {
      const getTopicsCall: GetTopicsResponse = (await lmFeedclient?.getTopics(
        GetTopicsRequest.builder()
          .setPage(currentPageCount)
          .setSearchType("name")
          .setSearch(searchKey)
          .setPageSize(20)
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
  };

  //   function to load the list of topics initially| | loading with page no 1
  const loadTopics = useCallback(async () => {
    try {
      const getTopicsCall: GetTopicsResponse = (await lmFeedclient?.getTopics(
        GetTopicsRequest.builder()
          .setPage(1)
          .setSearchType("name")
          .setSearch(searchKey)
          .setPageSize(5)
          .setIsEnabled(false)
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
  }, [lmFeedclient, searchKey]);

  // TODO update the logic for finding index and checking the topics
  const updateCheckedTopics = (arg: Topic) => {
    console.log(arg);
    const isTopicAlreadyChecked = checkedTopics.some((topic: Topic) => {
      return topic.Id === arg.Id;
    });
    console.log(isTopicAlreadyChecked);
    if (isTopicAlreadyChecked) {
      const index = checkedTopics.findIndex((topic: Topic) => {
        return topic.Id === arg.Id;
      });
      console.log(index);
      const newCheckedTopics = [...checkedTopics];
      newCheckedTopics.splice(index, 1);
      setCheckedTopics(newCheckedTopics);
    } else {
      const newCheckedTopics = [...checkedTopics];
      newCheckedTopics.push(arg);
      console.log(newCheckedTopics);
      setCheckedTopics(newCheckedTopics);
    }
  };

  // to remove all the checked topics
  const clearAllCheckedTopics = () => {
    setCheckedTopics([]);
  };

  useEffect(() => {
    loadTopics();
  }, [loadTopics, searchKey]);

  return {
    checkedTopics,
    topics,
    loadNewTopics,
    getNextPage,
    searchKey,
    setSearchKey,
    updateCheckedTopics,
    clearAllCheckedTopics,
  };
}

interface useTopicDropdownResponse {
  getNextPage: () => Promise<void>;
  checkedTopics: Topic[];
  topics: Topic[];
  loadNewTopics: boolean;
  searchKey: string;
  setSearchKey: React.Dispatch<string>;
  updateCheckedTopics: (topic: Topic) => void;
  clearAllCheckedTopics: () => void;
}