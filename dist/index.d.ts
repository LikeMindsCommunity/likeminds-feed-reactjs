import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { LMFeedClient } from '@likeminds.community/feed-js-beta';

interface Theme$1 {
    pellete?: ThemePellete;
    typography?: ThemeTypography;
    mode?: string;
}
interface ThemeTypography {
    fontFamily?: string;
    fontSizes?: ThemeTextSizes;
}
interface ThemePellete {
    primary?: string;
    secondary?: string;
    error?: string;
    warning?: string;
    info?: string;
    success?: string;
}
interface ThemeTextSizes {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
}

declare class Theme {
    private defaultThemeTextSizes;
    private defaultThemePellete;
    private defaultFontFamily;
    theme: Theme$1;
    private defaultMode;
    constructor(theme?: Theme$1);
}

interface LMFeedProps<T> {
    client: T;
    theme?: Theme;
    showMember?: boolean;
    routes?: {
        base?: string;
        postDetails?: string;
    };
}
declare function LMFeed({ theme, children, client, }: PropsWithChildren<LMFeedProps<LMFeedClient>>): react_jsx_runtime.JSX.Element;

export { LMFeed as default };
