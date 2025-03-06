import { LMFeedCustomEvents } from "../customEvents";
import LMFeedNotification from "./LMFeedNotification";
import toggleIcon from "../../assets/images/toggle-icon.svg";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "../../assets/images/bottombar-home-icon.svg";
import SelectedHomeIcon from "../../assets/images/sidenav-selected-home.svg";
import ModerationIcon from "../../assets/images/sidenav-unselected-moderation.svg";
import SelectedModerationIcon from "../../assets/images/bottom-bar-moderation-icon.svg";
import CancelIcon from "../../assets/images/cancel-model-icon.svg";
import { LMFeedCustomActionEvents } from "../constants/lmFeedCustomEventNames";
import { SideNavbarState } from "../../shared/enums/lmSideNavbar";

const LMFeedNotificationHeader = ({
  customEventClient,
}: {
  customEventClient: LMFeedCustomEvents;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUserCM, setIsUserCM] = useState<boolean>(false);
  const currentScreen = localStorage.getItem(
    LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE || SideNavbarState.HOME,
  );
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const handleUserStatus = (event: Event) => {
      setIsUserCM((event as CustomEvent).detail.currentState);
    };

    customEventClient?.listen(
      LMFeedCustomActionEvents.CURRENT_USER_CM,
      handleUserStatus,
    );

    return () => {
      customEventClient?.remove(LMFeedCustomActionEvents.CURRENT_USER_CM);
    };
  }, [customEventClient]);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding sx={{ backgroundColor: "#F5F5F5" }}>
          <ListItemButton>
            <ListItemIcon className="toggle-sidebar-menu-header">
              <ListItemText
                primary={"Community"}
                primaryTypographyProps={{ fontWeight: 700, color: "#333333" }}
              />
              <img src={CancelIcon} alt="close-icon" />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          sx={
            currentScreen === SideNavbarState.HOME
              ? { backgroundColor: "#F5F5F5", color: "#5046e5" }
              : {}
          }
        >
          <ListItemButton
            className="lm-sidebar-headings"
            onClick={() => {
              customEventClient.dispatchEvent(
                LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
                {
                  currentState: SideNavbarState.HOME,
                },
              );
            }}
          >
            <ListItemIcon>
              {currentScreen === SideNavbarState.HOME ? (
                <img
                  src={SelectedHomeIcon}
                  alt="post approval"
                  className="disabled-icons-size"
                />
              ) : (
                <img
                  src={HomeIcon}
                  alt="post approval"
                  className="disabled-icons-size"
                />
              )}
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        {isUserCM ? (
          <ListItem
            disablePadding
            sx={
              currentScreen === SideNavbarState.MODERATION
                ? { backgroundColor: "#F5F5F5", color: "#5046e5" }
                : {}
            }
          >
            <ListItemButton
              className="lm-sidebar-headings"
              onClick={() => {
                customEventClient.dispatchEvent(
                  LMFeedCustomActionEvents.SIDE_NAVBAR_CURRENT_STATE,
                  {
                    currentState: SideNavbarState.MODERATION,
                  },
                );
              }}
            >
              <ListItemIcon>
                {currentScreen === SideNavbarState.MODERATION ? (
                  <img
                    src={SelectedModerationIcon}
                    alt="post approval"
                    className="disabled-icons-size"
                  />
                ) : (
                  <img
                    src={ModerationIcon}
                    alt="post approval"
                    className="disabled-icons-size"
                  />
                )}
              </ListItemIcon>
              <ListItemText primary={"Moderation"} />
            </ListItemButton>
          </ListItem>
        ) : null}
      </List>
    </Box>
  );

  return (
    <div className="lm-header-notification">
      <div className="lm-header-toggle-wrapper">
        <div className="lm-mobile-view-toggle-bar">
          <img
            onClick={toggleDrawer(true)}
            src={toggleIcon}
            alt="post approval"
            className="disabled-icons-size cursor-pointer"
          />
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </div>
        <h1>LMFeed</h1>
      </div>

      <div>
        <LMFeedNotification customEventClient={customEventClient} />
      </div>
    </div>
  );
};

export default LMFeedNotificationHeader;
