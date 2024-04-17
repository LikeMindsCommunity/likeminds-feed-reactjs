import { createContext } from "react";

export const GeneralContext = createContext<GeneralContextInterface>({});

interface GeneralContextInterface {
  displaySnackbarMessage?: (message: string) => void;
  closeSnackbar?: () => void;
  showSnackbar?: boolean;
  message?: string;
}
