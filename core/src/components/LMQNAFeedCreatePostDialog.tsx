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
import { LMTopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { Divider } from "@mui/material";
import { LMFeedOGTagMediaItem } from "./LMFeedOgTagMediaItem";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";
import { ASK_QUESTION, EDIT_POST } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
interface LMFeedCreatePostDialogProps {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMQNAFeedCreatePostDialog = ({}: LMFeedCreatePostDialogProps) => {
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
    setOpenCreatePostDialog,
    createPostComponentClickCustomCallback,
    ogTag,
    question,
    setQuestionText,
  } = useContext(LMFeedCreatePostContext);
  const { CustomComponents = {} } = useContext(CustomAgentProviderContext);
  const { CustomTopicDropDown } = CustomComponents;

  return (
    <div
      className="lm-feed-create-post-wrapper"
      onClick={(e) => {
        if (createPostComponentClickCustomCallback) {
          createPostComponentClickCustomCallback(e);
        }
      }}
    >
      <div className="lm-feed-create-post-wrapper__dialog-heading">
        {temporaryPost ? EDIT_POST : ASK_QUESTION}
        <img
          src={cancelModelMcon}
          alt="cancelModelMcon"
          onClick={() => {
            if (setOpenCreatePostDialog) {
              setOpenCreatePostDialog(false);
            }
          }}
          className="cancelIcon"
        />
      </div>
      <div className="lm-feed-create-post-wrapper__user-meta">
        <div className="lm-avatar lm-mr-4">
          {getAvatar({
            imageUrl: currentUser?.imageUrl,
            name: currentUser?.name,
          })}
        </div>
        <div>{currentUser?.name}</div>
      </div>
      {CustomTopicDropDown || (
        <LMFeedViewTopicDropdown
          mode={
            temporaryPost
              ? LMTopicsDropdownMode.edit
              : LMTopicsDropdownMode.modify
          }
          setSelectedTopicsIds={setSelectedTopicIds}
          selectedTopicIds={selectedTopicIds}
          preSelectedTopics={preSelectedTopics}
          setPreSelectedTopics={setPreSelectedTopics}
        />
      )}
      <Divider
        sx={{
          borderColor: "#FFF",
        }}
        className="lm-feed-create-post-topic-text-area-divider"
      />
      <div className="lm-textarea">
        <input
          type="text"
          className="lm-feed-create-post-text-box"
          placeholder="Add your question here..."
          onChange={(e) => {
            if (setQuestionText) {
              setQuestionText(e.target.value);
            }
          }}
          value={question!}
        />
      </div>
      <div className="lm-textarea">
        {CustomComponents.CustomCreatePostTextArea || <LMFeedTextArea />}
      </div>

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

export default LMQNAFeedCreatePostDialog;
