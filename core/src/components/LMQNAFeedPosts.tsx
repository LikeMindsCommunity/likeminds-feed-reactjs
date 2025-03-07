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
import { FeedSideNavbarContext } from "../contexts/LMFeedSideNavbarContext";
import LMFeedModerationPostHeader from "./LMFeedModerationPostHeader";
import LMFeedModerationPostFooter from "./LMFeedModerationPostFooter";
import { Report } from "../shared/types/models/report";
import { SideNavbarState } from "../shared/enums/lmSideNavbar";

interface LMFeedPostProps {
  propReport?: Report;
  post: Post;
  user: User | undefined;
}

const LMQNAFeedPosts: React.FC<LMFeedPostProps> = ({ propReport }) => {
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
            {selectedNav === SideNavbarState.HOME ? (
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
          <LMQNAFeedPostBody />
        )}
        {CustomComponents?.CustomPostViewFooter ? (
          CustomComponents.CustomPostViewFooter
        ) : (
          <>
            {selectedNav === SideNavbarState.HOME ? (
              <LMQNAFeedPostFooter />
            ) : (
              <LMFeedModerationPostFooter propReport={propReport} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LMQNAFeedPosts;
