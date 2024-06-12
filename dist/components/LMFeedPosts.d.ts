import React from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
interface LMFeedPostProps {
    post: Post;
    user: User | undefined;
}
declare const LMFeedPost: React.FC<LMFeedPostProps>;
export default LMFeedPost;
