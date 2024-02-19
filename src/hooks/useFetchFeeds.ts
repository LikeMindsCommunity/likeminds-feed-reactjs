import { useState } from "react";
import { Post } from "../types/models/post";
import { User } from "../types/models/member";

interface useFetchFeedsResponse {
  topics: string[];
  loadMoreFeeds: boolean;
  getNextPage: never;
  feedList: Post[];
  feedUsersList: Record<string, User>;
}

export function useFetchFeeds() {
  // to maintain the list of selected topics for rendering posts
  const [topics, setTopics] = useState<string[]>([]);

  // to detect whether we should load more posts || it will turn false if we reached the end of pagination with the current set of topics.
  const [loadMoreFeeds, setLoadMoreFeeds] = useState<boolean>(true);

  // to maintain the page count of current feeds || it will reset to one whenever the topics are changed
  const [currentPageCount, setCurrentPageCount] = useState<number>(1);

  //   to maintain the list of feeds || it will reset to [] whenever the topics are changed
  const [feedList, setFeedList] = useState<Post[]>([]);

  //   to maintain the map of users for the feedlist
  const [feedUsersList, setFeedUsersList] = useState<Record<string, User>>({});

  async function loadFeed() {
    try {
    } catch (error) {}
  }

  async function getNextPage(params: type) {}
}
