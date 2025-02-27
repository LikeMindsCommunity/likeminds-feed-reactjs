import React, { useContext, useMemo } from "react";
import { Post } from "../shared/types/models/post";
import { User } from "../shared/types/models/member";
import { Comment } from "../shared/types/models/comment";

import LMFeedPostHeader from "./LMFeedPostHeader";
import LMFeedPostBody from "./LMFeedPostBody";
import LMFeedPostFooter from "./LMFeedPostFooter";
import LMFeedPostTopicsWrapper from "./LMFeedPostTopicsWrapper";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { FeedSideNavbarContext } from "../contexts/LMFeedSideNavbarContext";
import LMFeedModerationPostHeader from "./LMFeedModerationPostHeader";
import LMFeedModerationPostFooter from "./LMFeedModerationPostFooter";

interface LMFeedPostProps {
  post: Post;
  user: User | undefined;
}

const LMFeedPost: React.FC<LMFeedPostProps> = ({ post: propPost }) => {
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const { selectedNav } = useContext(FeedSideNavbarContext);
  const { post, postComponentClickCustomCallback } =
    useContext(FeedPostContext);
  const { reports, selectedTab, comments } = useContext(FeedModerationContext);
  const showCustomPostViewWidget = useMemo(() => {
    if (post?.attachments && post?.attachments.length > 0) {
      const attachments = post.attachments;
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
              <LMFeedModerationPostHeader postDetails={propPost} />
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
              <LMFeedModerationPostFooter postDetails={propPost} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LMFeedPost;
