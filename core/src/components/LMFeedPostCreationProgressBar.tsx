import { CircularProgress, Snackbar } from "@mui/material";
import React from "react";
interface LMFeedPostCreationProgressBarInterface {
  open: boolean;
}
const LMFeedPostCreationProgressBar = ({
  open,
}: LMFeedPostCreationProgressBarInterface) => {
  const action = (
    <React.Fragment>
      <CircularProgress />
    </React.Fragment>
  );
  return <Snackbar open={open} message="Creating Post" action={action} />;
};

export default LMFeedPostCreationProgressBar;
