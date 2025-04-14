import { Switch, styled, SwitchProps } from "@mui/material";

const IOSSwitch = styled((props: SwitchProps) => {
  return <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />;
})(({ theme }) => {
  // Retrieve the latest CSS variable value inside the function
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--lm-feed-primary-color")
    .trim() || "#5046E5"; // Fallback color

  return {
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
          backgroundColor: primaryColor, // Now it dynamically updates
          opacity: 1,
          border: 0,
          ...theme.applyStyles?.("dark", {
            backgroundColor: "#3D36C4", // Dark mode fallback
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: primaryColor,
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
      backgroundColor: "#fff",
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles?.("dark", {
        backgroundColor: "#39393D",
      }),
    },
  };
});

export default IOSSwitch;
