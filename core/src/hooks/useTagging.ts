/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetTaggingListRequest } from "@likeminds.community/feed-js-beta";
import { GetTaggingListResponse } from "../shared/types/api-responses/getTaggingListResponse";
import { TaggingMember } from "../shared/types/models/taggingMember";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Tag = TaggingMember;
interface UseTagging {
  taggingList: Tag[];
  clearTaggingList: () => void;
  fetchTaggingList: (pg?: number) => void;
  setTaggingString: (str: string | null) => void;
  fetchMoreTags: boolean;
}
export function useTagging(): UseTagging {
  const { lmFeedclient } = useContext(LMFeedGlobalClientProviderContext);
  const [taggingList, setTaggingList] = useState<Tag[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [tagString, setTagString] = useState<string | null>(null);
  const [fetchMoreTags, setFetchMoreTags] = useState<boolean>(true);
  function clearTaggingList() {
    setTaggingList(() => []);
    setTagString(null);
    setPageNo(() => 1);
  }
  function setTaggingString(str: string | null) {
    setTagString(str);
  }
  async function fetchTaggingList(pg?: number) {
    try {
      const call: GetTaggingListResponse = (await lmFeedclient?.getTaggingList(
        GetTaggingListRequest.builder()
          .setPage(pg ? pg : pageNo)
          .setPageSize(10)
          .setSearchName(tagString || "")
          .build(),
      )) as GetTaggingListResponse;
      if (call.success) {
        setTaggingList((previousState) => {
          return [...previousState, ...call.data.members];
        });
        setPageNo((pg) => pg + 1);
      }
      if (!call.data.members.length) {
        setFetchMoreTags(false);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (tagString !== null) {
      setFetchMoreTags(true);
      setTaggingList((previousState) => {
        return [];
      });
      setPageNo(() => 1);
      fetchTaggingList(1);
    } else {
      setTaggingList((previousState) => {
        return [];
      });
      setPageNo(() => 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagString]);
  return {
    taggingList,
    clearTaggingList,
    fetchTaggingList,
    setTaggingString,
    fetchMoreTags,
  };
}
