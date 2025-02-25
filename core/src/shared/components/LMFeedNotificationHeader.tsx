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
import ModerationIcon from "../../assets/images/bottom-bar-moderation-icon.svg";
import CancelIcon from "../../assets/images/cancel-model-icon.svg";

const LMFeedNotificationHeader = ({
  customEventClient,
}: {
  customEventClient: LMFeedCustomEvents;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUserCM, setIsUserCM] = useState<boolean>(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const handleUserStatus = (event: any) => {
      console.log("event", event);
      setIsUserCM(event.detail.currentState);
    };

    customEventClient?.listen("isCurrentUserCM", handleUserStatus);

    return () => {
      customEventClient?.remove("isCurrentUserCM");
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

        <ListItem disablePadding>
          <ListItemButton
            className="lm-sidebar-headings"
            onClick={() => {
              customEventClient.dispatchEvent("sideNavbarState", {
                currentState: "home",
              });
            }}
          >
            <ListItemIcon>
              <img
                src={HomeIcon}
                alt="post approval"
                className="disabled-icons-size"
              />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        {isUserCM ? (
          <ListItem disablePadding>
            <ListItemButton
              className="lm-sidebar-headings"
              onClick={() => {
                customEventClient.dispatchEvent("sideNavbarState", {
                  currentState: "moderation",
                });
              }}
            >
              <ListItemIcon>
                <img
                  src={ModerationIcon}
                  alt="post approval"
                  className="disabled-icons-size"
                />
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
