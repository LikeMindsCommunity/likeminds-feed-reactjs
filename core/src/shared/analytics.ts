import { AnalyticsCallback } from "./types/analyticsCallback";
import { Post } from "./types/models/post";
import { Reply } from "./types/models/replies";
import { Topic } from "./types/models/topic";

// class LMFeedAnalytics {
//   private lmFeedClient: LMFeedClient;
//   constructor(lmFeedClient: LMFeedClient) {
//     this.lmFeedClient = lmFeedClient;
//   }
//   static EVENTS = class {
//     POST_CREATION_STARTED = "Post creation started";
//     CLICKED_ON_ATTACHMENT = "Clicked on Attachment";
//     USER_TAGGED_IN_POST = "User tagged in a post";
//     LINK_ATTACHED_IN_POST = "link attached in the post";
//     IMAGE_ATTACHED_TO_POST = "Image attached to post";
//     VIDEO_ATTACHED_TO_POST = "Video attached to post";
//     DOCUMENT_ATTACHED_TO_POST = "Document attached in post";
//     POST_CREATION_COMPLETED = "Post creation completed";
//     POST_PINNED = "Post pinned";
//     POST_UNPINNED = "Post unpinned";
//     POST_REPORTED = "Post reported";
//     POST_DELETED = "Post deleted";
//     FEED_OPENED = "Feed opened";
//     LIKE_LIST_OPEN = "Like list open";
//     COMMENT_LIST_OPEN = "Comment list open";
//     COMMENT_DELETED = "Comment deleted";
//     COMMENT_REPORTED = "Comment reported";
//     COMMENT_POSTED = "Comment posted";
//     REPLY_POSTED = "Reply posted";
//     REPLY_DELETED = "Reply deleted";
//     REPLY_REPORTED = "Reply reported";
//     POST_EDITED = "Post edited";
//     POST_SHARED = "Post shared";
//     POST_LIKED = "Post Liked";
//     POST_UNLIKED = "Post Unliked";
//     POST_SAVED = "Post Saved";
//     POST_UNSAVED = "Post Unsaved";
//     COMMENT_LIKED = "Comment Liked";
//     COMMENT_UNLIKED = "Comment Unliked";
//     COMMENT_EDITED = "Comment edited";

//     NOTIFICATION_RECEIVED = "Notification Received";
//     NOTIFICATION_CLICKED = "Notification Clicked";

//     NOTIFICATION_PAGE_OPENED = "Notification page opened";
//   };

// }
// lmFeedAnalytics.ts

interface LMFeedPostViewData {
  id: string;
  viewType: string;
  headerViewData: {
    isPinned: boolean;
    user: {
      sdkClientInfoViewData: {
        uuid: string;
      };
    };
  };
}

interface LMFeedCommentViewData {
  id: string;
  level: number;
  user: {
    sdkClientInfoViewData: {
      uuid: string;
    };
  };
}

class LMFeedAnalytics {
  private callback: AnalyticsCallback;
  constructor(callback: AnalyticsCallback) {
    this.callback = callback;
  }
  LOG_TAG = "LMFeedAnalytics";

  // Event names
  Events = {
    POST_CREATION_STARTED: "Post creation started",
    CLICKED_ON_ATTACHMENT: "Clicked on Attachment",
    USER_TAGGED_IN_POST: "User tagged in a post",
    LINK_ATTACHED_IN_POST: "link attached in the post",
    IMAGE_ATTACHED_TO_POST: "Image attached to post",
    VIDEO_ATTACHED_TO_POST: "Video attached to post",
    DOCUMENT_ATTACHED_TO_POST: "Document attached in post",
    POST_CREATION_COMPLETED: "Post creation completed",
    POST_CREATION_ERROR: "Post creation error",
    POST_PINNED: "Post pinned",
    POST_UNPINNED: "Post unpinned",
    POST_REPORTED: "Post reported",
    POST_DELETED: "Post deleted",
    FEED_OPENED: "Feed opened",
    LIKE_LIST_OPEN: "Like list open",
    COMMENT_LIST_OPEN: "Comment list open",
    COMMENT_DELETED: "Comment deleted",
    COMMENT_REPORTED: "Comment reported",
    COMMENT_POSTED: "Comment posted",
    REPLY_POSTED: "Reply posted",
    REPLY_DELETED: "Reply deleted",
    REPLY_REPORTED: "Reply reported",
    POST_EDITED: "Post edited",
    POST_SHARED: "Post shared",
    POST_LIKED: "Post Liked",
    POST_UNLIKED: "Post Unliked",
    POST_SAVED: "Post Saved",
    POST_UNSAVED: "Post Unsaved",
    COMMENT_LIKED: "Comment Liked",
    COMMENT_UNLIKED: "Comment Unliked",
    COMMENT_EDITED: "Comment edited",
    NOTIFICATION_RECEIVED: "Notification Received",
    NOTIFICATION_CLICKED: "Notification Clicked",
    NOTIFICATION_PAGE_OPENED: "Notification page opened",
  };

  // Event keys
  Keys = {
    POST_ID: "post_id",
    UUID: "uuid",
    COMMENT_ID: "comment_id",
    COMMENT_REPLY_ID: "comment_reply_id",
    POST_TYPE_TEXT: "text",
    POST_TYPE_IMAGE: "image",
    POST_TYPE_VIDEO: "video",
    POST_TYPE_IMAGE_VIDEO: "image,video",
    POST_TYPE_DOCUMENT: "document",
    POST_TYPE_LINK: "link",
  };

  // Source keys
  Source = {
    DEEP_LINK: "deep_link",
    NOTIFICATION: "notification",
    UNIVERSAL_FEED: "universal_feed",
    POST_DETAIL: "post_detail",
  };

  track(eventName: string, eventProperties: Record<string, string> = {}) {
    console.log(`
            eventName: ${eventName}
            eventProperties: ${JSON.stringify(eventProperties)}
        `);

    this.callback(eventName, eventProperties);
  }

  sendFeedOpenedEvent() {
    this.track(this.Events.FEED_OPENED, {
      feed_type: "universal_feed",
    });
  }

  sendPostCreationStartedEvent() {
    this.track(this.Events.POST_CREATION_STARTED);
  }

  sendClickedOnAttachmentEvent(postId: string | null, type: string) {
    const eventDetails: Record<string, string> = {
      type: type,
    };
    if (postId) {
      eventDetails["post_id"] = postId;
    }
    this.track(this.Events.CLICKED_ON_ATTACHMENT, eventDetails);
  }

  sendPostLikedEvent(post: Post, topics: Record<string, Topic>) {
    const details: Record<string, string> = {};
    details["post_id"] = post.Id;
    details["created_by_uuid"] = post.uuid;
    details["topics"] = Object.values(topics)
      .filter((topic) => post.topics.includes(topic.Id))
      .toString();

    this.track(this.Events.POST_LIKED, details);
  }

  sendPostUnLikedEvent(post: Post, topics: Record<string, Topic>) {
    const details: Record<string, string> = {};
    details["post_id"] = post.Id;
    details["created_by_uuid"] = post.uuid;
    details["topics"] = Object.values(topics)
      .filter((topic) => post.topics.includes(topic.Id))
      .toString();

    this.track(this.Events.POST_UNLIKED, details);
  }

  sendPostSavedEvent(uuid: string, postId: string, postSaved: boolean) {
    const event = postSaved ? this.Events.POST_SAVED : this.Events.POST_UNSAVED;

    this.track(event, {
      [this.Keys.UUID]: uuid,
      [this.Keys.POST_ID]: postId,
    });
  }

  sendPostPinnedEvent(post: Post, topics: Record<string, Topic>) {
    const details: Record<string, string> = {};
    details["post_id"] = post.Id;
    details["post_created_by_uuid"] = post.uuid;
    // details['post_type'] =
    // Ask what should be the post type
    details["post_topics"] = Object.values(topics).toString();
    this.track(this.Events.POST_PINNED, details);
  }

  sendPostUnPinnedEvent(post: Post, topics: Record<string, Topic>) {
    const details: Record<string, string> = {};
    details["post_id"] = post.Id;
    details["post_created_by_uuid"] = post.uuid;
    // details['post_type'] =
    // Ask what should be the post type
    details["post_topics"] = Object.values(topics).toString();
    this.track(this.Events.POST_UNPINNED, details);
  }

  sendCommentListOpenEvent() {
    this.track(this.Events.COMMENT_LIST_OPEN);
  }

  sendPostShared(post: LMFeedPostViewData) {
    const postType = LMFeedViewUtils.getPostTypeFromViewType(post.viewType);
    const postCreatorUUID = post.headerViewData.user.sdkClientInfoViewData.uuid;

    this.track(this.Events.POST_SHARED, {
      created_by_uuid: postCreatorUUID,
      [this.Keys.POST_ID]: post.id,
      post_type: postType,
    });
  }

  sendPostCreatedEvent(post: Post) {
    const details: Record<string, string> = {
      created_by_uuid: post.uuid,
      [this.Keys.POST_ID]: post.Id,
    };
    if (
      post.attachments.some((attachment) => attachment.attachmentType === 4)
    ) {
      const targetAttachment = post.attachments.find(
        (att) => att.attachmentType === 4,
      );

      if (targetAttachment) {
        details["link_attached"] = targetAttachment?.attachmentMeta.ogTags.url;
      }
    }
    const imageCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 1 ? true : false,
    ).length;
    const videoCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 2 ? true : false,
    ).length;
    const docCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 3 ? true : false,
    ).length;
    if (imageCount) {
      details["image_count"] = imageCount.toString();
    }
    if (videoCount) {
      details["video_count"] = videoCount.toString();
    }
    if (docCount) {
      details["document_count"] = docCount.toString();
    }
    if (post.topics.length) {
      details["post_topics"] = post.topics.toString();
    }
    this.track(this.Events.POST_CREATION_COMPLETED, details);
  }

  sendPostCreationErrorEvent(post: Post) {
    const details: Record<string, string> = {
      created_by_uuid: post.uuid,
      [this.Keys.POST_ID]: post.Id,
    };
    if (
      post.attachments.some((attachment) => attachment.attachmentType === 4)
    ) {
      const targetAttachment = post.attachments.find(
        (att) => att.attachmentType === 4,
      );

      if (targetAttachment) {
        details["link_attached"] = targetAttachment?.attachmentMeta.ogTags.url;
      }
    }
    const imageCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 1 ? true : false,
    ).length;
    const videoCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 2 ? true : false,
    ).length;
    const docCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 3 ? true : false,
    ).length;
    if (imageCount) {
      details["image_count"] = imageCount.toString();
    }
    if (videoCount) {
      details["video_count"] = videoCount.toString();
    }
    if (docCount) {
      details["document_count"] = docCount.toString();
    }
    if (post.topics.length) {
      details["post_topics"] = post.topics.toString();
    }
    this.track(this.Events.POST_CREATION_ERROR, details);
  }

  sendPostEditedEvent(post: Post) {
    const details: Record<string, string> = {
      created_by_uuid: post.uuid,
      [this.Keys.POST_ID]: post.Id,
    };
    if (
      post.attachments.some((attachment) => attachment.attachmentType === 4)
    ) {
      const targetAttachment = post.attachments.find(
        (att) => att.attachmentType === 4,
      );

      if (targetAttachment) {
        details["link_attached"] = targetAttachment?.attachmentMeta.ogTags.url;
      }
    }
    const imageCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 1 ? true : false,
    ).length;
    const videoCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 2 ? true : false,
    ).length;
    const docCount = post.attachments.filter((attachment) =>
      attachment.attachmentType === 3 ? true : false,
    ).length;
    if (imageCount) {
      details["image_count"] = imageCount.toString();
    }
    if (videoCount) {
      details["video_count"] = videoCount.toString();
    }
    if (docCount) {
      details["document_count"] = docCount.toString();
    }
    if (post.topics.length) {
      details["post_topics"] = post.topics.toString();
    }
    this.track(this.Events.POST_EDITED, details);
  }

  sendLinkAttachedEvent(link: string, postId?: string) {
    if (postId) {
      this.track(this.Events.LINK_ATTACHED_IN_POST, {
        link: link,
        post_id: postId,
      });
    } else {
      this.track(this.Events.LINK_ATTACHED_IN_POST, {
        link: link,
      });
    }
  }

  sendPostDeletedEvent(
    post: Post,
    topics: Record<string, Topic>,
    userState: string,
  ) {
    const details: Record<string, string> = {};
    details["user_state"] = userState;
    (details["post_topics"] = Object.values(topics)
      .filter((topic) => post.topics.includes(topic.Id))
      .toString()),
      (details["post_created_by_uuid"] = post.uuid);
    details["post_id"] = post.Id;
    // Ask what is post_type
    this.track(this.Events.POST_DELETED, details);
  }

  sendCommentDeletedEvent(
    post: Post,
    comment: Reply,
    topics: Record<string, Topic>,
  ) {
    const details: Record<string, string> = {};
    details["post_id"] = post.Id;
    details["comment_id"] = comment.Id;
    details["post_topics"] = Object.values(topics)
      .filter((topic) => post.topics.includes(topic.Id))
      .toString();
    details["post_created_by_uuid"] = post.uuid;
    details["comment_created_by_uuid"] = comment.uuid;
    this.track(this.Events.COMMENT_DELETED, details);
  }

  sendCommentReplyDeletedEvent(
    postId: string,
    commentId: string,
    parentCommentId?: string,
  ) {
    if (!parentCommentId) {
      this.track(this.Events.COMMENT_DELETED, {
        [this.Keys.POST_ID]: postId,
        [this.Keys.COMMENT_ID]: commentId,
      });
    } else {
      this.track(this.Events.REPLY_DELETED, {
        [this.Keys.POST_ID]: postId,
        [this.Keys.COMMENT_ID]: parentCommentId,
        [this.Keys.COMMENT_REPLY_ID]: commentId,
      });
    }
  }

  sendReplyPostedEvent(
    parentCommentCreatorUUID: string,
    postId: string,
    parentCommentId: string,
    commentId: string,
  ) {
    this.track(this.Events.REPLY_POSTED, {
      [this.Keys.UUID]: parentCommentCreatorUUID,
      [this.Keys.POST_ID]: postId,
      [this.Keys.COMMENT_ID]: parentCommentId,
      [this.Keys.COMMENT_REPLY_ID]: commentId,
    });
  }

  sendCommentPostedEvent(postId: string, commentId: string) {
    this.track(this.Events.COMMENT_POSTED, {
      [this.Keys.POST_ID]: postId,
      [this.Keys.COMMENT_ID]: commentId,
    });
  }

  sendCommentLikedEvent(
    postId: string,
    commentId: string,
    commentLiked: boolean,
    loggedInUUID: string,
  ) {
    const event = commentLiked
      ? this.Events.COMMENT_LIKED
      : this.Events.COMMENT_UNLIKED;

    this.track(event, {
      [this.Keys.UUID]: loggedInUUID,
      [this.Keys.POST_ID]: postId,
      [this.Keys.COMMENT_ID]: commentId,
    });
  }

  sendCommentEditedEvent(comment: LMFeedCommentViewData) {
    this.track(this.Events.COMMENT_EDITED, {
      created_by_uuid: comment.user.sdkClientInfoViewData.uuid,
      [this.Keys.COMMENT_ID]: comment.id,
      level: comment.level.toString(),
    });
  }

  sendPostReportedEvent(
    postId: string,
    uuid: string,
    postType: string,
    reason: string,
  ) {
    this.track(this.Events.POST_REPORTED, {
      created_by_uuid: uuid,
      [this.Keys.POST_ID]: postId,
      report_reason: reason,
      post_type: postType,
    });
  }

  sendCommentReportedEvent(
    postId: string,
    uuid: string,
    commentId: string,
    reason: string,
  ) {
    this.track(this.Events.COMMENT_REPORTED, {
      [this.Keys.POST_ID]: postId,
      [this.Keys.UUID]: uuid,
      [this.Keys.COMMENT_ID]: commentId,
      reason: reason,
    });
  }

  sendReplyReportedEvent(
    postId: string,
    uuid: string,
    parentCommentId: string | null,
    replyId: string,
    reason: string,
  ) {
    const updatedParentId = parentCommentId ?? "";

    this.track(this.Events.REPLY_REPORTED, {
      [this.Keys.POST_ID]: postId,
      [this.Keys.COMMENT_ID]: updatedParentId,
      [this.Keys.COMMENT_REPLY_ID]: replyId,
      [this.Keys.UUID]: uuid,
      reason: reason,
    });
  }

  sendLikeListOpenEvent(postId: string, commentId?: string) {
    const map: { [key: string]: string } = {};
    map[this.Keys.POST_ID] = postId;
    if (commentId) {
      map[this.Keys.COMMENT_ID] = commentId;
    }
    this.track(this.Events.LIKE_LIST_OPEN, map);
  }

  sendNotificationPageOpenedEvent() {
    this.track(this.Events.NOTIFICATION_PAGE_OPENED);
  }

  sendUserTagEvent(uuid: string, userCount: number) {
    this.track(this.Events.USER_TAGGED_IN_POST, {
      tagged_user_uuid: uuid,
      tagged_user_count: userCount.toString(),
    });
  }
}

const LMFeedViewUtils = {
  getPostTypeFromViewType: (viewType: string) => viewType, // Simplified for this example
};

export { LMFeedAnalytics };
export type { LMFeedPostViewData, LMFeedCommentViewData };
