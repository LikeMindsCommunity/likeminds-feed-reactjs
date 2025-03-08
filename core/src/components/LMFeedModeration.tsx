import { useModeration } from "../hooks/useModeration";
import PostApprovalDisabledIcon from "../assets/images/moderation-disabled-icon1.svg";
import EmptyModeartionSizeIcon from "../assets/images/moderation-disabled-icon2.svg";
import { Report } from "../shared/types/models/report";
import Posts from "./LMFeedPosts";
import { useCallback, useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";
import { Dialog } from "@mui/material";
import LMFeedEditMemberPermissionsDialog from "./LMFeedEditMemberPermissionsDialog";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  POST_APPROVAL,
  POST_COMMENT_REPORTED,
  CLOSED_REPORTS,
  POST_APPROVAL_DISABLED,
  POST_APPROVAL_POST_SUBHEADING,
  POST_APPROVAL_PRE_SUBHEADING,
  NO_POST_APPROVAL_REPORTS_HEADING,
  NO_POST_APPROVAL_REPORTS_SUBHEADING,
  NO_REPORTED_REPORTS_HEADING,
  NO_REPORTED_REPORTS_SUBHEADING,
  NO_CLOSED_REPORTS_HEADING,
  NO_CLOSED_REPORTS_SUBHEADING,
} from "../shared/constants/lmAppConstant";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const LMFeedModeration = () => {
  const {
    selectTab,
    selectedTab,
    isPostApprovalEnabled,
    posts,
    users,
    topics,
    widgets,
    reports,
    comments,
    handleOnApprovedPostClicked,
    handleOnRejectedPostClicked,
    onApprovedCallback,
    onRejectedCallback,
    editMemberPermissionsHandler,
    updateMemberRightsHandler,
    memberRights,
    isEditPermissionDialogOpen,
    setIsEditPermissionDialogOpen,
    modifiedRights,
    setModifiedRights,
    customTitle,
    setCustomTitle,
    currentReport,
    setCurrentReport,
    handleHeaderLeadingTap,
    handleHeaderTextTap,
    handleHeaderTrailingTap,
    loadMoreFeeds,
    getNextPage,
    isLoading,
  } = useModeration();
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  const renderFeeds = useCallback(() => {
    return reports?.map((report: Report) => {
      let post = posts[report.entityId];
      if (!post) {
        const comment = comments[report.entityId];
        post = posts[comment?.postId];
      }
      if (!post) return null;
      const user = users[post.uuid];
      return (
        <FeedPostContext.Provider
          key={report?.id}
          value={{
            post,
            users,
            topics,
            widgets,
          }}
        >
          {CustomComponents?.CustomPostView || (
            <Posts post={post} user={user} propReport={report} />
          )}
        </FeedPostContext.Provider>
      );
    });
  }, [
    CustomComponents?.CustomPostView,
    posts,
    users,
    topics,
    widgets,
    reports,
    comments,
  ]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      selectTab("approval");
    } else if (newValue === 1) {
      selectTab("reported");
    } else if (newValue === 2) {
      selectTab("closed");
    }
  };

  return (
    <>
      <FeedModerationContext.Provider
        value={{
          selectTab,
          selectedTab,
          isPostApprovalEnabled,
          reports,
          posts,
          users,
          widgets,
          topics,
          comments,
          handleOnApprovedPostClicked,
          handleOnRejectedPostClicked,
          onApprovedCallback,
          onRejectedCallback,
          editMemberPermissionsHandler,
          updateMemberRightsHandler,
          memberRights,
          isEditPermissionDialogOpen,
          setIsEditPermissionDialogOpen,
          modifiedRights,
          setModifiedRights,
          customTitle,
          setCustomTitle,
          currentReport,
          setCurrentReport,
          handleHeaderLeadingTap,
          handleHeaderTextTap,
          handleHeaderTrailingTap,
          loadMoreFeeds,
          getNextPage,
          isLoading,
        }}
      >
        <div className="lm-flex-grow" id="feed-scroller">
          <div className="moderation-mobile-tab-wrapper">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={
                    selectedTab === "approval"
                      ? 0
                      : selectedTab === "reported"
                        ? 1
                        : 2
                  }
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                      "&.Mui-disabled": { opacity: 0.3 },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#5046e5",
                      borderBottom: "5px solid #5046e5",
                    },
                  }}
                  variant="fullWidth"
                >
                  <Tab
                    label="Approvals"
                    {...a11yProps(0)}
                    sx={{
                      color: "#666666",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      flexGrow: 1,
                      "&.Mui-selected": { color: "#5046e5" },
                    }}
                  />
                  <Tab
                    label="Reports"
                    {...a11yProps(1)}
                    sx={{
                      color: "#666666",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      flexGrow: 1,
                      "&.Mui-selected": { color: "#5046e5" },
                    }}
                  />
                  <Tab
                    label="Closed"
                    {...a11yProps(2)}
                    sx={{
                      color: "#666666",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      flexGrow: 1,
                      "&.Mui-selected": { color: "#5046e5" },
                    }}
                  />
                </Tabs>
              </Box>
            </Box>
          </div>
          <div className="lm-moderation-header">
            <div className="lm-moderation-header__left">
              <button
                className={
                  `lm-moderation-header__button lm-text-capitalize` +
                  (selectedTab === "approval" ? " selected-button" : "") +
                  ` post-approval-button-custom-style`
                }
                onClick={() => {
                  selectTab("approval");
                }}
              >
                {POST_APPROVAL}
              </button>

              <button
                className={
                  "lm-moderation-header__button lm-text-capitalize" +
                  (selectedTab === "reported" ? " selected-button" : "") +
                  ` post-reports-button-custom-style`
                }
                onClick={() => {
                  selectTab("reported");
                }}
              >
                {POST_COMMENT_REPORTED}
              </button>
            </div>

            <button
              className={
                "lm-moderation-header__button lm-text-capitalize" +
                (selectedTab === "closed" ? " selected-button" : "") +
                ` post-closed-button-custom-style`
              }
              onClick={() => {
                selectTab("closed");
              }}
            >
              {CLOSED_REPORTS}
            </button>
          </div>
          <hr className="moderation-separator" />

          {selectedTab === "approval" && !isPostApprovalEnabled ? (
            <div className="white-bg-container">
              <img
                src={PostApprovalDisabledIcon}
                alt="post approval"
                className="disabled-icons-size"
              />
              <div className="moderation-disabled-heading">
                {POST_APPROVAL_DISABLED}
              </div>
              <div className="moderation-disabled-subheading">
                {POST_APPROVAL_PRE_SUBHEADING}
                <span className="moderation-disabled-path">
                  {POST_APPROVAL_POST_SUBHEADING}
                </span>
              </div>
            </div>
          ) : reports.length > 0 ? (
            <InfiniteScroll
              dataLength={reports.length}
              hasMore={loadMoreFeeds}
              next={getNextPage}
              loader={null}
              scrollThreshold={0.6}
            >
              {renderFeeds()}
            </InfiniteScroll>
          ) : isLoading ? null : (
            <>
              {selectedTab === "approval" ? (
                <div className="white-bg-container">
                  <img
                    src={EmptyModeartionSizeIcon}
                    alt="post approval"
                    className="disabled-icons-size"
                  />
                  <div className="moderation-disabled-heading">
                    {NO_POST_APPROVAL_REPORTS_HEADING}
                  </div>
                  <div className="moderation-disabled-subheading">
                    {NO_POST_APPROVAL_REPORTS_SUBHEADING}
                  </div>
                </div>
              ) : selectedTab === "reported" ? (
                <div className="white-bg-container">
                  <img
                    src={EmptyModeartionSizeIcon}
                    alt="reported"
                    className="disabled-icons-size"
                  />
                  <div className="moderation-disabled-heading">
                    {NO_REPORTED_REPORTS_HEADING}
                  </div>
                  <div className="moderation-disabled-subheading">
                    {NO_REPORTED_REPORTS_SUBHEADING}
                  </div>
                </div>
              ) : selectedTab === "closed" ? (
                <div className="white-bg-container">
                  <img
                    src={EmptyModeartionSizeIcon}
                    alt="closed"
                    className="disabled-icons-size"
                  />
                  <div className="moderation-disabled-heading">
                    {NO_CLOSED_REPORTS_HEADING}
                  </div>
                  <div className="moderation-disabled-subheading">
                    {NO_CLOSED_REPORTS_SUBHEADING}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
        <Dialog
          open={isEditPermissionDialogOpen}
          onClose={() => {
            setIsEditPermissionDialogOpen(false);
          }}
        >
          <LMFeedEditMemberPermissionsDialog />
        </Dialog>
      </FeedModerationContext.Provider>
    </>
  );
};
