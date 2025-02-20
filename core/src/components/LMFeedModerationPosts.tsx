import React, { useContext, useMemo } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";

import LMFeedModerationPostHeader from "./LMFeedModerationPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedModerationPostFooter from "./LMFeedModerationPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
// import { FeedPostContext } from "../contexts/LMFeedPostContext";

interface LMFeedModerationPostProps {
  post: Post;
  user: User | undefined;
}
  
const LMFeedModerationPosts: React.FC<LMFeedModerationPostProps> = ({
  post: propPost,
  user,
}) => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { post, postComponentClickCustomCallback } =
    useContext(FeedPostContext);
  const showCustomPostViewWidget = useMemo(() => {
    if (propPost?.attachments && propPost?.attachments.length > 0) {
      const attachments = propPost.attachments;
      const attachmentLength = attachments.length;
      let noOfCustomViewAttachments = 0;
      for (const attachment of attachments) {
        if (attachment.attachmentType.toString() === "5") {
          noOfCustomViewAttachments++;
        }
      }
      if (noOfCustomViewAttachments === attachmentLength) {
        return true;
      } else {
        false;
      }
    } else {
      return false;
    }
  }, [post]);
  if (showCustomPostViewWidget) {
    // TODO Custom Widget
    // Render the complete custom Post View widget
    return CustomComponents?.CustomWidgetPostView;
  }
  return (
    <div
      className="lm-feed-wrapper__card lm-mb-2"
      lm-feed-data-id={propPost?.id}
      lm-feed-component-id={`lm-feed-post-wrapper-${propPost?.id}`}
      onClick={(e) => {
        if (postComponentClickCustomCallback) {
          postComponentClickCustomCallback(e);
        }
      }}
    >
      <LMFeedModerationPostHeader />
      <LMFeedPostTopicsWrapper />
      <LMFeedPostBody />
      <LMFeedModerationPostFooter />
    </div>
  );
};

export default LMFeedModerationPosts;
