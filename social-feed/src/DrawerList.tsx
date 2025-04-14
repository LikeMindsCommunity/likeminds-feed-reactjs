import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import toggleIcon from "./assets/toggle-icon.svg";
import HomeIcon from "./assets/bottombar-home-icon.svg";
import SelectedHomeIcon from "./assets/sidenav-selected-home.svg";
import ModerationIcon from "./assets/sidenav-unselected-moderation.svg";
import SelectedModerationIcon from "./assets/bottom-bar-moderation-icon.svg";
import CancelIcon from "./assets/cancel-model-icon.svg";
import { LMFeedCurrentUserState } from "@likeminds.community/likeminds-feed-reactjs-beta";

const DrawerList = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem("LOCAL_USER") || "{}");
  const isCM = user?.state === LMFeedCurrentUserState.CM;
  const currentScreen = window.location.pathname.includes("moderation");
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
            !currentScreen
              ? { backgroundColor: "#F5F5F5", color: "#5046e5" }
              : {}
          }
        >
          <ListItemButton
            className="lm-sidebar-headings"
            onClick={() => navigate("/")}
          >
            <ListItemIcon>
              {!currentScreen ? (
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
        {isCM ? (
          <ListItem
            disablePadding
            sx={
              currentScreen
                ? { backgroundColor: "#F5F5F5", color: "#5046e5" }
                : {}
            }
          >
            <ListItemButton
              className="lm-sidebar-headings"
              onClick={() => navigate("/moderation")}
            >
              <ListItemIcon>
                {currentScreen ? (
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
  );
};

export default DrawerList;
