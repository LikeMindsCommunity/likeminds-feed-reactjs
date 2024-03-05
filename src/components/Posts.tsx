import React from "react";
import { Post } from "../types/models/post";
import { User } from "../types/models/member";

import LMPostHeader from "./LMPostHeader";
import LMPostBody from "./LMPostBody";
import LMPostFooter from "./LMPostFooter";
import LMPostTopicsWrapper from "./LMPostTopicsWrapper";
interface PostsProps {
  post: Post;
  user: User | undefined;
}

const Posts: React.FC<PostsProps> = () => {
  return (
    <div className="lm-feed-wrapper__card lm-mb-2">
      <LMPostHeader />
      <LMPostTopicsWrapper />
      <LMPostBody />
      <LMPostFooter />
    </div>
  );
};

export default Posts;
