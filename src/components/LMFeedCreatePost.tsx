import { Dialog } from "@mui/material";
import photo from "../assets/images/lm-photo.svg";
import video from "../assets/images/VideoCamera.svg";
import pdf from "../assets/images/lm-attach.svg";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import { useCreatePost } from "../hooks/useCreatePost";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";
import LMFeedCreatePostDialog from "./LMFeedCreatePostDialog";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { useContext } from "react";
import { getAvatar } from "../shared/components/LMUserMedia";
import createPostIcon from "../assets/images/note.text.badge.plus.svg";
import { PDF, PHOTO, POST, VIDEO } from "../shared/constants/lmAppConstant";
interface LMFeedCreatePostInterface {
  showStarterComponent?: boolean;
}
const LMFeedCreatePost = ({
  showStarterComponent,
}: LMFeedCreatePostInterface) => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { name, imageUrl } = currentUser!;
  const avatar = getAvatar({
    imageUrl,
    name,
  });
  const {
    postText,
    setPostText,
    mediaList,
    addMediaItem,
    removeMedia,
    clearMedia,
    mediaUploadMode,
    changeMediaUploadMode,
    textFieldRef,
    containerRef,
    postFeed,
    editPost,
    ogTag,
    openCreatePostDialog,
    setOpenCreatePostDialog,
    temporaryPost,
    selectedTopicIds,
    setSelectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    showOGTagViewContainer,
    closeOGTagContainer,
  } = useCreatePost();
  return (
    <LMFeedCreatePostContext.Provider
      value={{
        postText,
        setPostText,
        mediaList,
        addMediaItem,
        removeMedia,
        clearMedia,
        mediaUploadMode,
        changeMediaUploadMode,
        textFieldRef,
        containerRef,
        postFeed,
        editPost,
        ogTag,
        openCreatePostDialog,
        setOpenCreatePostDialog,
        temporaryPost,
        selectedTopicIds,
        setSelectedTopicIds,
        preSelectedTopics,
        setPreSelectedTopics,
        showOGTagViewContainer,
        closeOGTagContainer,
      }}
    >
      {showStarterComponent ? (
        <>
          <div
            className="lm-create-post-btn"
            onClick={() => {
              setOpenCreatePostDialog(!openCreatePostDialog);
            }}
          >
            <img src={createPostIcon} alt="createPostIcon" />
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
                  setOpenCreatePostDialog(!openCreatePostDialog);
                }}
                className="lm-createPost__media--mediaText"
              >
                Write something here...
              </div>
            </div>
            <div className="lm-createPost__footer">
              <div className="lm-createPost__footer__left">
                <div
                  className="lm-createPost__footer__left__media lm-cursor-pointer"
                  onClick={() => {
                    setOpenCreatePostDialog(!openCreatePostDialog);
                    changeMediaUploadMode(
                      LMFeedCreatePostMediaUploadMode.IMAGE,
                    );
                  }}
                >
                  <div className="lm-createPost__footer__left__media--imgBox">
                    <img src={photo} alt="image" />
                  </div>
                  <div className="lm-createPost__footer__left__media--texted lm-text-capitalize">
                    {PHOTO}
                  </div>
                </div>
                <div
                  className="lm-createPost__footer__left__media lm-cursor-pointer"
                  onClick={() => {
                    setOpenCreatePostDialog(!openCreatePostDialog);
                    changeMediaUploadMode(
                      LMFeedCreatePostMediaUploadMode.VIDEO,
                    );
                  }}
                >
                  <div className="lm-createPost__footer__left__media--imgBox">
                    <img src={video} alt="video" />
                  </div>
                  <div className="lm-createPost__footer__left__media--texted lm-text-capitalize">
                    {VIDEO}
                  </div>
                </div>
                <div
                  className="lm-createPost__footer__left__media lm-cursor-pointer"
                  onClick={() => {
                    setOpenCreatePostDialog(!openCreatePostDialog);
                    changeMediaUploadMode(
                      LMFeedCreatePostMediaUploadMode.DOCUMENT,
                    );
                  }}
                >
                  <div className="lm-createPost__footer__left__media--imgBox">
                    <img src={pdf} alt="pdf" />
                  </div>
                  <div className="lm-createPost__footer__left__media--texted lm-text-capitalize">
                    {PDF}
                  </div>
                </div>
              </div>
              <div className="lm-createPost__footer__right">
                <button
                  className="lm-createPost__footer__right--btn-primary lm-text-capitalize"
                  onClick={() => {
                    setOpenCreatePostDialog(!openCreatePostDialog);
                  }}
                >
                  {POST}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <Dialog
        open={openCreatePostDialog}
        onClose={() => {
          changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.NULL);
          setOpenCreatePostDialog(false);
        }}
      >
        <LMFeedCreatePostDialog />
      </Dialog>
    </LMFeedCreatePostContext.Provider>
  );
};

export default LMFeedCreatePost;
