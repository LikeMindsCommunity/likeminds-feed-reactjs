/* eslint-disable @typescript-eslint/no-explicit-any */
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { Pluralize } from "./variables";

import { TokenValues } from "./enums/tokens";
import { WordAction } from "./enums/wordAction";
import { LMDisplayMessages } from "..";
import { PollMultipleSelectState, PollType } from "./enums/ImPollType";

import { GetCommunityConfigurationsResponse } from "./types/api-responses/getComunityConfigurations";
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
  } else if (diffMinutes > 0) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return "Just Now";
  }
};

const formatDate = (milliseconds: number) => {
  const date = new Date(milliseconds);

  // Explicitly typing the options object
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).replace(",", "");
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

export {
  formatTimeAgo,
  timeFromNow,
  truncateString,
  formatFileSize,
  formatDate,
};
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

export function getCommunityConfigurationFromLocalStorage(): GetCommunityConfigurationsResponse {
  return JSON.parse(
    localStorage.getItem(TokenValues.COMMUNITY_CONFIGURATIONS)!,
  ) as GetCommunityConfigurationsResponse;
}

export function pluralizeOrCapitalize(
  word: string,
  action: WordAction,
): string {
  switch (action) {
    case WordAction.FIRST_LETTER_CAPITAL_SINGULAR:
      return (
        Pluralize().singular(word).charAt(0).toUpperCase() +
        Pluralize().singular(word).slice(1).toLowerCase()
      );

    case WordAction.ALL_CAPITAL_SINGULAR:
      return Pluralize().singular(word).toUpperCase();

    case WordAction.ALL_SMALL_SINGULAR:
      return Pluralize().singular(word).toLowerCase();

    case WordAction.FIRST_LETTER_CAPITAL_PLURAL:
      return (
        Pluralize().plural(word).charAt(0).toUpperCase() +
        Pluralize().plural(word).slice(1).toLowerCase()
      );

    case WordAction.ALL_CAPITAL_PLURAL:
      return Pluralize().plural(word).toUpperCase();

    case WordAction.ALL_SMALL_PLURAL:
      return Pluralize().plural(word).toLowerCase();

    default:
      throw new Error("Invalid action type");
  }
}

export function changePostCase(action: WordAction, word?: string) {
  const communityConfigurations =
    getCommunityConfigurationFromLocalStorage()?.communityConfigurations;
  const postVariable =
    communityConfigurations?.find((config) => config.type === "feed_metadata")
      ?.value?.post || "post";
  return pluralizeOrCapitalize(word || postVariable, action);
}

export function changePollCase(action: WordAction, word?: string) {
  const communityConfigurations =
    getCommunityConfigurationFromLocalStorage()?.communityConfigurations;
  const pollVariable =
    communityConfigurations?.find((config) => config.type === "feed_metadata")
      ?.value?.poll || "poll";
  return pluralizeOrCapitalize(word || pollVariable, action);
}

export function changeCommentCase(action: WordAction, word?: string) {
  const communityConfigurations =
    getCommunityConfigurationFromLocalStorage()?.communityConfigurations;
  const commentVariable =
    communityConfigurations?.find((config) => config.type === "feed_metadata")
      ?.value?.comment || "comment";
  return pluralizeOrCapitalize(word || commentVariable, action);
}

export function changeLikeCase(action: WordAction, word?: string) {
  const communityConfigurations =
    getCommunityConfigurationFromLocalStorage()?.communityConfigurations;
  const likeVariable =
    communityConfigurations?.find((config) => config.type === "feed_metadata")
      ?.value?.likeEntityVariable?.entityName || "like";
  return pluralizeOrCapitalize(word || likeVariable, action);
}

export function getDisplayMessage(message: LMDisplayMessages) {
  switch (message) {
    case LMDisplayMessages.POST_DELETED_SUCCESSFULLY:
      return `The ${changePostCase(WordAction.ALL_SMALL_SINGULAR)} was deleted successfully`;
    case LMDisplayMessages.POST_PINNED_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} pinned`;
    case LMDisplayMessages.PIN_REMOVED_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} unpinned`;
    case LMDisplayMessages.POST_CREATED_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} created`;
    case LMDisplayMessages.POST_EDIT_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} edited`;
    case LMDisplayMessages.POST_LIKE_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} liked`;
    case LMDisplayMessages.REPLY_DELETED_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} deleted`;
    case LMDisplayMessages.POST_REPORTED_SUCCESSFULLY:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} reported`;
    case LMDisplayMessages.COMMENT_DELETED_SUCCESS:
      return "Comment deleted";
    case LMDisplayMessages.ERROR_LOADING_POST:
      return `error loading ${changePostCase(WordAction.ALL_SMALL_SINGULAR)}`;
    case LMDisplayMessages.POST_HIDE_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} hidden`;
    case LMDisplayMessages.POST_UNHIDE_SUCCESS:
      return `${changePostCase(WordAction.ALL_SMALL_SINGULAR)} unhidden`;
    case LMDisplayMessages.POLL_OPTIONS_SHOULD_BE_UNIQUE:
      return `Poll options should be unique`;
    case LMDisplayMessages.POST_APPROVED:
      return `Post approved`;
    case LMDisplayMessages.POST_REJECTED:
      return `Post rejected`;
    case LMDisplayMessages.REPORT_IGNORED:
      return `Report ignored`;
    case LMDisplayMessages.POST_DELETED:
      return `Post deleted`;
    case LMDisplayMessages.RIGHTS_UPDATED:
      return `Rights updated`;
  }
}

export const renderMessage = (state: number): string => {
  switch (state) {
    case 0:
      return "exactly";
    case 1:
      return "at most";
    case 2:
      return "at least";
    default:
      return "Unknown state";
  }
};

export const previewMultiSelectStateModifier = (
  state: string | undefined,
): string => {
  switch (state) {
    case "exactly":
      return "exactly";
    case "at_max":
      return "at most";
    case "at_least":
      return "at least";
    default:
      return "Unknown state";
  }
};

export const numberToPollMultipleSelectState: {
  [key: number]: PollMultipleSelectState;
} = {
  0: PollMultipleSelectState.EXACTLY,
  1: PollMultipleSelectState.AT_MAX,
  2: PollMultipleSelectState.AT_LEAST,
};

export interface WidgetResponse {
  id: string;
  lmMeta: Record<string, any> | null; // Nullable key
  createdAt: number;
  metadata: Record<string, any>;
  parentEntityId: string;
  parentEntityType: string;
  updatedAt: number;
}

export const getTimeLeftInPoll = (pollExpiryTime: number): string => {
  const timeLeft = pollExpiryTime - Date.now();
  if (timeLeft <= 0) return "Poll Ended";

  const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
  const HOUR_IN_MILLIS = 60 * 60 * 1000;
  const MINUTE_IN_MILLIS = 60 * 1000;

  const days = Math.floor(timeLeft / DAY_IN_MILLIS);
  const hours = Math.floor((timeLeft % DAY_IN_MILLIS) / HOUR_IN_MILLIS);
  const minutes = Math.floor((timeLeft % HOUR_IN_MILLIS) / MINUTE_IN_MILLIS);

  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  if (minutes > 0) return `${minutes} min left`;
  return "Just Now";
};

export type PollOption = {
  id: string;
  text: string;
  isSelected: boolean;
  percentage: number;
  uuid: string;
  voteCount: number;
};

export const isPollSubmitted = (pollOptions: PollOption[]): boolean => {
  for (const option of pollOptions) {
    if (option.isSelected) {
      return true;
    }
  }
  return false;
};

export const hasPollEnded = (pollExpiryTime: number): boolean => {
  const currentSystemTime = Date.now();
  return pollExpiryTime - currentSystemTime <= 0;
};

export const getPollSelectionText = (
  pollMultiSelectNo: number,
  pollMultiSelectState: PollMultipleSelectState,
): string | null => {
  if (
    pollMultiSelectState === PollMultipleSelectState.EXACTLY &&
    pollMultiSelectNo === 1
  ) {
    return null; // No message needed for EXACTLY 1
  }

  switch (pollMultiSelectState) {
    case PollMultipleSelectState.EXACTLY:
      return `*Select exactly ${pollMultiSelectNo} options`;
    case PollMultipleSelectState.AT_MAX:
      return `*Select at most ${pollMultiSelectNo} options`;
    case PollMultipleSelectState.AT_LEAST:
      return `*Select at least ${pollMultiSelectNo} options`;
    default:
      return null;
  }
};

export const isInstantPoll = (pollType: PollType): boolean => {
  return pollType === PollType.INSTANT;
};

export const isMultiChoicePoll = (
  pollMultiSelectNo: number,
  pollMultiSelectState: PollMultipleSelectState,
): boolean => {
  if (
    pollMultiSelectState === PollMultipleSelectState.EXACTLY &&
    pollMultiSelectNo === 1
  ) {
    return false; // Single choice poll
  }
  return true; // Multi-choice poll
};

type PollProps = {
  pollType: PollType;
  pollOptions: PollOption[];
  pollExpiryTime: number;
  pollMultiSelectNo: number;
  pollMultiSelectState: PollMultipleSelectState;
  isEditMode: boolean;
};

export const shouldShowSubmitButton = ({
  pollType,
  pollOptions,
  pollExpiryTime,
  pollMultiSelectNo,
  pollMultiSelectState,
  isEditMode,
}: PollProps): boolean => {
  // Check if poll is instant and already submitted, or if the poll has ended
  if (
    (isInstantPoll(pollType) && isPollSubmitted(pollOptions)) ||
    hasPollEnded(pollExpiryTime) ||
    (!isInstantPoll(pollType) && !isEditMode)
  ) {
    return false; // Hide the submit button
  }

  // Check if the poll is not a multi-choice poll
  if (!isMultiChoicePoll(pollMultiSelectNo, pollMultiSelectState)) {
    return false; // Hide the submit button
  }

  return true; // Show the submit button
};

type PollPropsForAddOption = {
  pollType: PollType;
  pollOptions: PollOption[];
  pollExpiryTime: number;
  allowAddOption: boolean;
  isEditMode: boolean;
};

export const shouldShowAddOptionButton = ({
  pollType,
  pollOptions,
  pollExpiryTime,
  allowAddOption,
  isEditMode,
}: PollPropsForAddOption): boolean => {
  const isAddOptionAllowedForInstantPoll =
    isInstantPoll(pollType) && !isPollSubmitted(pollOptions);

  const isAddOptionAllowedForDeferredPoll = !isInstantPoll(pollType);

  if (!isInstantPoll(pollType) && !isEditMode) return false;

  if (
    allowAddOption &&
    !hasPollEnded(pollExpiryTime) &&
    (isAddOptionAllowedForInstantPoll || isAddOptionAllowedForDeferredPoll)
  ) {
    return true;
  }

  return false;
};

export const multipleOptionSubmitVoteValidation = (
  pollMultiSelectNo: number,
  pollMultiSelectState: PollMultipleSelectState,
  pollMultiSelectCount: number,
): boolean => {
  if (pollMultiSelectCount == 0) return false;
  switch (pollMultiSelectState) {
    case PollMultipleSelectState.EXACTLY:
      return pollMultiSelectNo === pollMultiSelectCount;
    case PollMultipleSelectState.AT_MAX:
      return pollMultiSelectNo >= pollMultiSelectCount;
    case PollMultipleSelectState.AT_LEAST:
      return pollMultiSelectNo <= pollMultiSelectCount;
    default:
      return false;
  }
};

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options).replace(",", "");
}
