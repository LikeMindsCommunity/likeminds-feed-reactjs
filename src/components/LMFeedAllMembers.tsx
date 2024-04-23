/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetAllMembersRequest } from "@likeminds.community/feed-js-beta";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAvatar } from "../shared/components/LMUserMedia";
import { Member } from "../shared/types/models/member";
import { GetAllMembersResponse } from "../shared/types/api-responses/getAllMembersResponse";
import { MEMBER_LIST } from "../shared/constants/lmAppConstant";

const LMFeedAllMembers = () => {
  const { lmFeedclient, customEventClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [loadMoreFeeds, setLoadMoreFeeds] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const [totalMemberCounts, setTotalMemberCounts] = useState<number>(0);

  const fetchMembers = async (page: number) => {
    try {
      const response: GetAllMembersResponse =
        (await lmFeedclient?.getAllMembers(
          GetAllMembersRequest.builder().setpage(page).build(),
        )) as never;

      if (response && response.data && response.data.members) {
        if (response.data.members.length > 0) {
          setMembers((prevMembers) => [
            ...prevMembers,
            ...response.data.members,
          ]);
          setPageCount(page); // set current page
          setTotalMemberCounts(response.data.totalMembers);
        }

        if (
          response.data.members.length === 0 ||
          members.length >= response.data.totalMembers
        ) {
          setLoadMoreFeeds(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoadMoreFeeds(false);
    }
  };

  useEffect(() => {
    fetchMembers(1);
    fetchMembers(2);
  }, [lmFeedclient]);
  useEffect(() => {
    console.log(pageCount);
  }, [pageCount]);
  const getNextPage = () => {
    fetchMembers(pageCount + 1);
  };

  return (
    <div className="lm-member-wrapper">
      <div className="lm-member-wrapper__header">
        {MEMBER_LIST} ({totalMemberCounts})
      </div>
      <div className="lm-member-wrapper__body" id="member-scroll-container">
        <InfiniteScroll
          dataLength={members ? members.length : 0}
          hasMore={loadMoreFeeds}
          next={getNextPage}
          loader={null}
          scrollableTarget="member-scroll-container"
        >
          {members ? (
            members.map((member: Member) => (
              <div
                key={member.uuid}
                className="lm-member-wrapper__body__media lm-hover-effect lm-cursor-pointer"
              >
                <div className="lm-member-wrapper__body__media__imgBox lm-avatar">
                  {getAvatar({
                    imageUrl: member.imageUrl,
                    name: member?.name,
                  })}
                </div>
                <div className="lm-member-wrapper__body__media__content">
                  <div className="lm-member-wrapper__body__media__content--name">
                    {member.name}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default LMFeedAllMembers;
