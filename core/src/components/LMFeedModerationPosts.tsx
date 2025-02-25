import React, { useContext, useMemo } from "react";
import { Post } from "../shared/types/models/post";

import LMFeedModerationPostHeader from "./LMFeedModerationPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedModerationPostFooter from "./LMFeedModerationPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { Comment } from "../shared/types/models/comment";

interface LMFeedModerationPostProps {
  post: Post;
}

const LMFeedModerationPosts: React.FC<LMFeedModerationPostProps> = ({
  post: propPost,
}) => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { postComponentClickCustomCallback } = useContext(FeedPostContext);
  const { reports, selectedTab, comments } = useContext(FeedModerationContext);

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
  }, [propPost]);
  if (showCustomPostViewWidget) {
    // TODO Custom Widget
    // Render the complete custom Post View widget
    return CustomComponents?.CustomWidgetPostView;
  }

  let reportedDetails = reports.filter(
    (report) => report.entityId === propPost.id && report.isClosed === true,
  );

  let commentDetails: Comment | undefined;

  if (reportedDetails.length === 0) {
    commentDetails = comments.filter(
      (comment) => comment.postId === propPost.id,
    )[0];
    reportedDetails = reports.filter(
      (report) =>
        report.entityId === commentDetails?.id && report.isClosed === true,
    );
  }

  if (selectedTab === "closed" && reportedDetails.length === 0) {
    return null;
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
      <LMFeedModerationPostHeader postDetails={propPost} />
      <LMFeedPostTopicsWrapper />
      <LMFeedPostBody />
      <LMFeedModerationPostFooter postDetails={propPost} />
    </div>
  );
};

export default LMFeedModerationPosts;
