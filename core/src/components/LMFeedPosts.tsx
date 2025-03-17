import React, { useContext, useMemo } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedPostFooter from "./LMFeedPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMFeedActivityHeader from "./LMFeedActivityHeader";
import LMFeedActionFooter from "./LMFeedActionFooter";
import { AttachmentType } from "@likeminds.community/feed-js";
import { Report } from "../shared/types/models/report";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

interface LMFeedPostProps {
  propReport?: Report;
  post: Post;
  user: User | undefined;
  isModerationScreen?: boolean;
}

const LMFeedPost: React.FC<LMFeedPostProps> = ({
  propReport,
  isModerationScreen,
}) => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { currentUser } = useContext(LMFeedUserProviderContext);
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
    // TODO Custom Widget
    // Render the complete custom Post View widget
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
          <>
            {isModerationScreen && currentUser?.state === 1 ? (
              <LMFeedActivityHeader propReport={propReport} />
            ) : (
              <LMFeedPostHeader />
            )}
          </>
        )}
        {CustomComponents?.CustomPostViewTopicsWrapper ? (
          CustomComponents?.CustomPostViewTopicsWrapper
        ) : (
          <LMFeedPostTopicsWrapper />
        )}
        {CustomComponents?.CustomPostViewBody ? (
          CustomComponents?.CustomPostViewBody
        ) : (
          <LMFeedPostBody />
        )}
        {CustomComponents?.CustomPostViewFooter ? (
          CustomComponents.CustomPostViewFooter
        ) : (
          <>
            {isModerationScreen && currentUser?.state === 1 ? (
              <LMFeedActionFooter propReport={propReport} />
            ) : (
              <LMFeedPostFooter />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LMFeedPost;
