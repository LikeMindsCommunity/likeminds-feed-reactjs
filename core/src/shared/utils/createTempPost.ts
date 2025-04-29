interface CreateTempPostParams {
  textContent: string;
  attachments: any[];
  selectedTopicIds: string[];
  isAnonymousPost: boolean;
  question?: string;
  tempId: string;
  uuid: string;
}

export const createTempPost = ({
  textContent,
  attachments,
  selectedTopicIds,
  isAnonymousPost,
  question = "",
  tempId,
  uuid,
}: CreateTempPostParams) => {
  const currentTime = Date.now();
  
  return {
    id: tempId,
    text: textContent,
    attachments,
    topics: selectedTopicIds,
    isAnonymous: isAnonymousPost,
    heading: question,
    createdAt: currentTime,
    commentsCount: 0,
    isEdited: false,
    isLiked: false,
    isPinned: false,
    isRepost: false,
    isRepostedByUser: false,
    isSaved: false,
    likesCount: 0,
    menuItems: [],
    repostCount: 0,
    tempId: null,
    updatedAt: currentTime,
    uuid,
    isHidden: false,
  };
};
