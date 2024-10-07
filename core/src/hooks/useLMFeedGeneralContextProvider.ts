import { useState } from "react";

export function useLMFeedGeneralContextProvider(): UseLMFeedGeneralContextProvider {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [openPostCreationProgressBar, setOpenPostCreationProgressBar] =
    useState<boolean>(false);
  function displaySnackbarMessage(msg: string) {
    setShowSnackbar(true);
    setMessage(msg);
  }
  function closeSnackbar() {
    setShowSnackbar(false);
    setMessage("");
  }
  return {
    displaySnackbarMessage,
    closeSnackbar,
    message,
    showSnackbar,
    openPostCreationProgressBar,
    setOpenPostCreationProgressBar,
  };
}
interface UseLMFeedGeneralContextProvider {
  displaySnackbarMessage: (message: string) => void;
  closeSnackbar: () => void;
  showSnackbar: boolean;
  message: string;
  openPostCreationProgressBar: boolean;
  setOpenPostCreationProgressBar: (open: boolean) => void;
}
