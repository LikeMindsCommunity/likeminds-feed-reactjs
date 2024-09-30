/* eslint-disable @typescript-eslint/no-explicit-any */
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import pluralize from "pluralize";
dayjs.extend(relativeTime);

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  // Calculate time difference in seconds
  const diffSeconds = Math.floor(diff / 1000);

  // Convert seconds to minutes
  const diffMinutes = Math.floor(diffSeconds / 60);

  // Convert minutes to hours
  const diffHours = Math.floor(diffMinutes / 60);

  // Convert hours to days
  const diffDays = Math.floor(diffHours / 24);

  // Convert days to months
  const diffMonths = Math.floor(diffDays / 30);

  // Convert months to years
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  }
};
// TODO remove the daysjs dependency and manually do it
const timeFromNow = (time: string) => dayjs(time).fromNow();

// Function to truncate a string
const truncateString = (str: string, maxLength: number) => {
  if (!str) {
    str = "";
  }
  if (str?.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + "...";
};

// Function to calculate the file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + " Bytes";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};

export { formatTimeAgo, timeFromNow, truncateString, formatFileSize };
export function getCharacterWidth(character: string): number {
  const font: string = "Roboto",
    fontSize: number = 16;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = `${fontSize}px ${font}`;
    const metrics = context.measureText(character);
    return metrics.width;
  } else {
    return 0;
  }
}
export const getCaretPosition = (): number => {
  const selection = window.getSelection();
  const editableDiv = selection?.focusNode as Node;
  let caretPos = 0;
  if (window.getSelection()) {
    if (selection?.rangeCount && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableDiv);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretPos = preCaretRange.toString().length;
    }
  }
  return caretPos;
};
export function checkAtSymbol(str: string, index: number): number {
  if (index < 0 || index >= str.length) {
    return -1;
  }
  let pos = -1;
  for (let i = index; i >= 0; i--) {
    if (str[i] === "@") {
      pos = i;
      break;
    }
  }
  if (pos === -1) {
    return -1;
  } else if (pos === 0) {
    return 1;
  } else if (pos > 0 && /\s/.test(str[pos - 1])) {
    return pos + 1;
  } else {
    return -1;
  }
}
export function findSpaceAfterIndex(str: string, index: number): number {
  if (index < 0 || index >= str.length) {
    throw new Error("Invalid index");
  }
  let pos = -1;
  for (let i = index + 1; i < str.length; i++) {
    if (str[i] === " ") {
      pos = i - 1;
      break;
    } else if (str[i] === "@") {
      pos = i - 1;
      break;
    }
  }
  if (pos === -1) {
    return str.length - 1;
  } else {
    return pos;
  }
}
export interface TagInfo {
  tagString: string;
  limitLeft: number;
  limitRight: number;
}
export function findTag(str: string): TagInfo | undefined {
  if (str.length === 0) {
    return undefined;
  }
  const cursorPosition = getCaretPosition();

  // // ("the cursor position is: ", cursorPosition)
  const leftLimit = checkAtSymbol(str, cursorPosition - 1);

  if (leftLimit === -1) {
    return undefined;
  }
  const rightLimit = findSpaceAfterIndex(str, cursorPosition - 1);
  // // ("the right limit is :", rightLimit)
  const substr = str.substring(leftLimit, rightLimit + 1);

  return {
    tagString: substr,
    limitLeft: leftLimit,
    limitRight: rightLimit,
  };
}
export function returnCSSForTagging(
  refObject: React.MutableRefObject<HTMLDivElement | null>,
) {
  if (!(refObject && refObject.current)) {
    return;
  }
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const resObject: {
    left: string | number;
    position: string;
    top: string | number;
  } = {
    left: "0px",
    position: "absolute",
    top: "0px",
  };
  if (selection === null) {
    return {};
  }
  const focusNodeParentBoundings =
    selection.focusNode?.parentElement?.getBoundingClientRect();
  resObject.top = (
    focusNodeParentBoundings!.top -
    refObject.current!.getBoundingClientRect()!.top +
    30
  )
    .toString()
    .concat("px");
  const leftSubstring =
    selection.focusNode?.parentElement?.textContent?.substring(
      0,
      selection.focusOffset - 1,
    );
  const width = getCharacterWidth(leftSubstring!);
  if (width > 264) {
    resObject.left = "264px";
  } else {
    resObject.left = width;
  }
  resObject.position = "absolute";
  return resObject;
}

export function setCursorAtEnd(
  contentEditableDiv: React.MutableRefObject<HTMLDivElement | null>,
): void {
  if (!contentEditableDiv.current) return;

  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(contentEditableDiv.current);
  range.collapse(false);

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }

  contentEditableDiv.current.focus();
}
export function setEndOfContenteditable(
  contentEditableElement: HTMLDivElement,
) {
  let range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection?.removeAllRanges(); //remove any selections already made
    selection?.addRange(range); //make the range you have just created the visible selection
  }
}
export function extractTextFromNode(node: any): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.nodeName === "A") {
      let textContent: string = node.textContent;
      textContent = textContent.substring(1);
      const id = node.getAttribute("id");
      return `<<${textContent}|route://user_profile/${id}>>`;
    } else if (node.nodeName === "BR") {
      return "\n"; // Add a new line
    } else if (node.nodeName === "SPAN") {
      return "";
    } else {
      let text = "";
      const childNodes = node.childNodes;
      for (const childNode of childNodes) {
        const retText = extractTextFromNode(childNode);
        text += retText;
      }
      return "\n" + text;
    }
  } else {
    return "";
  }
}
export function returnPostId() {
  const location = window.location;
  const search = location.search;
  const searchParams = new URLSearchParams(search);
  const postId = searchParams.get("id");
  if (postId) {
    return postId;
  } else {
    return "";
  }
}

// Define the WordAction enum
enum WordAction {
  FIRST_LETTER_CAPITAL_SINGULAR = "FIRST_LETTER_CAPITAL_SINGULAR",
  ALL_CAPITAL_SINGULAR = "ALL_CAPITAL_SINGULAR",
  ALL_SMALL_SINGULAR = "ALL_SMALL_SINGULAR",
  FIRST_LETTER_CAPITAL_PLURAL = "FIRST_LETTER_CAPITAL_PLURAL",
  ALL_CAPITAL_PLURAL = "ALL_CAPITAL_PLURAL",
  ALL_SMALL_PLURAL = "ALL_SMALL_PLURAL",
}

export function pluralizeOrCapitalize(
  word: string,
  action: WordAction,
): string {
  switch (action) {
    case WordAction.FIRST_LETTER_CAPITAL_SINGULAR:
      return (
        pluralize.singular(word).charAt(0).toUpperCase() +
        pluralize.singular(word).slice(1).toLowerCase()
      );

    case WordAction.ALL_CAPITAL_SINGULAR:
      return pluralize.singular(word).toUpperCase();

    case WordAction.ALL_SMALL_SINGULAR:
      return pluralize.singular(word).toLowerCase();

    case WordAction.FIRST_LETTER_CAPITAL_PLURAL:
      return (
        pluralize.plural(word).charAt(0).toUpperCase() +
        pluralize.plural(word).slice(1).toLowerCase()
      );

    case WordAction.ALL_CAPITAL_PLURAL:
      return pluralize.plural(word).toUpperCase();

    case WordAction.ALL_SMALL_PLURAL:
      return pluralize.plural(word).toLowerCase();

    default:
      throw new Error("Invalid action type");
  }
}
