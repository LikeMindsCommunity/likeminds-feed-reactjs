/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetPostLikesRequest } from "@likeminds.community/feed-js";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAvatar } from "../shared/components/LMUserMedia";
import { Member, User } from "../shared/types/models/member";
import { GetPostLikesResponse } from "../shared/types/api-responses/getPostLikesResponse";

const LMFeedLikedMembers = (props: any) => {
  const { postId } = props;

  const { lmFeedclient, customEventClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [loadMoreFeeds, setLoadMoreFeeds] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const [totalMemberCounts, setTotalMemberCounts] = useState<number>(0);

  const memberObj: any = [];
  const fetchLikes = async (page: number) => {
    try {
      const response: GetPostLikesResponse = (await lmFeedclient?.getPostLikes(
        GetPostLikesRequest.builder()
          .setpage(page)
          .setpageSize(20)
          .setpostId(postId)
          .build(),
      )) as never;

      if (response && response.data && response.data.likes) {
        if (response.data.likes.length > 0) {
          response.data.likes.map((like: any) => {
            const user = response.data.users[like.uuid];
            if (!user) {
              throw new Error(`No user found with UUID: ${like.uuid}`);
            }
            return memberObj.push(user);
          });

          setMembers(memberObj);
          // setMembers((memberObj) => [...memberObj]);
          setPageCount(page);
          setTotalMemberCounts(response.data.totalCount);
        }

        if (
          response.data.likes.length === 0 ||
          members.length >= response.data.totalCount
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
    fetchLikes(1);
  }, [lmFeedclient]);

  const getNextPage = () => {
    fetchLikes(pageCount + 1);
  };

  return (
    <div className="lm-member-wrapper">
      <div className="lm-member-wrapper__header">
        Likes ({totalMemberCounts})
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

export default LMFeedLikedMembers;
