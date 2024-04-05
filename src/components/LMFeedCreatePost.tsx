import { Dialog } from "@mui/material";
import React, { useState } from "react";
import LMFeedCreatePostDialog from "./LMFeedCreatePostDialog";

import user from "../assets/images/lm-photo.svg";
import photo from "../assets/images/lm-photo.svg";
import video from "../assets/images/VideoCamera.svg";
import pdf from "../assets/images/lm-attach.svg";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import { useCreatePost } from "../hooks/useCreatePost";
import { LMFeedCreatePostMediaUploadMode } from "../shared/enums/lmCreatePostMediaHandlingMode";

const LMFeedCreatePost = () => {
  const [openCreatePostDialog, setOpenCreatePostDialog] =
    useState<boolean>(false);
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
      }}
    >
      <div className="lm-createPost">
        <div className="lm-createPost__media">
          <div className="lm-createPost__media__imgBox">
            <img src={user} alt="user photo" />
          </div>
          <div className="lm-createPost__media--mediaText">
            Write something here...
          </div>
        </div>
        <div className="lm-createPost__footer">
          <div className="lm-createPost__footer__left">
            <div
              className="lm-createPost__footer__left__media lm-cursor-pointer"
              onClick={() => {
                setOpenCreatePostDialog(!openCreatePostDialog);
                changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.IMAGE);
              }}
            >
              <div className="lm-createPost__footer__left__media--imgBox">
                <img src={photo} alt="image" />
              </div>
              <div className="lm-createPost__footer__left__media--texted">
                Photo
              </div>
            </div>
            <div
              className="lm-createPost__footer__left__media lm-cursor-pointer"
              onClick={() => {
                setOpenCreatePostDialog(!openCreatePostDialog);
                changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.VIDEO);
              }}
            >
              <div className="lm-createPost__footer__left__media--imgBox">
                <img src={video} alt="video" />
              </div>
              <div className="lm-createPost__footer__left__media--texted">
                Video
              </div>
            </div>
            <div
              className="lm-createPost__footer__left__media lm-cursor-pointer"
              onClick={() => {
                setOpenCreatePostDialog(!openCreatePostDialog);
                changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.DOCUMENT);
              }}
            >
              <div className="lm-createPost__footer__left__media--imgBox">
                <img src={pdf} alt="pdf" />
              </div>
              <div className="lm-createPost__footer__left__media--texted">
                PDF
              </div>
            </div>
          </div>

          <div className="lm-createPost__footer__right">
            <button
              className="lm-createPost__footer__right--btn-primary"
              onClick={() => {
                setOpenCreatePostDialog(!openCreatePostDialog);
              }}
            >
              Open
            </button>
            <Dialog
              open={openCreatePostDialog}
              onClose={() => {
                changeMediaUploadMode(LMFeedCreatePostMediaUploadMode.NULL);
                setOpenCreatePostDialog(false);
              }}
            >
              <LMFeedCreatePostDialog />
            </Dialog>
          </div>
        </div>
      </div>
    </LMFeedCreatePostContext.Provider>
  );
};

export default LMFeedCreatePost;
