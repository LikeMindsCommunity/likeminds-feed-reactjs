import "./LmCustomReelsForm.css";
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
  const { currentUser } = useContext(LMFeedUserProviderContext as any) as any;
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
        New Post
      </div>
      <div className="lm-createPost">
        <div className="lm-createPost__media">
          <div className="lm-createPost__media__imgBox lm-avatar">
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
import { useContext, useEffect, useRef } from "react";
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CustomAgentProviderContext,
  LMQNAFeedCreateMediaPost,
  LMFeedCreatePostContext,
  LMFeedCreatePostMediaUploadMode,
  LMFeedCreatePostSubmitButton,
  LMFeedDataContext,
  LMFeedMediaUpload,
  LMFeedTextArea,
  LMFeedUserProviderContext,
  LMFeedViewTopicDropdown,
  LMTopicsDropdownMode,
} from "@likeminds.community/likeminds-feed-reactjs";
interface LMFeedCreatePostDialogProps {
  mediaUploadDialog?: string;
  testTemp?: any;
}
// eslint-disable-next-line no-empty-pattern
const CustomLMFeedCreatePostDialog = (prop: LMFeedCreatePostDialogProps) => {
  const { currentUser } = useContext(LMFeedUserProviderContext as any) as any;
  const {
    mediaUploadMode,
    setSelectedTopicIds,
    selectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    temporaryPost,
    setOpenCreatePostDialog,
    createPostComponentClickCustomCallback,
    mediaList
  } = useContext(LMFeedCreatePostContext as any) as any;
  const { widgets } = useContext(LMFeedDataContext as any) as any;
  
  const metaInputRef = useRef(null);
  const attachmentId = useRef(null)
  const { CustomComponents = {} } = useContext(CustomAgentProviderContext as any) as any;
  const { CustomTopicDropDown } = CustomComponents;
  useEffect(() => {
    if(attachmentId) attachmentId.current = temporaryPost?.attachments?.find((attachment: any) => attachment?.attachmentType === 5)?.attachmentMeta?.entityId;
  }, [temporaryPost])
  useEffect(() => {
    if(widgets && metaInputRef?.current && attachmentId?.current) 
      (metaInputRef.current as any).value = widgets?.[attachmentId.current]?.metadata?.meta?.metaData || ""
  }, [widgets, metaInputRef, attachmentId])
  // const isCtaReel = temporaryPost?.attachments?.some(
  //   (attachment: any) => attachment.attachmentType === 5
  // );
  // if(isCtaReel && changeMediaUploadMode) {
  //   changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.REEL);
  // }
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
      <textarea
        id="cta-link-input"
        className="custom-cta-link-input"
        placeholder="Enter details for the CTA"
        ref={metaInputRef}
      />
      <LMQNAFeedCreateMediaPost />
      {mediaUploadMode !== LMFeedCreatePostMediaUploadMode.NULL &&
      !temporaryPost &&
      !mediaList?.length ? (
        <LMFeedMediaUpload />
      ) : null}
      {<CustomCreatePostAttachmentController />}
      {/* Submit button */}
      <LMFeedCreatePostSubmitButton />
    </div>
  );
};
export default CustomLMFeedCreatePostDialog;
export function CustomCreatePostAttachmentController() {
  const { changeMediaUploadMode, mediaList, clearMedia } = useContext(
    LMFeedCreatePostContext as any
  ) as any;
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
          if (mediaList?.length) {
            clearMedia();
          }
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