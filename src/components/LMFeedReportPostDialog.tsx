import React from "react";

interface LMFeedReportPostDialogProps {
  mediaUploadDialog?: string;
}
// eslint-disable-next-line no-empty-pattern
const LMFeedReportPostDialog = ({}: LMFeedReportPostDialogProps) => {
  return (
    <div className="lmReportPostWrapper">
      <div className="lmReportPostWrapper__header">Report Post</div>
      <div className="lmReportPostWrapper__body">
        <div className="lmReportPostWrapper__body__content">
          <div className="lmReportPostWrapper__body__content--texted">
            <span>Please specify the problem to continue </span> <br />
            You would be able to report this Post after selecting a problem.
          </div>
          <div className="lmReportPostWrapper__body__content__types">
            <span>Nudity</span>
            <span>Hate Speech</span>
            <span>Spam</span>
            <span>Bad Language</span>
            <span>Terrorism</span>
            <span>Others</span>
          </div>

          <div className="lmReportPostWrapper__body__content__actions">
            <input
              type="text"
              className="lmReportPostWrapper__body__content__actions--input"
            />
            <button className="lmReportPostWrapper__body__content__actions--btnReport">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMFeedReportPostDialog;
