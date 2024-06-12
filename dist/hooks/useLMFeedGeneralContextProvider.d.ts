export declare function useLMFeedGeneralContextProvider(): UseLMFeedGeneralContextProvider;
interface UseLMFeedGeneralContextProvider {
    displaySnackbarMessage: (message: string) => void;
    closeSnackbar: () => void;
    showSnackbar: boolean;
    message: string;
}
export {};
