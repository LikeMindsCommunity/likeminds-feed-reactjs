/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetAllMembersRequest } from "@likeminds.community/feed-js-beta";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAvatar } from "../shared/components/LMUserMedia";
import { User } from "../shared/types/models/member";

const LMFeedAllMembers = () => {
  const { lmFeedclient, customEventClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const [members, setMembers] = useState<User[]>();
  const [loadMoreFeeds, setLoadMoreFeeds] = useState(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const [totalMemberCounts, setTotalMemberCounts] = useState<number>(0);

  useEffect(() => {
    async function getAllMembers() {
      try {
        const resData = [];

        // Fetch members for page 1
        const resPage1 = await lmFeedclient?.getAllMembers(
          GetAllMembersRequest.builder().setpage(pageCount).build(),
        );

        // Push members from page 1 into resData array
        if (resPage1 && resPage1.data && resPage1.data.members) {
          resData.push(...resPage1.data.members);
        }

        // Fetch members for page 2
        const resPage2 = await lmFeedclient?.getAllMembers(
          GetAllMembersRequest.builder()
            .setpage(pageCount + 1)
            .build(),
        );

        // Push members from page 2 into resData array
        if (resPage2 && resPage2.data && resPage2.data.members) {
          resData.push(...resPage2.data.members);
        }

        // Set members state to the combined array
        setMembers(resData);

        // Increment pageCount by 1
        setPageCount((prevPageCount: number) => prevPageCount + 1);
        console.log("pagecount = ", pageCount);
      } catch (error) {
        console.log(error);
      }
    }
    getAllMembers();
  }, [lmFeedclient]);

  //   function to load the next page for the current selected topics
  const getNextPage = async () => {
    try {
      const response: any = await lmFeedclient?.getAllMembers(
        GetAllMembersRequest.builder()
          .setpage(pageCount + 1)
          .build(),
      );
      setMembers(response?.data?.members);
      setPageCount((pageCount: number) => pageCount++);

      if (!response?.data?.members.length) {
        setLoadMoreFeeds(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="lm-member-wrapper">
      <div className="lm-member-wrapper__header">
        Member List({totalMemberCounts})
      </div>
      <div className="lm-member-wrapper__body">
        <InfiniteScroll
          dataLength={members ? members.length : 0}
          hasMore={loadMoreFeeds}
          next={getNextPage}
          loader={null}
          useWindow={false}
        >
          {members ? (
            members.map((member: User) => (
              <div key={member.id} className="lm-member-wrapper__body__media">
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
