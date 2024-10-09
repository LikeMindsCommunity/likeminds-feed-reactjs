import Video from "./assets/VideoCamera.svg";

interface CustomCreatePostInitiateViewProps {
  setOpenCreatePostDialog: (value: boolean) => void;
  changeMediaUploadMode: (mode: LMFeedCreatePostMediaUploadMode) => void;
}
const getAvatar = (imageUrl: string | null, name: string) => {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt="avatar"
      loading="lazy"
      lm-feed-component-id={`lm-feed-user-avatar-opqrs-${imageUrl}`}
    />
  ) : (
    <div
      lm-feed-component-id={`lm-feed-post-wrapper-tuvwx-${imageUrl}`}
      className="avatar-initials lm-flex-container lm-justify-content-center lm-align-items-center"
    >
      {name ? name.substring(0, 1) : ""}
    </div>
  );
};
export const CustomCreatePostInitiateView = ({
  setOpenCreatePostDialog,
  changeMediaUploadMode,
}: CustomCreatePostInitiateViewProps) => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const avatar = getAvatar(
    currentUser?.imageUrl || null,
    currentUser?.name || ""
  );
  return (
    <>
      <div
        className="lm-create-post-btn"
        onClick={() => {
          setOpenCreatePostDialog(true);
        }}
      >
        {/* <img src={createPostIcon} alt="createPostIcon" /> */}
        New Post
      </div>
      <div className="lm-createPost">
        <div className="lm-createPost__media">
          <div className="lm-createPost__media__imgBox lm-avatar">
            {/* <img src={user} alt="user photo" /> */}
            {avatar}
          </div>
          <div
            onClick={() => {
              setOpenCreatePostDialog(true);
            }}
            className="lm-createPost__media--mediaText"
          >
            Write something here...
          </div>
        </div>
        <div className="lm-createPost__footer">
          <div className="lm-createPost__footer__left">
            {/* Create New Reels  */}
            <div
              className="lm-createPost__footer__left__media lm-cursor-pointer"
              onClick={() => {
                setOpenCreatePostDialog(true);
                changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.REEL);
              }}
            >
              <div className="lm-createPost__footer__left__media--imgBox">
                <img src={Video} alt="video icon" />
              </div>
              <div className="lm-createPost__footer__left__media--texted lm-text-capitalize">
                Upload Reels
              </div>
            </div>
            {/* Create New Reels  */}
          </div>
          <div className="lm-createPost__footer__right">
            <button
              className="lm-createPost__footer__right--btn-primary lm-text-capitalize"
              onClick={() => {
                setOpenCreatePostDialog(true);
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

import { useContext } from "react";

import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CustomAgentProviderContext,
  LMFeedCreateMediaPost,
  LMFeedCreatePostContext,
  LMFeedCreatePostMediaUploadMode,
  LMFeedCreatePostSubmitButton,
  LMFeedMediaUpload,
  LMFeedTextArea,
  LMFeedUserProviderContext,
  LMFeedViewTopicDropdown,
  LMTopicsDropdownMode,
} from "@likeminds.community/likeminds-feed-reactjs";

interface LMFeedCreatePostDialogProps {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const CustomLMFeedCreatePostDialog = ({}: LMFeedCreatePostDialogProps) => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const {
    mediaUploadMode,
    setSelectedTopicIds,
    selectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    temporaryPost,
    setOpenCreatePostDialog,
    createPostComponentClickCustomCallback,
    mediaList,
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
        {temporaryPost ? "EDIT POST" : "CREATE POST"}
        <span
          onClick={() => {
            if (setOpenCreatePostDialog) {
              setOpenCreatePostDialog(false);
            }
          }}
          className="cancelIcon"
        >
          <CloseIcon />
        </span>
      </div>
      <div className="lm-feed-create-post-wrapper__user-meta">
        <div className="lm-avatar lm-mr-4">
          {getAvatar(currentUser?.imageUrl || null, currentUser?.name || "")}
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
        {CustomComponents.CustomCreatePostTextArea || <LMFeedTextArea />}
      </div>

      <input
        type="text"
        id="cta-link-input"
        className="custom-cta-link-input"
        placeholder="Enter link for the CTA"
      />
      <LMFeedCreateMediaPost />
      {mediaUploadMode !== LMFeedCreatePostMediaUploadMode.NULL &&
      !temporaryPost &&
      !mediaList?.length ? (
        <LMFeedMediaUpload />
      ) : null}
      {!temporaryPost && <CustomCreatePostAttachmentController />}

      <LMFeedCreatePostSubmitButton />
    </div>
  );
};

export default CustomLMFeedCreatePostDialog;

export function CustomCreatePostAttachmentController() {
  const { changeMediaUploadMode } = useContext(LMFeedCreatePostContext);

  return (
    <div
      className="lm-feed-create-post-wrapper__attachments-controller"
      lm-feed-component-id={`lm-feed-create-post-attachments-controller-zabcd`}
    >
      <span
        className="lm-create-dialog-video-icon-container pointer"
        onClick={() => {
          if (changeMediaUploadMode)
            changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.REEL);
        }}
        style={{
          margin: "auto",
        }}
      >
        Upload Reels
      </span>
    </div>
  );
}
