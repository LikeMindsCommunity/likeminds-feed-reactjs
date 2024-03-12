import React from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";

import LMPostHeader from "./LMPostHeader";
import LMPostBody from "./LMPostBody";
import LMPostFooter from "./LMPostFooter";
import LMPostTopicsWrapper from "./LMPostTopicsWrapper";

interface LMPostsProps {
  post: Post;
  user: User | undefined;
}

const LMPosts: React.FC<LMPostsProps> = () => {
  return (
    <div className="lm-feed-wrapper__card">
      <LMPostHeader />
      <LMPostTopicsWrapper />
      <LMPostBody />
      <LMPostFooter />
    </div>
  );
};

export default LMPosts;
