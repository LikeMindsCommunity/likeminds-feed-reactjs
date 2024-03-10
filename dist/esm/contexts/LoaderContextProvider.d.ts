import React from "react";
interface LoaderContextProviderInterface {
    loader: boolean;
    setLoader: ((val: boolean) => void) | null;
}
declare const _default: React.Context<LoaderContextProviderInterface>;
export default _default;
