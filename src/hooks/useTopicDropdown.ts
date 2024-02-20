/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import { Topic } from "../types/models/topic";
import GlobalClientProviderContext from "../contexts/GlobalClientProviderContext";
import { GetTopicsRequest } from "@likeminds.community/feed-js-beta";
import { GetTopicsResponse } from "../types/api-responses/getTopicsResponse";
export function useTopicDropdown(
  currentSelectedTopicIds: string[],
  setCurrentSelectedTopicIds: React.Dispatch<string[]>,
): useTopicDropdownResponse {
  // Getting an instance of the client
  const { lmFeedclient } = useContext(GlobalClientProviderContext);

  // to store the ids of topics that should be checked.
  const [checkedTopicIds, setCheckedTopicIds] = useState<string[]>([]);

  // to detect whether a new topic page should be loaded or not
  const [loadNewTopics, setLoadNewTopics] = useState<boolean>(false);

  // to store the list of topics || will use this list to render the UI.
  const [topics, setTopics] = useState<Topic[]>([]);

  // to store the page count of the topics list.
  const [currentPageCount, setCurrentPageCount] = useState<number>(1);

  const [searchKey, setSearchKey] = useState<string>("");

  //   function to load the next page of the topics
  const getNextPage = async function () {
    try {
      const getTopicsCall: GetTopicsResponse = (await lmFeedclient?.getTopics(
        GetTopicsRequest.builder()
          .setPage(currentPageCount)
          .setSearchType("name")
          .setSearch(searchKey)
          .setPageSize(20),
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
  const loadTopics = useCallback(
    async function () {
      try {
        const getTopicsCall: GetTopicsResponse = (await lmFeedclient?.getTopics(
          GetTopicsRequest.builder()
            .setPage(1)
            .setSearchType("name")
            .setSearch(searchKey)
            .setPageSize(20),
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
    },
    [lmFeedclient, searchKey],
  );

  useEffect(() => {
    loadTopics();
  }, [loadTopics, searchKey]);

  return {
    checkedTopicIds,
    topics,
    loadNewTopics,
    getNextPage,
    setSearchKey,
  };
}

interface useTopicDropdownResponse {
  getNextPage: () => Promise<void>;
  checkedTopicIds: string[];
  topics: Topic[];
  loadNewTopics: boolean;
  setSearchKey: React.Dispatch<string>;
}
