import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface ErrorSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const LMFeedAlerts = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <LMFeedAlerts onClose={onClose} severity="error">
        {message}
      </LMFeedAlerts>
    </Snackbar>
  );
};

export default ErrorSnackbar;
