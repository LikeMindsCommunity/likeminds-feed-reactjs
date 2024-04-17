import React from "react";

const LMFeedDeleteDialogBox = () => {
  return (
    <div className="lm-feed-delete-dialog">
      <p className="lm-feed-delete-dialog__title">DELETE</p>
      <img src="" alt="" className="lm-feed-delete-dialog__close-icon" />
      <div className="lm-feed-delete-dialog__content">
        Are you sure you want to delete this comment permanently. Once
        confirmed, this action can’t be reversed.
      </div>
      <button className="lm-feed-delete-dialog__submit lm-cursor-pointer">
        Confirm
      </button>
    </div>
  );
};

export default LMFeedDeleteDialogBox;
