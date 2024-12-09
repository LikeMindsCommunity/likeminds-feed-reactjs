import React, { useContext } from "react";
import { getAvatar } from "../shared/components/LMUserMedia";
import LMFeedTextArea from "../shared/components/LMFeedTextArea";
import LMFeedMediaUpload from "./LMFeedMediaUpload";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import LMFeedCreatePostAttachmentController from "../shared/components/LMFeedCreatePostAttachmentController";
import LMFeedCreatePostSubmitButton from "../shared/components/LMFeedCreatePostSubmitButton";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import LMFeedCreateEditPostMediaRenderer from "./LMFeedCreateEditPostMediaRenderer";
import LMFeedViewTopicDropdown from "./lmTopicFeed/LMFeedViewTopicDropdown";
import { LMTopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { Checkbox, Divider } from "@mui/material";
import { LMFeedOGTagMediaItem } from "./LMFeedOgTagMediaItem";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { changePostCase } from "../shared/utils";
import { WordAction } from "../shared/enums/wordAction";

interface LMFeedCreatePostDialogProps {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMFeedCreatePostDialog = ({ }: LMFeedCreatePostDialogProps) => {
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
    isAnonymousPost,
    changeAnonymousPostStatus,
  } = useContext(LMFeedCreatePostContext);
  const {
    CustomComponents = {},
    isAnonymousPostAllowed,
    hintTextForAnonymous,
  } = useContext(CustomAgentProviderContext);
  const { CustomTopicDropDown } = CustomComponents;

  const renderAnonymousOption = () => {
    if (isAnonymousPostAllowed && !temporaryPost) {
      return (
        <>
          <div className="lm-feed-create-post-anonymous-post">
            <Checkbox
              checked={isAnonymousPost}
              className="anonymous-post-checkbox"
              onChange={changeAnonymousPostStatus}
            />
            <span className="anonymous-post-text">
              {hintTextForAnonymous || "Post this anonymously"}
            </span>
          </div>
        </>
      );
    }
  };

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
        {temporaryPost
          ? `Edit ${changePostCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`
          : `Create ${changePostCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`}
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
      {renderAnonymousOption()}
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
        {CustomComponents.CustomCreatePostTextArea || <LMFeedTextArea />}
      </div>

      {showOGTagViewContainer &&
        ogTag &&
        mediaUploadMode === LMFeedCreatePostMediaUploadMode.NULL &&
        !mediaList?.length ? (
        <LMFeedOGTagMediaItem />
      ) : null}

      <LMFeedCreateEditPostMediaRenderer />
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
