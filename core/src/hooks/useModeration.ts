import { useState, useContext, useEffect } from "react";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";

export function useModeration() {
  const [selectedTab, setSelectedTab] = useState<string>("approval");
  const [isPostApprovalEnabled, setIsPostApprovalEnabled] = useState<boolean>(
    JSON.parse(localStorage.getItem("isPostApprovedEnabled") || "false"),
  );
  const { currentCommunity } = useContext(LMFeedUserProviderContext);

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

  function selectTab(tab: string) {
    setSelectedTab(tab);
  }

  return { selectedTab, selectTab, isPostApprovalEnabled };
}
