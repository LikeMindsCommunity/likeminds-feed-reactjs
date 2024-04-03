import { Dialog } from "@mui/material";
import React, { useState } from "react";
import LMFeedCreatePostDialog from "./LMFeedCreatePostDialog";

const LMFeedCreatePost = () => {
  const [openCreatePostDialog, setOpenCreatePostDialog] =
    useState<boolean>(false);
  return (
    <div>
      <button
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
  );
};

export default LMFeedCreatePost;
