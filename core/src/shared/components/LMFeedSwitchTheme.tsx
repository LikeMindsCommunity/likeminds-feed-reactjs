import { Switch, styled, SwitchProps } from "@mui/material";

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#5046E5", // 🔵 Set to your exact blue color
          opacity: 1,
          border: 0,
          ...theme.applyStyles?.("dark", {
            backgroundColor: "#3D36C4", // Darker blue for dark mode
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#5046E5", // 🔵 Blue glow when focused
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles?.("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles?.("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 16,
      height: 16,
      backgroundColor: "#fff", // Keep the thumb white
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA", // Default gray when OFF
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles?.("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

export default IOSSwitch;
