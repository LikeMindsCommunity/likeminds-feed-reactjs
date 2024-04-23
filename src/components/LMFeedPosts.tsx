import React, { useContext } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";

import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedPostFooter from "./LMFeedPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
// import { FeedPostContext } from "../contexts/LMFeedPostContext";

interface LMFeedPostProps {
  post: Post;
  user: User | undefined;
}

const LMFeedPost: React.FC<LMFeedPostProps> = () => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { post, postComponentClickCustomCallback } =
    useContext(FeedPostContext);
  return (
    <div
      className="lm-feed-wrapper__card lm-mb-2"
      lm-feed-data-id={post?.Id}
      lm-feed-component-id={`lm-feed-post-wrapper-${post?.Id}`}
      onClick={(e) => {
        // console.log(e);
        if (postComponentClickCustomCallback) {
          postComponentClickCustomCallback(e);
        }
      }}
      // onClick={(e) => console.log(e)}
    >
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
