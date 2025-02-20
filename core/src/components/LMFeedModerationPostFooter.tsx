import ApprovePostIcon from "../assets/images/approve-post-icon.svg";
import RejectPostIcon from "../assets/images/reject-post-icon.svg";
import { useContext } from "react";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";

const LMFeedModerationPostFooter = () => {
  const { selectedTab } = useContext(FeedModerationContext);
  return (
    <>
      {selectedTab === "approval" ? (
        <div className="moderation-post-footer-wrapper">
          <button
            className="lm-moderation-header__button lm-text-capitalize selected-button "
            onClick={() => {}}
          >
            <img src={ApprovePostIcon} alt="approve-post-icon" />
            Approve Post
          </button>
          <button
            className="lm-moderation-header__button lm-text-capitalize  "
            onClick={() => {}}
          >
            <img src={RejectPostIcon} alt="reject-post-icon" />
            Reject Post
          </button>
        </div>
      ) : selectedTab === "reported" ? (
        <div className="moderation-post-footer-wrapper moderation-post-footer-wrapper-reported">
          <div className="moderation-footer-button-wrapper">
            <button
              className="lm-moderation-header__button lm-text-capitalize selected-button "
              onClick={() => {}}
            >
              <img src={ApprovePostIcon} alt="approve-post-icon" />
              Keep
            </button>
            <button
              className="lm-moderation-header__button lm-text-capitalize  "
              onClick={() => {}}
            >
              <img src={RejectPostIcon} alt="reject-post-icon" />
              Delete
            </button>
          </div>
          <button
            className="lm-moderation-header__button moderation-edit-member-permission-button"
            onClick={() => {}}
          >
            Edit member permission
          </button>
        </div>
      ) : null}
    </>
  );
};

export default LMFeedModerationPostFooter;
