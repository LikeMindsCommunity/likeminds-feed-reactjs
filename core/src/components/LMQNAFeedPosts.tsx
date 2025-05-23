import React, { useContext, useMemo } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";

import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMQNAFeedPostBody from "./LMQNAFeedPostBody";
import LMQNAFeedPostFooter from "./LMQNAFeedPostFooter";
import { AttachmentType } from "@likeminds.community/feed-js";

interface LMFeedPostProps {
  post: Post;
  user: User | undefined;
}

const LMQNAFeedPosts: React.FC<LMFeedPostProps> = () => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { post, postComponentClickCustomCallback } =
    useContext(FeedPostContext);
  const showCustomPostViewWidget = useMemo(() => {
    if (post?.attachments && post?.attachments.length > 0) {
      const attachments = post.attachments;
      const attachmentLength = attachments.length;
      let noOfCustomViewAttachments = 0;
      for (const attachment of attachments) {
        if (attachment.type === AttachmentType.CUSTOM) {
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
    return CustomComponents?.CustomWidgetPostView;
  }
  return (
    <>
      <div
        className="lm-feed-wrapper__card lm-mb-2"
        lm-feed-data-id={post?.id}
        lm-feed-component-id={`lm-feed-post-wrapper-${post?.id}`}
        onClick={(e) => {
          if (postComponentClickCustomCallback) {
            postComponentClickCustomCallback(e);
          }
        }}
      >
        {CustomComponents?.CustomPostViewHeader ? (
          CustomComponents?.CustomPostViewHeader
        ) : (
          <LMFeedPostHeader />
        )}
        {CustomComponents?.CustomPostViewTopicsWrapper ? (
          CustomComponents?.CustomPostViewTopicsWrapper
        ) : (
          <LMFeedPostTopicsWrapper />
        )}
        {CustomComponents?.CustomPostViewBody ? (
          CustomComponents?.CustomPostViewBody
        ) : (
          <LMQNAFeedPostBody />
        )}
        {CustomComponents?.CustomPostViewFooter ? (
          CustomComponents.CustomPostViewFooter
        ) : (
          <LMQNAFeedPostFooter />
        )}
      </div>
    </>
  );
};

export default LMQNAFeedPosts;
