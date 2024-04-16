import React, { useContext } from "react";
import { getAvatar } from "../shared/components/LMUserMedia";
import LMFeedTextArea from "../shared/components/LMFeedTextArea";
import LMFeedMediaUpload from "./LMFeedMediaUpload";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import LMFeedCreatePostAttachmentController from "../shared/components/LMFeedCreatePostAttachmentController";
import LMFeedCreatePostSubmitButton from "../shared/components/LMFeedCreatePostSubmitButton";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import LMFeedCreateMediaPost from "./LMFeedCreateMediaPost";
import LMFeedViewTopicDropdown from "./lmTopicFeed/LMFeedViewTopicDropdown";
import { TopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { Divider } from "@mui/material";
import { LMFeedOGTagMediaItem } from "./LMFeedOgTagMediaItem";
interface LMFeedCreatePostDialogProps {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMFeedCreatePostDialog = ({}: LMFeedCreatePostDialogProps) => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const {
    mediaUploadMode = "NULL",
    setSelectedTopicIds,
    selectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    mediaList,
    temporaryPost,
    showOGTagViewContainer,

    ogTag,
  } = useContext(LMFeedCreatePostContext);
  return (
    <div className="lm-feed-create-post-wrapper">
      <div className="lm-feed-create-post-wrapper__dialog-heading">
        Create Post
      </div>
      <div className="lm-feed-create-post-wrapper__user-meta">
        {getAvatar({
          imageUrl: currentUser?.imageUrl,
          name: currentUser?.name,
        })}
        <span>{currentUser?.name}</span>
      </div>
      <LMFeedViewTopicDropdown
        mode={TopicsDropdownMode.modify}
        setSelectedTopicsIds={setSelectedTopicIds}
        selectedTopicIds={selectedTopicIds}
        preSelectedTopics={preSelectedTopics}
        setPreSelectedTopics={setPreSelectedTopics}
      />
      <Divider className="lm-feed-create-post-topic-text-area-divider" />
      <LMFeedTextArea />
      {showOGTagViewContainer &&
      ogTag &&
      mediaUploadMode === LMFeedCreatePostMediaUploadMode.NULL &&
      !mediaList?.length ? (
        <LMFeedOGTagMediaItem />
      ) : null}
      <LMFeedCreateMediaPost />
      {mediaUploadMode !== LMFeedCreatePostMediaUploadMode.NULL &&
      !temporaryPost &&
      !mediaList?.length ? (
        <LMFeedMediaUpload />
      ) : null}
      {!temporaryPost && <LMFeedCreatePostAttachmentController />}
      <LMFeedCreatePostSubmitButton />
    </div>
  );
};

export default LMFeedCreatePostDialog;
