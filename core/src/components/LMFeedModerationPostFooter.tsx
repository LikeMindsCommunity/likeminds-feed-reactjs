import ApprovePostIcon from "../assets/images/approve-post-icon.svg";
import RejectPostIcon from "../assets/images/reject-post-icon.svg";
import { useContext } from "react";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { Post } from "../shared/types/models/post";
import { Comment } from "../shared/types/models/comment";
import { getAvatar } from "../shared/components/LMUserMedia";
import { changeLikeCase, timeFromNow } from "../shared/utils";
import likeIcon from "../assets/images/like-sm.svg";
import commentLiked from "../assets/images/liked-sm.png";
import { WordAction } from "../shared/enums/wordAction";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { formatTimestamp } from "../shared/utils";

interface LMFeedModerationPostFooterProps {
  postDetails: Post;
}

const LMFeedModerationPostFooter = ({
  postDetails,
}: LMFeedModerationPostFooterProps) => {
  const {
    selectedTab,
    handleOnApprovedPostClicked,
    handleOnRejectedPostClicked,
    reports,
    users,
    onApprovedCallback,
    onRejectedCallback,
    editMemberPermissionsHandler,
    setCurrentReport,
    comments,
  } = useContext(FeedModerationContext);
  const { LMFeedCustomIcons = {} } = useContext(CustomAgentProviderContext);

  let reportedDetails = reports.filter(
    (report) => report.entityId === postDetails.id,
  );
  const reportIds = reportedDetails.map((report) => report.id);
  const accusedUserState = users[postDetails.uuid].state;

  let commentDetails: Comment | undefined;

  if (reportedDetails.length === 0) {
    commentDetails = comments.filter(
      (comment) => comment.postId === postDetails.id,
    )[0];
    reportedDetails = reports.filter(
      (report) => report.entityId === commentDetails?.id,
    );
  }
  const isCommentReported = reportedDetails[0].type === 6;

  return (
    <>
      {commentDetails ? (
        <>
          <div className="reported-comment-wrapper">
            <div className="reported-comment-body">
              <div className="lm-comment-avatar">
                {getAvatar({
                  imageUrl: reportedDetails[0].userReported.imageUrl,
                  name: reportedDetails[0].userReported.name,
                })}
              </div>
              <div className="lm-reported-comment-container">
                <div className="lm-reported-comment-details">
                  <span className="reported-comment-heading">
                    {reportedDetails[0].userReported.name}
                  </span>
                  <span className="reported-comment-subheading">
                    {commentDetails.text}
                  </span>
                </div>
                <div className="lm-d-flex lm-justify-content-space-between lm-align-items-center lm-mb-5 reported-comment-footer-bar">
                  <div className="like lm-d-flex reported-comment-footer-bar">
                    <span className="lm-feed-post-like-container reported-comment-heart-icon">
                      {commentDetails?.isLiked ? (
                        LMFeedCustomIcons.repliesLikesLikedCustomIcon ? (
                          <LMFeedCustomIcons.repliesLikesLikedCustomIcon />
                        ) : (
                          <img
                            src={commentLiked}
                            className=" liked-comment"
                            alt="Like"
                            loading="lazy"
                          />
                        )
                      ) : LMFeedCustomIcons.repliesLikesNormalCustomIcon ? (
                        <LMFeedCustomIcons.repliesLikesNormalCustomIcon />
                      ) : (
                        <img
                          src={likeIcon}
                          className=""
                          alt="Like"
                          loading="lazy"
                        />
                      )}
                    </span>

                    {commentDetails?.likesCount ? (
                      <span>
                        {(commentDetails?.likesCount || 0) > 1
                          ? `${commentDetails?.likesCount} ${changeLikeCase(WordAction.FIRST_LETTER_CAPITAL_PLURAL)}`
                          : (commentDetails?.likesCount || 0) === 1
                            ? `${commentDetails?.likesCount} ${changeLikeCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`
                            : ""}
                      </span>
                    ) : (
                      ""
                    )}

                    <span className="pipe">|</span>
                    <span>
                      {(commentDetails?.level || 0) < 1 && (
                        <span className="reply-badge">Reply </span>
                      )}

                      <span
                        className={
                          (commentDetails?.commentsCount || 0) > 1
                            ? `replies lm-cursor-pointer commentTitle bullet`
                            : (commentDetails?.commentsCount || 0) === 1
                              ? `replies lm-cursor-pointer commentTitle bullet`
                              : "replies lm-cursor-pointer commentTitle"
                        }
                      >
                        {(commentDetails?.commentsCount || 0) > 1
                          ? `${commentDetails?.commentsCount} Replies`
                          : (commentDetails?.commentsCount || 0) === 1
                            ? `${commentDetails?.commentsCount} Reply`
                            : ""}
                      </span>
                    </span>
                  </div>
                  <div className="like">
                    {timeFromNow(
                      new Date(commentDetails?.createdAt || 0).toString() || "",
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {selectedTab === "approval" ? (
        <div className="moderation-post-footer-wrapper">
          <button
            className="lm-moderation-header__button lm-text-capitalize selected-button approve-button-custom-style"
            onClick={() => {
              handleOnApprovedPostClicked(reportIds);
            }}
          >
            <img src={ApprovePostIcon} alt="approve-post-icon" />
            <span className="edit-permission-mobile-view">Keep</span>
            <span className="edit-permission-web-view">Approve Post</span>
          </button>
          <button
            className="lm-moderation-header__button lm-text-capitalize reject-button-custom-style"
            onClick={() => {
              handleOnRejectedPostClicked(reportIds);
            }}
          >
            <img src={RejectPostIcon} alt="reject-post-icon" />
            <span className="edit-permission-mobile-view">Delete</span>
            <span className="edit-permission-web-view">Reject Post</span>
          </button>
        </div>
      ) : selectedTab === "reported" ? (
        <div className="moderation-post-footer-wrapper moderation-post-footer-wrapper-reported">
          <div className="moderation-footer-button-wrapper">
            <button
              className="lm-moderation-header__button lm-text-capitalize selected-button "
              onClick={() => {
                onApprovedCallback(reportedDetails[0]);
              }}
            >
              <img src={ApprovePostIcon} alt="approve-post-icon" />
              Keep
            </button>
            <button
              className="lm-moderation-header__button lm-text-capitalize  "
              onClick={() => {
                onRejectedCallback(reportedDetails[0]);
              }}
            >
              <img src={RejectPostIcon} alt="reject-post-icon" />
              Delete
            </button>
          </div>
          {accusedUserState === 1 ? null : (
            <button
              className="lm-moderation-header__button moderation-edit-member-permission-button edit-member-permission-custom-style"
              onClick={() => {
                editMemberPermissionsHandler(reportedDetails[0]);
                setCurrentReport(reportedDetails[0]);
              }}
            >
              <span className="edit-permission-mobile-view">Edit</span>
              <span className="edit-permission-web-view">
                Edit member permission
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="moderation-post-closed-footer">
          {isCommentReported ? "Comment approved by" : " Post approved by"}
          <span className="moderation-post-closed-by">
            {reportedDetails[0]?.closedBy?.name}
          </span>
          on {formatTimestamp(Number(reportedDetails[0].closedOn))}
        </div>
      )}
    </>
  );
};

export default LMFeedModerationPostFooter;
