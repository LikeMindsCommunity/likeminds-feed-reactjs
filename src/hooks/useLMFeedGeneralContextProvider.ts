import { useState } from "react";

export function useLMFeedGeneralContextProvider(): UseLMFeedGeneralContextProvider {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
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
  };
}
interface UseLMFeedGeneralContextProvider {
  displaySnackbarMessage: (message: string) => void;
  closeSnackbar: () => void;
  showSnackbar: boolean;
  message: string;
}
