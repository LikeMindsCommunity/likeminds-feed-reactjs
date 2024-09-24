import { AnalyticsCallback } from "./types/analyticsCallback";
import { Post } from "./types/models/post";
import { Reply } from "./types/models/replies";
import { Topic } from "./types/models/topic";

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
    ADD_MORE_ATTACHMENT_CLICKED: "add_more_attachment_clicked", //
    USER_TAGGED_IN_POST: "User tagged in a post", //
    LINK_ATTACHED_IN_POST: "link attached in the post",
    IMAGE_ATTACHED_TO_POST: "Image attached to post", //
    VIDEO_ATTACHED_TO_POST: "Video attached to post", //
    DOCUMENT_ATTACHED_TO_POST: "Document attached in post", //
    TOPICS_ADDED_IN_THE_POST: "Topics added in the post", //
    POST_CREATION_COMPLETED: "Post creation completed",
    POST_CREATION_ERROR: "Post creation error",
    POST_PINNED: "Post pinned",
    POST_UNPINNED: "Post unpinned",
    POST_REPORTED: "Post reported",
    POST_DELETED: "Post deleted",
    FEED_OPENED: "Feed opened",
    POST_LIKE_LIST_CLICK: "post_like_list_click", //
    COMMENT_LIKE_LIST_CLICK: "comment_like_list_click", //
    REPLY_LIKE_LIST_CLICK: "reply_like_list_click", //
    LIKE_LIST_OPEN: "Like list open",
    COMMENT_LIST_OPEN: "Comment list open",
    COMMENT_DELETED: "Comment deleted",
    COMMENT_REPORTED: "Comment reported",
    COMMENT_POSTED: "comment_posted",
    REPLY_POSTED: "reply_posted",
    REPLY_EDITED: "reply_edited", //
    REPLY_DELETED: "Reply deleted",
    REPLY_REPORTED: "Reply reported",
    POST_EDITED: "Post edited",
    POST_SHARED: "Post shared",
    POST_LIKED: "Post Liked",
    POST_UNLIKED: "post_unliked",
    POST_PROFILE_PIC_CLICK: "post_profile_pic_click", //
    POST_PROFILE_NAME_CLICK: "post_profile_name_click", //
    POST_MENU_CLICK: "post_menu_click", //
    POST_TOPIC_CLICK: "post_topic_click", //
    POST_COMMENT_CLICK: "post_comment_click", //
    COMMENT_PROFILE_PICTURE_CLICK: "comment_profile_picture_click", //
    COMMENT_PROFILE_NAME_CLICK: "comment_profile_name_click", //
    COMMENT_MENU_CLICK: "comment_menu_click", //
    REPLY_PROFILE_PICTURE_CLICK: "reply_profile_picture_click", //
    REPLY_PROFILE_NAME_CLICK: "reply_profile_name_click", //
    POST_SAVED: "Post Saved",
    POST_UNSAVED: "Post Unsaved",
    COMMENT_LIKED: "Comment Liked",
    COMMENT_UNLIKED: "Comment Unliked",
    COMMENT_EDITED: "comment_edited",
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
    this.callback(eventName, eventProperties);
  }
  sendAddMoreAttachmentClickedEvent(postId: string, type: string) {
    this.track(this.Events.ADD_MORE_ATTACHMENT_CLICKED, {
      post_id: postId,
      type: type,
    });
  }

  sendUserTaggedInPostEvent(uuid: string) {
    this.track(this.Events.USER_TAGGED_IN_POST, {
      tagged_user_uuid: uuid,
    });
  }

  sendImageAttachedToPostEvent(postId: string, imageCount: number) {
    this.track(this.Events.IMAGE_ATTACHED_TO_POST, {
      post_id: postId,
      image_count: imageCount.toString() || "",
    });
  }

  sendVideoAttachedToPostEvent(postId: string, imageCount: number) {
    this.track(this.Events.VIDEO_ATTACHED_TO_POST, {
      post_id: postId,
      video_count: imageCount.toString() || "",
    });
  }

  sendDocumentAttachedToPostEvent(postId: string, imageCount: number) {
    this.track(this.Events.DOCUMENT_ATTACHED_TO_POST, {
      post_id: postId,
      documnent_count: imageCount.toString() || "",
    });
  }

  sendTopicsAddedInThePostEvent(topics: Topic[], postId?: string) {
    const details: Record<string, string> = {
      post_topics: JSON.stringify(topics),
    };
    if (postId) {
      details["post_id"] = postId;
    }
    this.track(this.Events.TOPICS_ADDED_IN_THE_POST, details);
  }

  sendPostLikeListClickEvent(post: Post) {
    const details = {
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      post_created_by_uuid: post.uuid,
    };

    this.track(this.Events.POST_LIKE_LIST_CLICK, details);
  }

  sendCommentLikeListClickEvent() {
    this.track(this.Events.COMMENT_LIKE_LIST_CLICK);
  }

  sendReplyLikeListClickEvent() {
    this.track(this.Events.REPLY_LIKE_LIST_CLICK);
  }

  sendReplyEditedEvent(post: Post, comment: Reply, reply: Reply) {
    const details = {
      post_id: post?.id,
      comment_id: comment.id,
      comment_reply_id: reply?.id,
      post_topics: JSON.stringify(post.topics),
      post_created_by_uuid: post.uuid,
      comment_created_by_uuid: comment.uuid,
    };

    this.track(this.Events.REPLY_EDITED, details);
  }

  sendPostProfilePicClickEvent(post: Post) {
    const details = {
      // "post_type": post.att,
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
    };
    this.track(this.Events.POST_PROFILE_PIC_CLICK, details);
  }

  sendPostProfileNameClickEvent(post: Post) {
    const details = {
      // "post_type": post.att,
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
    };
    this.track(this.Events.POST_PROFILE_NAME_CLICK, details);
  }

  sendPostMenuClickEvent(post: Post) {
    const details = {
      // "post_type": "general",
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
    };
    this.track(this.Events.POST_MENU_CLICK, details);
  }

  sendPostTopicClickEvent(post: Post, topic: Topic) {
    const details = {
      // "post_type": "general",
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
      topic_clicked: "true",
      topic_id: topic?.id,
    };
    this.track(this.Events.POST_TOPIC_CLICK, details);
  }

  sendPostCommentClickEvent(post: Post) {
    const details = {
      // "post_type": "general",
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
      post_id: post?.id,
    };
    this.track(this.Events.POST_COMMENT_CLICK, details);
  }

  sendCommentProfilePictureClickEvent(post: Post, comment: Reply) {
    const details = {
      // "post_type": "general",
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
      comment_id: comment.id,
    };
    this.track(this.Events.COMMENT_PROFILE_PICTURE_CLICK, details);
  }

  sendCommentProfileNameClickEvent(post: Post, comment: Reply) {
    const details = {
      // "post_type": post?.id,
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
      comment_id: comment.id,
    };

    this.track(this.Events.COMMENT_PROFILE_NAME_CLICK, details);
  }

  sendCommentMenuClickEvent(post: Post, comment: Reply) {
    const details = {
      post_id: post?.id,
      comment_id: comment.id,
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
      // "post_type": ""
    };

    this.track(this.Events.COMMENT_MENU_CLICK, details);
  }

  sendReplyProfilePictureClickEvent() {
    this.track(this.Events.REPLY_PROFILE_PICTURE_CLICK);
  }

  sendReplyProfileNameClickEvent(post: Post, comment: Reply, reply: Reply) {
    const details = {
      post_id: post?.id,
      reply_id: reply?.id,
      comment_id: comment.id || "",
      // "post_type": "",
      post_topics: JSON.stringify(post.topics),
      created_by_uuid: post.uuid,
    };

    this.track(this.Events.REPLY_PROFILE_NAME_CLICK, details);
  }

  // /////////////////
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
    details["post_id"] = post?.id;
    details["created_by_uuid"] = post.uuid;
    details["topics"] = JSON.stringify(
      Object.values(topics).filter((topic) => post.topics.includes(topic?.id)),
    );

    this.track(this.Events.POST_LIKED, details);
  }

  sendPostUnLikedEvent(post: Post, topics: Record<string, Topic>) {
    const details: Record<string, string> = {};
    details["post_id"] = post?.id;
    details["created_by_uuid"] = post.uuid;
    details["topics"] = JSON.stringify(
      Object.values(topics).filter((topic) => post.topics.includes(topic?.id)),
    );

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
    details["post_id"] = post?.id;
    details["post_created_by_uuid"] = post.uuid;
    // details['post_type'] =
    // Ask what should be the post type
    details["post_topics"] = JSON.stringify(Object.values(topics));
    this.track(this.Events.POST_PINNED, details);
  }

  sendPostUnPinnedEvent(post: Post, topics: Record<string, Topic>) {
    const details: Record<string, string> = {};
    details["post_id"] = post?.id;
    details["post_created_by_uuid"] = post.uuid;
    // details['post_type'] =
    // Ask what should be the post type
    details["post_topics"] = JSON.stringify(Object.values(topics));
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
      [this.Keys.POST_ID]: post?.id,
    };
    if (
      post.attachments.some((attachment) => attachment.attachmentType === 4)
    ) {
      const targetAttachment = post.attachments.find(
        (att) => att.attachmentType === 4,
      );

      if (targetAttachment) {
        details["link_attached"] = targetAttachment?.attachmentMeta?.ogTags?.url || "";
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
      details["post_topics"] = JSON.stringify(post.topics);
    }
    this.track(this.Events.POST_CREATION_COMPLETED, details);
  }

  sendPostCreationErrorEvent(post: Post) {
    const details: Record<string, string> = {
      created_by_uuid: post.uuid,
      [this.Keys.POST_ID]: post?.id,
    };
    if (
      post.attachments.some((attachment) => attachment.attachmentType === 4)
    ) {
      const targetAttachment = post.attachments.find(
        (att) => att.attachmentType === 4,
      );

      if (targetAttachment) {
        details["link_attached"] = targetAttachment?.attachmentMeta?.ogTags?.url || "";
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
      details["post_topics"] = JSON.stringify(post.topics);
    }
    this.track(this.Events.POST_CREATION_ERROR, details);
  }

  sendPostEditedEvent(post: Post) {
    const details: Record<string, string> = {
      created_by_uuid: post.uuid,
      [this.Keys.POST_ID]: post?.id,
    };
    if (
      post.attachments.some((attachment) => attachment.attachmentType === 4)
    ) {
      const targetAttachment = post.attachments.find(
        (att) => att.attachmentType === 4,
      );

      if (targetAttachment) {
        details["link_attached"] = targetAttachment?.attachmentMeta?.ogTags?.url || "";
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
      details["post_topics"] = JSON.stringify(post.topics);
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
    (details["post_topics"] = JSON.stringify(
      Object.values(topics).filter((topic) => post.topics.includes(topic?.id)),
    )),
      (details["post_created_by_uuid"] = post.uuid);
    details["post_id"] = post?.id;
    // Ask what is post_type
    this.track(this.Events.POST_DELETED, details);
  }

  sendCommentDeletedEvent(
    post: Post,
    comment: Reply,
    topics: Record<string, Topic>,
  ) {
    const details: Record<string, string> = {};
    details["post_id"] = post?.id;
    details["comment_id"] = comment.id;
    details["post_topics"] = JSON.stringify(
      Object.values(topics).filter((topic) => post.topics.includes(topic?.id)),
    );
    details["post_created_by_uuid"] = post.uuid;
    details["comment_created_by_uuid"] = comment.uuid;
    this.track(this.Events.COMMENT_DELETED, details);
  }
  sendReplyDeletedEvent(
    post: Post,
    parentReply: Reply,
    deletedReplyId: string,
  ) {
    const details = {
      post_id: post?.id,
      comment_id: parentReply?.id,
      comment_reply_id: deletedReplyId,
      post_created_by_uuid: post.uuid,
      comment_created_by_uuid: parentReply?.id,
    };
    this.track(this.Events.REPLY_DELETED, details);
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

  sendCommentPostedEvent(comment: Reply) {
    const details = {
      post_id: comment.postId,
      comment_id: comment.id,
      comment_created_by_uuid: comment.uuid,
    };
    this.track(this.Events.COMMENT_POSTED, details);
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

  sendCommentEditedEvent(post: Post, comment: Reply) {
    const details = {
      post_id: post?.id,
      comment_id: comment.id,
      post_topics: JSON.stringify(post.topics),
      post_created_by_uuid: post.uuid,
      comment_created_by_uuid: comment.uuid,
    };

    this.track(this.Events.COMMENT_EDITED, details);
  }

  sendPostReportedEvent(post: Post, reason: string) {
    const details = {
      post_topics: JSON.stringify(post.topics),
      post_created_by_uuid: post.uuid,
      post_id: post?.id,
      report_reason: reason,
    };
    this.track(this.Events.POST_REPORTED, details);
  }

  sendCommentReportedEvent(post: Post, comment: Reply, reason: string) {
    const details = {
      post_id: post?.id,
      post_topics: JSON.stringify(post.topics),
      post_created_by_uuid: post.uuid,
      comment_created_by_uuid: comment.uuid,
      comment_id: comment.id,
      reason: reason,
    };
    this.track(this.Events.COMMENT_REPORTED, details);
  }

  sendReplyReportedEvent(
    post: Post,
    comment: Reply,
    reply: Reply,
    reason: string,
  ) {
    const details = {
      post_id: post?.id,
      comment_id: comment.id,
      comment_reply_id: reply?.id,
      post_topics: JSON.stringify(post.topics),
      post_created_by_uuid: post.uuid,
      comment_created_by_uuid: comment.uuid,
      reason: reason,
    };
    this.track(this.Events.REPLY_REPORTED, details);
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
