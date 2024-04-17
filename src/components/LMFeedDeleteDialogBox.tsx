import React from "react";
import closeIcon from "../assets/images/cancel-model-icon.svg";

const LMFeedDeleteDialogBox = () => {
  return (
    <div className="lmReportPostWrapper">
      <div className="lmReportPostWrapper__header">Delete Post</div>
      <img
        src={closeIcon}
        className="lmReportPostWrapper__header__closeIcon"
        alt="close-icon"
      />
      <div className="lmReportPostWrapper__body">
        <div className="lmReportPostWrapper__body__content">
          <div className="lmReportPostWrapper__body__content--texted">
            Are you sure you want to delete this post permanently. Once
            confirmed, this action can't be reversed.
          </div>

          <div className="lmReportPostWrapper__body__content__actions">
            <button className="lmReportPostWrapper__body__content__actions--btnReport">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMFeedDeleteDialogBox;
