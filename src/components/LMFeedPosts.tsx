import React from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";

import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedPostFooter from "./LMFeedPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";

interface LMFeedPostProps {
  post: Post;
  user: User | undefined;
}

const LMFeedPost: React.FC<LMFeedPostProps> = () => {
  return (
    <div className="lm-feed-wrapper__card lm-mb-2">
      <LMFeedPostHeader />
      <LMFeedPostTopicsWrapper />
      <LMFeedPostBody />
      <LMFeedPostFooter />
    </div>
  );
};

export default LMFeedPost;
