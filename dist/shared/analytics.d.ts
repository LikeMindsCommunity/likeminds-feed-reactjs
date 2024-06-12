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
declare class LMFeedAnalytics {
    private callback;
    constructor(callback: AnalyticsCallback);
    LOG_TAG: string;
    Events: {
        POST_CREATION_STARTED: string;
        CLICKED_ON_ATTACHMENT: string;
        USER_TAGGED_IN_POST: string;
        LINK_ATTACHED_IN_POST: string;
        IMAGE_ATTACHED_TO_POST: string;
        VIDEO_ATTACHED_TO_POST: string;
        DOCUMENT_ATTACHED_TO_POST: string;
        POST_CREATION_COMPLETED: string;
        POST_CREATION_ERROR: string;
        POST_PINNED: string;
        POST_UNPINNED: string;
        POST_REPORTED: string;
        POST_DELETED: string;
        FEED_OPENED: string;
        LIKE_LIST_OPEN: string;
        COMMENT_LIST_OPEN: string;
        COMMENT_DELETED: string;
        COMMENT_REPORTED: string;
        COMMENT_POSTED: string;
        REPLY_POSTED: string;
        REPLY_DELETED: string;
        REPLY_REPORTED: string;
        POST_EDITED: string;
        POST_SHARED: string;
        POST_LIKED: string;
        POST_UNLIKED: string;
        POST_SAVED: string;
        POST_UNSAVED: string;
        COMMENT_LIKED: string;
        COMMENT_UNLIKED: string;
        COMMENT_EDITED: string;
        NOTIFICATION_RECEIVED: string;
        NOTIFICATION_CLICKED: string;
        NOTIFICATION_PAGE_OPENED: string;
    };
    Keys: {
        POST_ID: string;
        UUID: string;
        COMMENT_ID: string;
        COMMENT_REPLY_ID: string;
        POST_TYPE_TEXT: string;
        POST_TYPE_IMAGE: string;
        POST_TYPE_VIDEO: string;
        POST_TYPE_IMAGE_VIDEO: string;
        POST_TYPE_DOCUMENT: string;
        POST_TYPE_LINK: string;
    };
    Source: {
        DEEP_LINK: string;
        NOTIFICATION: string;
        UNIVERSAL_FEED: string;
        POST_DETAIL: string;
    };
    track(eventName: string, eventProperties?: Record<string, string>): void;
    sendFeedOpenedEvent(): void;
    sendPostCreationStartedEvent(): void;
    sendClickedOnAttachmentEvent(postId: string | null, type: string): void;
    sendPostLikedEvent(post: Post, topics: Record<string, Topic>): void;
    sendPostUnLikedEvent(post: Post, topics: Record<string, Topic>): void;
    sendPostSavedEvent(uuid: string, postId: string, postSaved: boolean): void;
    sendPostPinnedEvent(post: Post, topics: Record<string, Topic>): void;
    sendPostUnPinnedEvent(post: Post, topics: Record<string, Topic>): void;
    sendCommentListOpenEvent(): void;
    sendPostShared(post: LMFeedPostViewData): void;
    sendPostCreatedEvent(post: Post): void;
    sendPostCreationErrorEvent(post: Post): void;
    sendPostEditedEvent(post: Post): void;
    sendLinkAttachedEvent(link: string, postId?: string): void;
    sendPostDeletedEvent(post: Post, topics: Record<string, Topic>, userState: string): void;
    sendCommentDeletedEvent(post: Post, comment: Reply, topics: Record<string, Topic>): void;
    sendCommentReplyDeletedEvent(postId: string, commentId: string, parentCommentId?: string): void;
    sendReplyPostedEvent(parentCommentCreatorUUID: string, postId: string, parentCommentId: string, commentId: string): void;
    sendCommentPostedEvent(postId: string, commentId: string): void;
    sendCommentLikedEvent(postId: string, commentId: string, commentLiked: boolean, loggedInUUID: string): void;
    sendCommentEditedEvent(comment: LMFeedCommentViewData): void;
    sendPostReportedEvent(postId: string, uuid: string, postType: string, reason: string): void;
    sendCommentReportedEvent(postId: string, uuid: string, commentId: string, reason: string): void;
    sendReplyReportedEvent(postId: string, uuid: string, parentCommentId: string | null, replyId: string, reason: string): void;
    sendLikeListOpenEvent(postId: string, commentId?: string): void;
    sendNotificationPageOpenedEvent(): void;
    sendUserTagEvent(uuid: string, userCount: number): void;
}
export { LMFeedAnalytics };
export type { LMFeedPostViewData, LMFeedCommentViewData };
