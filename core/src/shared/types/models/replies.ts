interface MenuItem {
  id: number;
  title: string;
}

export interface Reply {
  Id: string;
  commentsCount: number;
  communityId: number;
  createdAt: number;
  isEdited: boolean;
  isLiked: boolean;
  level: number;
  likesCount: number;
  menuItems: MenuItem[];
  postId: string;
  replies: Reply[];
  tempId: string;
  text: string;
  updatedAt: number;
  userId: string;
  uuid: string;
  parentComment?: Reply;
}
