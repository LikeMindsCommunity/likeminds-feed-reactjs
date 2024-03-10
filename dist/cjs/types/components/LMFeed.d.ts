import { PropsWithChildren } from "react";
import { Theme } from "../Themes/ThemeClass";
import { LMClient } from "../types/DataLayerExportsTypes";
export interface LMFeedProps<T> {
    client: T;
    theme?: Theme;
    showMember?: boolean;
    routes?: {
        base?: string;
        postDetails?: string;
    };
}
declare function LMFeed({ theme, children, client, }: PropsWithChildren<LMFeedProps<LMClient>>): import("react/jsx-runtime").JSX.Element;
export default LMFeed;
