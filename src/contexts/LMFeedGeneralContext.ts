import { createContext } from "react";
import { RouteModifiers } from "../shared/types/customProps/routes";

export const GeneralContext = createContext<GeneralContextInterface>({});

interface GeneralContextInterface {
  displaySnackbarMessage?: (message: string) => void;
  closeSnackbar?: () => void;
  showSnackbar?: boolean;
  message?: string;
  routes?: RouteModifiers[];
  useParentRouter?: boolean;
}
