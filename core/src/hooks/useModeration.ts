import { useState, useContext, useEffect, useCallback } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import GlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import {
  GetPendingPostModerationRequest,
  User,
} from "@likeminds.community/feed-js";
import { GetPendingPostModerationResponse } from "../shared/types/api-responses/getPendingPostsForModerationResponse";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { getDisplayMessage } from "../shared/utils";
import { LMDisplayMessages } from "../shared/constants/lmDisplayMessages";
import { Post } from "../shared/types/models/post";
import { Topic } from "../shared/types/models/topic";

export interface Tag {
  id: number;
  name: string;
}

export interface Report {
  accusedUser: User;
  entityId: string;
  id: number;
  isClosed: boolean;
  reason: string;
  reportedByUser: User;
  reportedOn: number;
  type: string;
  tag: Tag;
}

export function useModeration() {
  const [selectedTab, setSelectedTab] = useState<string>("approval");
  const [isPostApprovalEnabled, setIsPostApprovalEnabled] = useState<boolean>(
    JSON.parse(localStorage.getItem("isPostApprovedEnabled") || "false"),
  );
  const { currentCommunity } = useContext(LMFeedUserProviderContext);
  const { lmFeedclient } = useContext(GlobalClientProviderContext);
  const { displaySnackbarMessage } = useContext(GeneralContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [widgets, setWidgets] = useState<Record<string, unknown>>({});
  const [topics, setTopics] = useState<Record<string, Topic>>({});

  const loadPost = useCallback(async () => {
    try {
      const getPendingPostsForModerationCall: GetPendingPostModerationResponse =
        (await lmFeedclient?.getPendingPostsForModeration(
          GetPendingPostModerationRequest.builder().setPage(1).build(),
        )) as never;

      console.log(
        "getPendingPostsForModerationCall",
        getPendingPostsForModerationCall,
      );

      if (getPendingPostsForModerationCall.success) {
        setReports(getPendingPostsForModerationCall.data.reports);
        setPosts(Object.values(getPendingPostsForModerationCall.data.posts));
        // setReplies([...(getPendingPostsForModerationCall.data.post.replies || [])]);
        setUsers({ ...getPendingPostsForModerationCall.data.users });
        setTopics({ ...getPendingPostsForModerationCall.data.topics });
        setWidgets({ ...getPendingPostsForModerationCall.data.widgets });
        // setPageCount((currentPage) => currentPage + 1);
        // if (!getPendingPostsForModerationCall.data.post.replies?.length) {
        //   setLoadNextPage(false);
        // }
      } else {
        if (displaySnackbarMessage) {
          displaySnackbarMessage(
            getPendingPostsForModerationCall?.errorMessage ||
              getDisplayMessage(LMDisplayMessages.ERROR_LOADING_POST)!,
          );
        }
        window.history.back();
      }
    } catch (error) {
      console.log(error);
    }
  }, [lmFeedclient]);

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

  return {
    selectedTab,
    selectTab,
    isPostApprovalEnabled,
    reports,
    posts,
    users,
    widgets,
    topics,
  };
}
