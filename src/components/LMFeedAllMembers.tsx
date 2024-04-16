/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import dummyUser from "../assets/images/user.png";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { GetAllMembersRequest } from "@likeminds.community/feed-js-beta";
// import { IMember } from "@likeminds.community/feed-js";
import { getAvatar } from "../shared/components/LMUserMedia";
import { User } from "../shared/types/models/member";

const LMFeedAllMembers = () => {
  const { lmFeedclient, customEventClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const [members, setMembers] = useState<User[] | null>(null);

  useEffect(() => {
    async function getAllMembers() {
      try {
        const pageCount = 1;
        const response: any = await lmFeedclient?.getAllMembers(
          GetAllMembersRequest.builder().setpage(pageCount).build(),
        );

        setMembers(response?.data?.members);
      } catch (error) {
        console.log(error);
      }
    }
    getAllMembers();
  }, [lmFeedclient]);

  return (
    <div className="lm-member-wrapper">
      <div className="lm-member-wrapper__header">Member List</div>
      <div className="lm-member-wrapper__body">
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
      </div>
    </div>
  );
};

export default LMFeedAllMembers;
