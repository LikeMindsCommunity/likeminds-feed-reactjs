import ApprovePostIcon from "../assets/images/approve-post-icon.svg";
import RejectPostIcon from "../assets/images/reject-post-icon.svg";
import { useContext } from "react";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { getAvatar } from "../shared/components/LMUserMedia";
import { changeLikeCase, timeFromNow } from "../shared/utils";
import likeIcon from "../assets/images/like-sm.svg";
import commentLiked from "../assets/images/liked-sm.png";
import { WordAction } from "../shared/enums/wordAction";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { formatTimestamp } from "../shared/utils";
import { GroupReport } from "../shared/types/models/groupReport";
import { ActionTaken } from "@likeminds.community/feed-js";

interface LMFeedActionFooterProps {
  propReport: GroupReport | undefined;
}

const LMFeedActionFooter = ({ propReport }: LMFeedActionFooterProps) => {
  const {
    selectedTab,
    handleOnApprovedPostClicked,
    handleOnRejectedPostClicked,
    onApprovedCallback,
    onRejectedCallback,
    editMemberPermissionsHandler,
    setCurrentReport,
    comments,
  } = useContext(FeedModerationContext);
  const { LMFeedCustomIcons = {} } = useContext(CustomAgentProviderContext);

  const accusedUserState = propReport?.reports[0]?.accusedUser.state;

  const commentDetails = propReport?.entityId
    ? comments[propReport.entityId]
    : undefined;

  return (
    <>
      {commentDetails ? (
        <>
          <div className="reported-comment-wrapper">
            <div className="reported-comment-body">
              <div className="lm-comment-avatar">
                {getAvatar({
                  imageUrl: propReport?.reports[0]?.accusedUser.imageUrl,
                  name: propReport?.reports[0]?.accusedUser.name,
                })}
              </div>
              <div className="lm-reported-comment-container">
                <div className="lm-reported-comment-details">
                  <span className="reported-comment-heading">
                    {propReport?.reports[0]?.accusedUser.name}
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
        <div className="moderation-post-footer-wrapper moderation-post-footer-wrapper-custom-style">
          <button
            className="lm-moderation-header__button lm-text-capitalize selected-button approve-button-custom-style"
            onClick={() => {
              if (propReport?.reports[0]?.id !== undefined) {
                handleOnApprovedPostClicked([propReport.reports[0].id]);
              }
            }}
          >
            <img src={ApprovePostIcon} alt="approve-post-icon" />
            <span className="edit-permission-mobile-view">Keep</span>
            <span className="edit-permission-web-view">Approve Post</span>
          </button>
          <button
            className="lm-moderation-header__button lm-text-capitalize reject-button-custom-style"
            onClick={() => {
              if (propReport?.reports[0]?.id !== undefined) {
                handleOnRejectedPostClicked([propReport.reports[0].id]);
              }
            }}
          >
            <img src={RejectPostIcon} alt="reject-post-icon" />
            <span className="edit-permission-mobile-view">Delete</span>
            <span className="edit-permission-web-view">Reject Post</span>
          </button>
        </div>
      ) : selectedTab === "reported" ? (
        <div className="moderation-post-footer-wrapper moderation-post-footer-wrapper-reported moderation-post-footer-wrapper-custom-style">
          <div className="moderation-footer-button-wrapper">
            <button
              className="lm-moderation-header__button lm-text-capitalize selected-button "
              onClick={() => {
                if (propReport) {
                  onApprovedCallback(propReport);
                }
              }}
            >
              <img src={ApprovePostIcon} alt="approve-post-icon" />
              Keep
            </button>
            <button
              className="lm-moderation-header__button lm-text-capitalize  "
              onClick={() => {
                if (propReport) {
                  onRejectedCallback(
                    propReport,
                    commentDetails
                      ? commentDetails.postId
                      : propReport.entityId,
                  );
                }
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
                if (propReport) {
                  editMemberPermissionsHandler(
                    propReport.reports[0].accusedUser.sdkClientInfo.uuid,
                  );
                  setCurrentReport(propReport);
                }
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
          {propReport?.reports[0].actionTaken ? (
            propReport.reports[0].actionTaken ===
              ActionTaken.PENDING_POST_APPROVED ||
            propReport.reports[0].actionTaken === ActionTaken.POST_APPROVED ? (
              "Post approved by"
            ) : propReport.reports[0].actionTaken ===
                ActionTaken.PENDING_POST_REJECTED ||
              propReport.reports[0].actionTaken ===
                ActionTaken.POST_REJECTED ? (
              "Post rejected by"
            ) : (
              <>
                <span className="capitalize">
                  {propReport?.reports[0]?.type === "pending_post"
                    ? "Post"
                    : propReport?.reports[0]?.type}
                </span>{" "}
                {propReport.reports[0].actionTaken ===
                ActionTaken.COMMENT_APPROVED
                  ? "approved by"
                  : "rejected by"}
              </>
            )
          ) : (
            <>
              <span className="capitalize">
                {propReport?.reports[0]?.type === "pending_post"
                  ? "Post"
                  : propReport?.reports[0]?.type}
              </span>{" "}
              approved by
            </>
          )}
          <span className="moderation-post-closed-by">
            {propReport?.reports[0]?.closedBy?.name || "Unknown"}
          </span>
          on {formatTimestamp(Number(propReport?.reports[0]?.closedOn))}
        </div>
      )}
    </>
  );
};

export default LMFeedActionFooter;
