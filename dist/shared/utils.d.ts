/// <reference types="react" />
declare const formatTimeAgo: (timestamp: number) => string;
declare const timeFromNow: (time: string) => string;
declare const truncateString: (str: string, maxLength: number) => string;
declare const formatFileSize: (bytes: number) => string;
export { formatTimeAgo, timeFromNow, truncateString, formatFileSize };
export declare function getCharacterWidth(character: string): number;
export declare const getCaretPosition: () => number;
export declare function checkAtSymbol(str: string, index: number): number;
export declare function findSpaceAfterIndex(str: string, index: number): number;
export interface TagInfo {
    tagString: string;
    limitLeft: number;
    limitRight: number;
}
export declare function findTag(str: string): TagInfo | undefined;
export declare function returnCSSForTagging(refObject: React.MutableRefObject<HTMLDivElement | null>): {} | undefined;
export declare function setCursorAtEnd(contentEditableDiv: React.MutableRefObject<HTMLDivElement | null>): void;
export declare function setEndOfContenteditable(contentEditableElement: HTMLDivElement): void;
export declare function extractTextFromNode(node: any): string;
