import React, { useContext, useMemo } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedPostFooter from "./LMFeedPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { FeedSideNavbarContext } from "../contexts/LMFeedSideNavbarContext";
import LMFeedModerationPostHeader from "./LMFeedModerationPostHeader";
import LMFeedModerationPostFooter from "./LMFeedModerationPostFooter";
import { AttachmentType } from "@likeminds.community/feed-js";
import { Report } from "../shared/types/models/report";

interface LMFeedPostProps {
  propReport? : Report
  post: Post;
  user: User | undefined;
}

const LMFeedPost: React.FC<LMFeedPostProps> = ({ propReport }) => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { selectedNav } = useContext(FeedSideNavbarContext);
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
            {selectedNav === "home" ? (
              <LMFeedPostHeader />
            ) : (
              <LMFeedModerationPostHeader propReport={propReport} />
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
            {selectedNav === "home" ? (
              <LMFeedPostFooter />
            ) : (
              <LMFeedModerationPostFooter propReport={propReport} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LMFeedPost;
