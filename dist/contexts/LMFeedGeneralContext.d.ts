/// <reference types="react" />
import { LMFeedCustomAppRoutes } from "../shared/types/customProps/routes";
export declare const GeneralContext: import("react").Context<GeneralContextInterface>;
interface GeneralContextInterface {
    displaySnackbarMessage?: (message: string) => void;
    closeSnackbar?: () => void;
    showSnackbar?: boolean;
    message?: string;
    routes?: LMFeedCustomAppRoutes;
    useParentRouter?: boolean;
}
export {};
