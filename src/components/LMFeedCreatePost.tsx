import { Dialog } from "@mui/material";
import React, { useState } from "react";
import LMFeedCreatePostDialog from "./LMFeedCreatePostDialog";

import user from "../assets/images/lm-photo.svg";
import photo from "../assets/images/lm-photo.svg";
import video from "../assets/images/VideoCamera.svg";
import pdf from "../assets/images/lm-attach.svg";

const LMFeedCreatePost = () => {
  const [openCreatePostDialog, setOpenCreatePostDialog] =
    useState<boolean>(false);
  return (
    <div>
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
            <div className="lm-createPost__footer__left__media">
              <div className="lm-createPost__footer__left__media--imgBox">
                <img src={photo} alt="image" />
              </div>
              <div className="lm-createPost__footer__left__media--texted">
                Photo
              </div>
            </div>
            <div className="lm-createPost__footer__left__media">
              <div className="lm-createPost__footer__left__media--imgBox">
                <img src={video} alt="video" />
              </div>
              <div className="lm-createPost__footer__left__media--texted">
                Video
              </div>
            </div>
            <div className="lm-createPost__footer__left__media">
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
                setOpenCreatePostDialog(false);
              }}
            >
              <LMFeedCreatePostDialog />
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMFeedCreatePost;
