import { useState, useContext, useEffect, useCallback } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  GetPendingPostModerationRequest,
  User,
  UpdateReportStatusRequest,
  LMResponseType,
  GetPostCommentReportRequest,
  DeletePostRequest,
  GetReportsRequest,
  GetMemberRightsRequest,
  UpdateMemberRightsRequest,
  MemberRights,
  FilterType,
  LMFeedReportStatus,
  DeleteCommentRequest,
} from "@likeminds.community/feed-js-beta";
import { GetPendingPostModerationResponse } from "../shared/types/api-responses/getPendingPostsForModerationResponse";
import { GetPostCommentReportsResponse } from "../shared/types/api-responses/getPostCommentReports";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { getDisplayMessage } from "../shared/utils";
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import { Post } from "../shared/types/models/post";
import { Comment } from "../shared/types/models/comment";
import { Topic } from "../shared/types/models/topic";
import { Widget } from "../shared/types/models/widget";
import { GroupReport } from "../shared/types/models/groupReport";
import { GetMemberRightsResponse } from "../shared/types/api-responses/getMemberRightsResponse";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import {
  ModerationDataStore,
  ModerationDefaultActions,
  ApplicationGeneralsStore,
} from "../shared/types/cutomCallbacks/dataStores";
import { LMFeedCustomActionEvents } from "../shared/constants/lmFeedCustomEventNames";

export function useModeration() {
  const [selectedTab, setSelectedTab] = useState<string>("approval");
  const [isPostApprovalEnabled, setIsPostApprovalEnabled] = useState<boolean>(
    JSON.parse(localStorage.getItem("isPostApprovedEnabled") || "false"),
  );
  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );
  const { lmFeedclient, customEventClient } = useContext(
    GlobalClientProviderContext,
  );
  const { displaySnackbarMessage, closeSnackbar, showSnackbar, message } =
    useContext(GeneralContext);
  const { ModerationCustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
  const {
    onApprovedPostClicked,
    onRejectedPostClicked,
    onLeadingTap,
    onTextTap,
    onTrailingTap,
    onEditMemberPermissionClicked,
  } = ModerationCustomCallbacks;

  const [posts, setPosts] = useState<Record<string, Post>>({});
  const [reports, setReports] = useState<GroupReport[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [widgets, setWidgets] = useState<Record<string, Widget>>({});
  const [topics, setTopics] = useState<Record<string, Topic>>({});
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [loadMoreFeeds, setLoadMoreFeeds] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] =
    useState<boolean>(false);
  const [memberRights, setMemberRights] = useState<MemberRights[]>([]);
  const [currentReport, setCurrentReport] = useState<GroupReport | null>(null);

  const [modifiedRights, setModifiedRights] =
    useState<MemberRights[]>(memberRights);
  const [customTitle, setCustomTitle] = useState<string>("");

  const pageSize = 10;

  const getPendingPostsForModerationHandler = async (page: number) => {
    try {
      setIsLoading(true);
      const getPendingPostsForModerationCall: GetPendingPostModerationResponse =
        (await lmFeedclient?.getPendingPostsForModeration(
          GetPendingPostModerationRequest.builder()
            .setPage(page)
            .setPageSize(pageSize)
            .build(),
        )) as never;

      setIsLoading(false);

      if (getPendingPostsForModerationCall.success) {
        setReports((prev) => [
          ...prev,
          ...getPendingPostsForModerationCall.data.reportsData,
        ]);
        setPosts((prev) => ({
          ...prev,
          ...getPendingPostsForModerationCall.data.posts,
        }));
        setUsers((prev) => ({
          ...prev,
          ...getPendingPostsForModerationCall.data.users,
        }));
        setTopics((prev) => ({
          ...prev,
          ...getPendingPostsForModerationCall.data.topics,
        }));
        setWidgets((prev) => ({
          ...prev,
          ...getPendingPostsForModerationCall.data.widgets,
        }));
        setComments((prev) => ({
          ...prev,
          ...getPendingPostsForModerationCall.data.comments,
        }));

        setPageCount(page);
        if (
          Object.values(getPendingPostsForModerationCall.data.reportsData)
            .length === 0
        ) {
          setLoadMoreFeeds(false);
        }
      } else {
        setLoadMoreFeeds(false);
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getPendingPostsForModerationCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setLoadMoreFeeds(false);
    }
  };

  const getPostCommentReportsResponseHandler = async (page: number) => {
    try {
      setIsLoading(true);
      const getPostCommentReportsCall: GetPostCommentReportsResponse =
        (await lmFeedclient?.getReportsForPostAndComments(
          GetPostCommentReportRequest.builder()
            .setPage(page)
            .setPageSize(pageSize)
            .build(),
        )) as never;

      setIsLoading(false);

      if (getPostCommentReportsCall.success) {
        setReports((prev) => [
          ...prev,
          ...getPostCommentReportsCall.data.reportsData,
        ]);
        setPosts((prev) => ({
          ...prev,
          ...getPostCommentReportsCall.data.posts,
        }));
        setUsers((prev) => ({
          ...prev,
          ...getPostCommentReportsCall.data.users,
        }));
        setTopics((prev) => ({
          ...prev,
          ...getPostCommentReportsCall.data.topics,
        }));
        setWidgets((prev) => ({
          ...prev,
          ...getPostCommentReportsCall.data.widgets,
        }));
        setComments((prev) => ({
          ...prev,
          ...getPostCommentReportsCall.data.comments,
        }));

        setPageCount(page);
        if (
          Object.values(getPostCommentReportsCall.data.reportsData).length === 0
        ) {
          setLoadMoreFeeds(false);
        }
      } else {
        setLoadMoreFeeds(false);
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getPostCommentReportsCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      setLoadMoreFeeds(false);
      console.log(error);
    }
  };
  const getClosedReportsResponseHandler = async (page: number) => {
    try {
      setIsLoading(true);
      const getClosedReportsCall: GetPostCommentReportsResponse =
        (await lmFeedclient?.getReports(
          GetReportsRequest.builder()
            .setPage(page)
            .setPageSize(pageSize)
            .setIsClosed(true)
            .setFilterType([
              FilterType.PENDING_POST,
              FilterType.POST,
              FilterType.COMMENT,
              FilterType.REPLY,
            ])
            .build(),
        )) as never;
      setIsLoading(false);

      if (getClosedReportsCall.success) {
        setReports((prev) => [
          ...prev,
          ...getClosedReportsCall.data.reportsData,
        ]);
        setPosts((prev) => ({
          ...prev,
          ...getClosedReportsCall.data.posts,
        }));
        setUsers((prev) => ({ ...prev, ...getClosedReportsCall.data.users }));
        setTopics((prev) => ({ ...prev, ...getClosedReportsCall.data.topics }));
        setWidgets((prev) => ({
          ...prev,
          ...getClosedReportsCall.data.widgets,
        }));
        setComments((prev) => ({
          ...prev,
          ...getClosedReportsCall.data.comments,
        }));

        setPageCount(page);
        if (Object.values(getClosedReportsCall.data.reportsData).length === 0) {
          setLoadMoreFeeds(false);
        }
      } else {
        setLoadMoreFeeds(false);
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getClosedReportsCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      console.log(error);
      setLoadMoreFeeds(false);
    }
  };

  const handleOnApprovedPostClicked = async (reportIds: number[]) => {
    try {
      const UpdatePendingPostStatusCall: LMResponseType<null> =
        (await lmFeedclient?.updateReportStatus(
          UpdateReportStatusRequest.builder()
            .setReportIds(reportIds)
            .setActionTaken(LMFeedReportStatus.PENDING_POST_APPROVED)
            .build(),
        )) as never;

      if (UpdatePendingPostStatusCall.success) {
        setReports((prevReport) =>
          prevReport.filter((report) => report.reports[0].id !== reportIds[0]),
        );
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.MODERATION_UPDATED,
        );
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getDisplayMessage(LMDisplayMessages.POST_APPROVED)!,
          );
        }
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            UpdatePendingPostStatusCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnRejectedPostClicked = async (reportIds: number[]) => {
    try {
      const UpdatePendingPostStatusCall: LMResponseType<null> =
        (await lmFeedclient?.updateReportStatus(
          UpdateReportStatusRequest.builder()
            .setReportIds(reportIds)
            .setActionTaken(LMFeedReportStatus.PENDING_POST_REJECTED)
            .build(),
        )) as never;

      if (UpdatePendingPostStatusCall.success) {
        setReports((prevReport) =>
          prevReport.filter((report) => report.reports[0].id !== reportIds[0]),
        );
        customEventClient?.dispatchEvent(
          LMFeedCustomActionEvents.MODERATION_UPDATED,
        );
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getDisplayMessage(LMDisplayMessages.POST_REJECTED)!,
          );
        }
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            UpdatePendingPostStatusCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getNextPage = () => {
    if (selectedTab === "approval") {
      getPendingPostsForModerationHandler(pageCount + 1);
    } else if (selectedTab === "reported") {
      getPostCommentReportsResponseHandler(pageCount + 1);
    } else {
      getClosedReportsResponseHandler(pageCount + 1);
    }
  };

  const loadPost = useCallback(async () => {
    try {
      if (selectedTab === "approval") {
        getPendingPostsForModerationHandler(1);
      } else if (selectedTab === "reported") {
        getPostCommentReportsResponseHandler(1);
      } else {
        getClosedReportsResponseHandler(1);
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmFeedclient, selectedTab]);

  useEffect(() => {
    setPageCount(1);
    setLoadMoreFeeds(true);
    setReports([]);
    setPosts({});
    setUsers({});
    setTopics({});
    setWidgets({});
    setComments({});
  }, [selectedTab]);

  const onApprovedCallback = useCallback(
    async (groupReport: GroupReport) => {
      try {
        const reportIds = groupReport.reports.map((report) => report.id);
        const UpdatePendingPostStatusCall: LMResponseType<null> =
          (await lmFeedclient?.updateReportStatus(
            UpdateReportStatusRequest.builder()
              .setReportIds(reportIds)
              .setActionTaken(
                groupReport.reports[0].type === "post"
                  ? LMFeedReportStatus.POST_APPROVED
                  : LMFeedReportStatus.COMMENT_APPROVED,
              )
              .build(),
          )) as never;

        if (UpdatePendingPostStatusCall.success) {
          setReports((prevReport) =>
            prevReport.filter(
              (report) => report.entityId !== groupReport.entityId,
            ),
          );
          customEventClient?.dispatchEvent(
            LMFeedCustomActionEvents.MODERATION_UPDATED,
          );
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              getDisplayMessage(LMDisplayMessages.POST_IGNORED)!,
            );
          }
        } else {
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              UpdatePendingPostStatusCall?.errorMessage ||
                getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedclient, displaySnackbarMessage],
  );

  const onRejectedCallback = useCallback(
    async (groupReport: GroupReport, postId: string) => {
      try {
        let CloseReportRequestCall: LMResponseType<null>;
        if (groupReport.entityId === postId) {
          CloseReportRequestCall = (await lmFeedclient?.deletePost(
            DeletePostRequest.builder()
              .setPostId(postId)
              .setDeleteReason(groupReport.reports[0].reason || "")
              .build(),
          )) as never;
        } else {
          CloseReportRequestCall = (await lmFeedclient?.deleteComment(
            DeleteCommentRequest.builder()
              .setPostId(postId)
              .setCommentId(groupReport.entityId)
              .setReason(groupReport.reports[0].reason || "")
              .build(),
          )) as never;
        }

        if (CloseReportRequestCall.success) {
          setReports((prevReport) =>
            prevReport.filter(
              (currReport) => currReport.entityId !== groupReport.entityId,
            ),
          );

          const reportIds = groupReport.reports.map((report) => report.id);
          const UpdatePendingPostStatusCall: LMResponseType<null> =
            (await lmFeedclient?.updateReportStatus(
              UpdateReportStatusRequest.builder()
                .setReportIds(reportIds)
                .setActionTaken(
                  groupReport.reports[0].type === "post"
                    ? LMFeedReportStatus.POST_REJECTED
                    : LMFeedReportStatus.COMMENT_REJECTED,
                )
                .build(),
            )) as never;

          if (UpdatePendingPostStatusCall.success) {
            customEventClient?.dispatchEvent(
              LMFeedCustomActionEvents.MODERATION_UPDATED,
            );
            if (displaySnackbarMessage) {
              displaySnackbarMessage(
                getDisplayMessage(
                  groupReport.reports[0].type === "post"
                    ? LMDisplayMessages.POST_DELETED
                    : LMDisplayMessages.COMMENT_DELETED_SUCCESS,
                )!,
              );
            }
          } else {
            if (displaySnackbarMessage) {
              displaySnackbarMessage(
                UpdatePendingPostStatusCall?.errorMessage ||
                  getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
              );
            }
          }
        } else {
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              CloseReportRequestCall?.errorMessage ||
                getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedclient, displaySnackbarMessage],
  );

  const editMemberPermissionsHandler = async (uuid: string) => {
    try {
      const getMemberRightsCall: GetMemberRightsResponse =
        (await lmFeedclient?.getMemberRights(
          GetMemberRightsRequest.builder().setUuid(uuid).setIsCM(false).build(),
        )) as never;

      if (getMemberRightsCall?.success) {
        setMemberRights(getMemberRightsCall?.data.rights);
        setModifiedRights(getMemberRightsCall?.data.rights);
        setIsEditPermissionDialogOpen(true);
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getMemberRightsCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateMemberRightsHandler = async () => {
    try {
      const requestBuilder = UpdateMemberRightsRequest.builder()
        .setUuid(currentReport?.reports[0].accusedUser.sdkClientInfo.uuid || "")
        .setIsCM(false)
        .setRights(modifiedRights);

      if (customTitle.trim() !== "") {
        requestBuilder.setCustomTitle(customTitle);
      }

      const updateMemberRightsCall: LMResponseType<null> =
        (await lmFeedclient?.updateMemberRights(
          requestBuilder.build(),
        )) as never;

      if (updateMemberRightsCall?.success) {
        setIsEditPermissionDialogOpen(false);
        setCustomTitle("");
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getDisplayMessage(LMDisplayMessages.RIGHTS_UPDATED)!,
          );
        }
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            updateMemberRightsCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHeaderLeadingTap = () => {};
  const handleHeaderTextTap = () => {};
  const handleHeaderTrailingTap = () => {};

  useEffect(() => {
    if (currentCommunity?.communitySettings) {
      const setting = currentCommunity.communitySettings.find(
        (s) => s.settingType === "post_approval_needed",
      );

      if (setting) {
        const isPostApprovalEnabled = setting.enabled === true;
        localStorage.setItem(
          "isPostApprovedEnabled",
          JSON.stringify(isPostApprovalEnabled),
        );
        setIsPostApprovalEnabled(isPostApprovalEnabled);
      }
    }
  }, [currentCommunity]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  function selectTab(tab: string) {
    setSelectedTab(tab);
  }

  const ModerationDataStore: ModerationDataStore = {
    selectedTab,
    isPostApprovalEnabled,
    reports,
    comments,
    posts,
    users,
    widgets,
    topics,
    memberRights,
    isEditPermissionDialogOpen,
    modifiedRights,
    customTitle,
    currentReport,
  };

  const defaultActions: ModerationDefaultActions = {
    selectTab,
    handleOnApprovedPostClicked,
    handleOnRejectedPostClicked,
    onApprovedCallback,
    onRejectedCallback,
    editMemberPermissionsHandler,
    updateMemberRightsHandler,
    setIsEditPermissionDialogOpen,
    setModifiedRights,
    setCustomTitle,
    setCurrentReport,
    handleHeaderLeadingTap,
    handleHeaderTextTap,
    handleHeaderTrailingTap,
  };

  const applicationGeneralsStore: ApplicationGeneralsStore = {
    userDataStore: {
      lmFeedUser: currentUser,
      lmFeedUserCurrentCommunity: currentCommunity,
      logOutUser: logoutUser,
    },
    generalDataStore: {
      displaySnackbarMessage,
      closeSnackbar,
      showSnackbar,
      message,
    },
  };

  return {
    selectedTab,
    selectTab,
    isPostApprovalEnabled,
    reports,
    posts,
    users,
    widgets,
    topics,
    comments,
    handleOnApprovedPostClicked: onApprovedPostClicked
      ? onApprovedPostClicked.bind(null, {
          moderationDataStore: ModerationDataStore,
          applicationGeneralStore: applicationGeneralsStore,
          defaultActions: defaultActions,
        })
      : handleOnApprovedPostClicked,
    handleOnRejectedPostClicked: onRejectedPostClicked
      ? onRejectedPostClicked.bind(null, {
          moderationDataStore: ModerationDataStore,
          applicationGeneralStore: applicationGeneralsStore,
          defaultActions: defaultActions,
        })
      : handleOnRejectedPostClicked,
    handleHeaderLeadingTap: onLeadingTap
      ? onLeadingTap.bind(null, {
          moderationDataStore: ModerationDataStore,
          applicationGeneralStore: applicationGeneralsStore,
          defaultActions: defaultActions,
        })
      : handleHeaderLeadingTap,
    handleHeaderTextTap: onTextTap
      ? onTextTap.bind(null, {
          moderationDataStore: ModerationDataStore,
          applicationGeneralStore: applicationGeneralsStore,
          defaultActions: defaultActions,
        })
      : handleHeaderTextTap,
    handleHeaderTrailingTap: onTrailingTap
      ? onTrailingTap.bind(null, {
          moderationDataStore: ModerationDataStore,
          applicationGeneralStore: applicationGeneralsStore,
          defaultActions: defaultActions,
        })
      : handleHeaderTrailingTap,
    onApprovedCallback,
    onRejectedCallback,
    editMemberPermissionsHandler: onEditMemberPermissionClicked
      ? onEditMemberPermissionClicked.bind(null, {
          moderationDataStore: ModerationDataStore,
          applicationGeneralStore: applicationGeneralsStore,
          defaultActions: defaultActions,
        })
      : editMemberPermissionsHandler,
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
    loadMoreFeeds,
    getNextPage,
    isLoading,
  };
}
