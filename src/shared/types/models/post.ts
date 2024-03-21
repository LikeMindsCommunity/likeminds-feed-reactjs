import { Attachment } from "./attachment";
import { Reply } from "./replies";

export interface Post {
  Id: string;
  attachments: Attachment[];
  commentsCount: number;
  communityId: number;
  createdAt: number;
  heading: string;
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
  tempId: null | string;
  text: string;
  topics: string[];
  updatedAt: number;
  userId: string;
  uuid: string;
  replies?: Reply[];
}
