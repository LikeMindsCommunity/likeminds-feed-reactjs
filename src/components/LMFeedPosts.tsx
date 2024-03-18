import React, { useContext } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";

import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedPostFooter from "./LMFeedPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

interface LMFeedPostProps {
  post: Post;
  user: User | undefined;
}

const LMFeedPost: React.FC<LMFeedPostProps> = () => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  return (
    <div className="lm-feed-wrapper__card lm-mb-2">
      {CustomComponents?.PostViewHeader ? (
        CustomComponents?.PostViewHeader
      ) : (
        <LMFeedPostHeader />
      )}
      {CustomComponents?.PostViewTopicsWrapper ? (
        CustomComponents?.PostViewTopicsWrapper
      ) : (
        <LMFeedPostTopicsWrapper />
      )}
      {CustomComponents?.PostViewBody ? (
        CustomComponents?.PostViewBody
      ) : (
        <LMFeedPostBody />
      )}
      {CustomComponents?.PostViewFooter ? (
        CustomComponents.PostViewFooter
      ) : (
        <LMFeedPostFooter />
      )}
    </div>
  );
};

export default LMFeedPost;
