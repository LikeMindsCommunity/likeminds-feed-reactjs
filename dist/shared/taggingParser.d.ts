import { ReactNode } from "react";
export declare const parseAndReplaceTags: (text: string) => ReactNode;
export declare const textPreprocessor: (text: string) => {
    showReadMore: boolean;
    text: string;
};
export declare function setTagUserImage(user: any): import("react/jsx-runtime").JSX.Element;
export declare function convertTextToHTML(text: string): HTMLDivElement;
