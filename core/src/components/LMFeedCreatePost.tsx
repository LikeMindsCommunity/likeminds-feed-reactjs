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
import { PDF, PHOTO, VIDEO, REEL } from "../shared/constants/lmAppConstant";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

interface LMFeedCreatePostInterface {
  showStarterComponent?: boolean;
}
const LMFeedCreatePost = ({
  showStarterComponent,
}: LMFeedCreatePostInterface) => {
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { LMFeedCustomIcons, CustomComponents = {} } = useContext(
    CustomAgentProviderContext,
  );
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
    createPostComponentClickCustomCallback,
    addThumbnailReel,
    addReel,
    tempReel,
    tempReelThumbnail,
    removeThumbnailReel,
    removeAddReel,
    isAnonymousPost,
    changeAnonymousPostStatus,
  } = useCreatePost();
  return (
    <LMFeedCreatePostContext.Provider
      value={{
        createPostComponentClickCustomCallback,
        postText,
        setPostText,
        mediaList,
        addMediaItem,
        removeMedia,
        clearMedia,
        mediaUploadMode,
        tempReel,
        tempReelThumbnail,
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
        addThumbnailReel,
        addReel,
        setPreSelectedTopics,
        showOGTagViewContainer,
        closeOGTagContainer,
        removeThumbnailReel,
        removeAddReel,
        isAnonymousPost,
        changeAnonymousPostStatus,
      }}
    >
      {showStarterComponent ? (
        CustomComponents.CustomCreatePostInitiateView ? (
          <CustomComponents.CustomCreatePostInitiateView
            setOpenCreatePostDialog={setOpenCreatePostDialog}
            changeMediaUploadMode={changeMediaUploadMode}
          />
        ) : (
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
                      {LMFeedCustomIcons?.createPostFooterImageIcon ? (
                        <LMFeedCustomIcons.createPostFooterImageIcon />
                      ) : (
                        <img src={photo} alt="image icons" />
                      )}
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
                      {LMFeedCustomIcons?.createPostFooterVideoIcon ? (
                        <LMFeedCustomIcons.createPostFooterVideoIcon />
                      ) : (
                        <img src={video} alt="video icon" />
                      )}
                    </div>
                    <div className="lm-createPost__footer__left__media--texted lm-text-capitalize">
                      {VIDEO}
                    </div>
                  </div>

                  {/* Create New Reels  */}
                  <div
                    className="lm-createPost__footer__left__media lm-cursor-pointer"
                    onClick={() => {
                      setOpenCreatePostDialog(!openCreatePostDialog);
                      changeMediaUploadMode(
                        LMFeedCreatePostMediaUploadMode.REEL,
                      );
                    }}
                  >
                    <div className="lm-createPost__footer__left__media--imgBox">
                      {LMFeedCustomIcons?.createPostFooterVideoIcon ? (
                        <LMFeedCustomIcons.createPostFooterVideoIcon />
                      ) : (
                        <img src={video} alt="video icon" />
                      )}
                    </div>
                    <div className="lm-createPost__footer__left__media--texted lm-text-capitalize">
                      {REEL}
                    </div>
                  </div>
                  {/* Create New Reels  */}

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
                      {LMFeedCustomIcons?.createPostFooterDocumentIcon ? (
                        <LMFeedCustomIcons.createPostFooterDocumentIcon />
                      ) : (
                        <img src={pdf} alt="pdf" />
                      )}
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
                    {/* {changePostCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)} */}
                    POST
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      ) : null}
      <Dialog
        open={openCreatePostDialog}
        onClose={() => {
          changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.NULL);
          setOpenCreatePostDialog(false);
        }}
      >
        {CustomComponents.CustomCreatePostDialog || <LMFeedCreatePostDialog />}
      </Dialog>
    </LMFeedCreatePostContext.Provider>
  );
};

export default LMFeedCreatePost;
