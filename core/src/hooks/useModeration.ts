import { useState, useContext, useEffect, useCallback } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  GetPendingPostModerationRequest,
  User,
  UpdatePendingPostStatusRequest,
  LMResponseType,
  GetPostCommentReportRequest,
  CloseReportRequest,
  DeletePostRequest,
  GetReportsRequest,
  GetMemberRightsRequest,
  UpdateMemberRightsRequest,
  MemberRights,
  FilterType,
  LMFeedReportStatus,
} from "@likeminds.community/feed-js";
import { GetPendingPostModerationResponse } from "../shared/types/api-responses/getPendingPostsForModerationResponse";
import { GetPostCommentReportsResponse } from "../shared/types/api-responses/getPostCommentReports";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { getDisplayMessage } from "../shared/utils";
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import { Post } from "../shared/types/models/post";
import { Comment } from "../shared/types/models/comment";
import { Topic } from "../shared/types/models/topic";
import { Report } from "../shared/types/models/report";
import { Widget } from "../shared/types/models/widget";
import { GetMemberRightsResponse } from "../shared/types/api-responses/getMemberRightsResponse";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import {
  ModerationDataStore,
  ModerationDefaultActions,
  ApplicationGeneralsStore,
} from "../shared/types/cutomCallbacks/dataStores";

export function useModeration() {
  const [selectedTab, setSelectedTab] = useState<string>("approval");
  const [isPostApprovalEnabled, setIsPostApprovalEnabled] = useState<boolean>(
    JSON.parse(localStorage.getItem("isPostApprovedEnabled") || "false"),
  );
  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );
  const { lmFeedclient } = useContext(GlobalClientProviderContext);
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

  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [widgets, setWidgets] = useState<Record<string, Widget>>({});
  const [topics, setTopics] = useState<Record<string, Topic>>({});
  const [comments, setComments] = useState<Comment[]>([]);

  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] =
    useState<boolean>(false);
  const [memberRights, setMemberRights] = useState<MemberRights[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);

  const [modifiedRights, setModifiedRights] =
    useState<MemberRights[]>(memberRights);
  const [customTitle, setCustomTitle] = useState<string>("");

  const getPendingPostsForModerationHandler = async () => {
    const getPendingPostsForModerationCall: GetPendingPostModerationResponse =
      (await lmFeedclient?.getPendingPostsForModeration(
        GetPendingPostModerationRequest.builder()
          .setPage(1)
          .setPageSize(10)
          .build(),
      )) as never;

    if (getPendingPostsForModerationCall.success) {
      setReports(getPendingPostsForModerationCall.data.reports);
      setPosts(Object.values(getPendingPostsForModerationCall.data.posts));
      setUsers({ ...getPendingPostsForModerationCall.data.users });
      setTopics({ ...getPendingPostsForModerationCall.data.topics });
      setWidgets({ ...getPendingPostsForModerationCall.data.widgets });
      setComments(
        Object.values(getPendingPostsForModerationCall.data.comments),
      );
    } else {
      if (displaySnackbarMessage) {
        displaySnackbarMessage(
          getPendingPostsForModerationCall?.errorMessage ||
            getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
        );
      }
      window.history.back();
    }
  };

  const getPostCommentReportsResponseHandler = async () => {
    const getPostCommentReportsCall: GetPostCommentReportsResponse =
      (await lmFeedclient?.getReportsForPostAndComments(
        GetPostCommentReportRequest.builder()
          .setPage(1)
          .setPageSize(10)
          .build(),
      )) as never;

    if (getPostCommentReportsCall.success) {
      setReports(getPostCommentReportsCall.data.reports);
      setPosts(Object.values(getPostCommentReportsCall.data.posts));
      setUsers({ ...getPostCommentReportsCall.data.users });
      setTopics({ ...getPostCommentReportsCall.data.topics });
      setWidgets({ ...getPostCommentReportsCall.data.widgets });
      setComments(Object.values(getPostCommentReportsCall.data.comments));
    } else {
      if (displaySnackbarMessage) {
        displaySnackbarMessage(
          getPostCommentReportsCall?.errorMessage ||
            getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
        );
      }
      window.history.back();
    }
  };
  const getClosedReportsResponseHandler = async () => {
    const getClosedReportsCall: GetPostCommentReportsResponse =
      (await lmFeedclient?.getReports(
        GetReportsRequest.builder()
          .setPage(1)
          .setPageSize(10)
          .setIsClosed(false)
          .setFilterType([
            FilterType.PENDING_POST,
            FilterType.POST,
            FilterType.COMMENT,
            FilterType.REPLY,
          ])
          .build(),
      )) as never;

    if (getClosedReportsCall.success) {
      setReports(getClosedReportsCall.data.reports);
      setPosts(Object.values(getClosedReportsCall.data.posts));
      setUsers({ ...getClosedReportsCall.data.users });
      setTopics({ ...getClosedReportsCall.data.topics });
      setWidgets({ ...getClosedReportsCall.data.widgets });
      setComments(Object.values(getClosedReportsCall.data.comments));
    } else {
      if (displaySnackbarMessage) {
        displaySnackbarMessage(
          getClosedReportsCall?.errorMessage ||
            getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
        );
      }
      window.history.back();
    }
  };

  const loadPost = useCallback(async () => {
    try {
      if (selectedTab === "approval") {
        getPendingPostsForModerationHandler();
      } else if (selectedTab === "reported") {
        getPostCommentReportsResponseHandler();
      } else {
        getClosedReportsResponseHandler();
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmFeedclient, selectedTab]);

  const handleOnApprovedPostClicked = async (reportIds: number[]) => {
    try {
      const UpdatePendingPostStatusCall: LMResponseType<null> =
        (await lmFeedclient?.updatePendingPostStatus(
          UpdatePendingPostStatusRequest.builder()
            .setReportIds(reportIds)
            .setStatus(LMFeedReportStatus.APPROVED)
            .build(),
        )) as never;

      if (UpdatePendingPostStatusCall.success) {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getDisplayMessage(LMDisplayMessages.POST_APPROVED)!,
          );
        }
        window.history.back();
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            UpdatePendingPostStatusCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
        window.history.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnRejectedPostClicked = async (reportIds: number[]) => {
    try {
      const UpdatePendingPostStatusCall: LMResponseType<null> =
        (await lmFeedclient?.updatePendingPostStatus(
          UpdatePendingPostStatusRequest.builder()
            .setReportIds(reportIds)
            .setStatus(LMFeedReportStatus.REJECTED)
            .build(),
        )) as never;

      if (UpdatePendingPostStatusCall.success) {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getDisplayMessage(LMDisplayMessages.POST_REJECTED)!,
          );
        }
        window.history.back();
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            UpdatePendingPostStatusCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
        window.history.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onApprovedCallback = useCallback(
    async (report: Report) => {
      try {
        const CloseReportRequestCall: LMResponseType<null> =
          (await lmFeedclient?.closeReport(
            CloseReportRequest.builder().setReportId(report.id).build(),
          )) as never;

        if (CloseReportRequestCall.success) {
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              getDisplayMessage(LMDisplayMessages.REPORT_IGNORED)!,
            );
          }
          window.history.back();
        } else {
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              CloseReportRequestCall?.errorMessage ||
                getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
            );
          }
          window.history.back();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedclient, displaySnackbarMessage],
  );

  const onRejectedCallback = useCallback(
    async (report: Report) => {
      try {
        const CloseReportRequestCall: LMResponseType<null> =
          (await lmFeedclient?.deletePost(
            DeletePostRequest.builder()
              .setPostId(report.entityId)
              // .setDeleteReason(report.reason)
              .build(),
          )) as never;

        if (CloseReportRequestCall.success) {
          const CloseReportRequestCall: LMResponseType<null> =
            (await lmFeedclient?.closeReport(
              CloseReportRequest.builder().setReportId(report.id).build(),
            )) as never;

          if (CloseReportRequestCall.success) {
            if (displaySnackbarMessage) {
              displaySnackbarMessage(
                getDisplayMessage(LMDisplayMessages.POST_DELETED)!,
              );
            }
            window.history.back();
          } else {
            if (displaySnackbarMessage) {
              displaySnackbarMessage(
                CloseReportRequestCall?.errorMessage ||
                  getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
              );
            }
            window.history.back();
          }
        } else {
          if (displaySnackbarMessage) {
            displaySnackbarMessage(
              CloseReportRequestCall?.errorMessage ||
                getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
            );
          }
          window.history.back();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [lmFeedclient, displaySnackbarMessage],
  );

  const editMemberPermissionsHandler = async (report: Report) => {
    try {
      const getMemberRightsCall: GetMemberRightsResponse =
        (await lmFeedclient?.getMemberRights(
          GetMemberRightsRequest.builder()
            .setUuid(report.userReported.sdkClientInfo.uuid)
            .setIsCM(false)
            .build(),
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
        window.history.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateMemberRightsHandler = async () => {
    try {
      const requestBuilder = UpdateMemberRightsRequest.builder()
        .setUuid(currentReport?.userReported.sdkClientInfo.uuid || "")
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
        window.history.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHeaderLeadingTap = () => {
    console.log("leading post handler");
  };
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
  };
}
