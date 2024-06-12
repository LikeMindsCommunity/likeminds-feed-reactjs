import React from "react";
interface ErrorSnackbarProps {
    open: boolean;
    message: string;
    onClose: () => void;
}
declare const ErrorSnackbar: React.FC<ErrorSnackbarProps>;
export default ErrorSnackbar;
