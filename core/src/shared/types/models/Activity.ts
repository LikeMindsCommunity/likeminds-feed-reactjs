import { Attachment } from "./attachment";

export interface Activity {
  Id: string;
  action: number;
  actionBy: string[];
  actionOn: string;
  activityEntityData: ActivityEntityData;
  activityText: string;
  createdAt: number;
  cta: string;
  entityId: string;
  entityOwnerId: string;
  entityType: number;
  isRead: boolean;
  updatedAt: number;
  uuid: string;
}
export interface ActivityEntityData {
  Id: string;
  attachments: Attachment[];
  commentIds: null;
  commentsCount: number;
  communityId: number;
  createdAt: number;
  deleteReason?: string;
  deletedBy?: string;
  deletedByUuid?: string;
  heading: string;
  isDeleted?: boolean;
  isEdited: boolean;
  isLiked: boolean;
  isPinned: boolean;
  isRepost: boolean;
  isRepostedByUser: boolean;
  isSaved: boolean;
  likesCount: number;
  menuItems: {
    id: number;
    title: string;
  }[];
  repostCount: number;
  tempId: string | null;
  text: string;
  topics: string[];
  updatedAt: number;
  userId: string;
  uuid: string;
}
