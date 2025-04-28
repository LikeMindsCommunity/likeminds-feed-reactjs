import React, { useContext } from "react";
import closeIcon from "../../assets/images/cancel-model-icon.svg";
import { LMFeedDeletePostModes } from "../../shared/enums/lmDeleteDialogModes";
import { FeedPostContext } from "../../contexts/LMFeedPostContext";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
interface LMDeletePostDialogProps {
  mode: LMFeedDeletePostModes;
  onClose: () => void;
}
const LMFeedDeleteDialogBox = ({ mode, onClose }: LMDeletePostDialogProps) => {
  const { deletePost, post, removeAComment } = useContext(FeedPostContext);
  const { reply, deleteReply } = useContext(ReplyContext);
  function confirmDelete() {
    switch (mode) {
      case LMFeedDeletePostModes.POST: {
        if (deletePost) {
          deletePost(post?.id || "");
        }
        return;
      }
      case LMFeedDeletePostModes.COMMENT: {
        if (removeAComment) {
          removeAComment(reply?.id || "");
        }
        return;
      }
      case LMFeedDeletePostModes.REPLY: {
        if (deleteReply) {
          deleteReply(reply?.id || "");
        }
      }
    }
  }
  return (
    <div className="lmReportPostWrapper">
      <div className="lmReportPostWrapper__header">Delete Post</div>
      <img
        src={closeIcon}
        className="lmReportPostWrapper__header__closeIcon"
        alt="close-icon"
        onClick={onClose}
      />
      <div className="lmReportPostWrapper__body">
        <div className="lmReportPostWrapper__body__content">
          <div className="lmReportPostWrapper__body__content--texted">
            Are you sure you want to delete this post permanently. Once
            confirmed, this action can't be reversed.
          </div>

          <div className="lmReportPostWrapper__body__content__actions">
            <button
              onClick={confirmDelete}
              className="lmReportPostWrapper__body__content__actions--btnReport"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LMFeedDeleteDialogBox;