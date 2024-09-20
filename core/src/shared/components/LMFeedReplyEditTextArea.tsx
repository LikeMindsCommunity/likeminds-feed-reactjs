import React, { useContext, useEffect } from "react";
// import { getAvatar } from "./LMUserMedia";
// import LMFeedUserProviderContext from "../../contexts/LMFeedUserProviderContext";
import replyAction from "../../assets/images/reply-action.svg";

import { findTag, returnCSSForTagging, setCursorAtEnd } from "../utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTagging } from "../../hooks/useTagging";

import { convertTextToHTML, setTagUserImage } from "../taggingParser";
import { useLMPostReply } from "../../hooks/useLMPostReply";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";

import LMFeedGlobalClientProviderContext from "../../contexts/LMFeedGlobalClientProviderContext";
import { FeedPostContext } from "../../contexts/LMFeedPostContext";
export interface LMFeedReplyEditTextAreaProps {
  closeEditMode?: () => void;
}
const LMFeedReplyEditTextArea = ({
  closeEditMode,
}: LMFeedReplyEditTextAreaProps) => {
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  const { post } = useContext(FeedPostContext);
  const { reply } = useContext(ReplyContext);
  //   const { currentUser } = useContext(LMFeedUserProviderContext);

  const { taggingList, clearTaggingList, fetchTaggingList, setTaggingString } =
    useTagging();
  const {
    // replyText = "",
    setReplyText,
    textFieldRef,
    containerRef,
    editComment,
  } = useLMPostReply(post?.id?.split("-")[0].toString() || "", reply?.id || "");

  useEffect(() => {
    if (textFieldRef?.current) {
      textFieldRef.current.innerHTML = convertTextToHTML(
        reply?.text || "",
      ).innerHTML;
      setReplyText!(textFieldRef.current.textContent || "");
      // Setting the cursor at the end of the div
      textFieldRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(textFieldRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textFieldRef, setReplyText]);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !(
          (e.target as HTMLElement).classList.contains("lm-hover-effect") ||
          (e.target as HTMLElement).classList.contains("reply-editor")
        )
      ) {
        if (closeEditMode) {
          closeEditMode();
        }
      }
    }

    if (containerRef && containerRef.current) {
      document.addEventListener("click", handleClickOutside);

      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [containerRef, closeEditMode, textFieldRef]);
  function editReply() {
    if (closeEditMode) {
      if (!reply?.parentComment) {
        lmfeedAnalyticsClient?.sendCommentEditedEvent(post!, reply!);
      } else {
        lmfeedAnalyticsClient?.sendReplyEditedEvent(
          post!,
          reply!.parentComment!,
          reply!,
        );
      }
      editComment();
      closeEditMode();
    }
  }

  return (
    <div className="lm-d-flex lm-flex-grow lm-align-items-center lm-feed-reply">
      <div ref={containerRef} className="lm-flex-grow">
        {taggingList && taggingList?.length > 0 ? (
          <div
            className="taggingBox"
            id="scrollableTaggingContainer"
            style={returnCSSForTagging(containerRef!)}
          >
            <InfiniteScroll
              loader={null}
              hasMore={true}
              next={fetchTaggingList}
              dataLength={taggingList.length}
              scrollableTarget="scrollableTaggingContainer"
            >
              {taggingList?.map((item) => {
                return (
                  <button
                    key={item?.id.toString() + Math.random().toString()}
                    className="taggingTile reply-editor"
                    onClick={(e) => {
                      e.preventDefault();
                      const focusNode = window.getSelection()!.focusNode;
                      if (focusNode === null) {
                        return;
                      }
                      const div = focusNode.parentElement;
                      const text = div!.childNodes;
                      if (focusNode === null || text.length === 0) {
                        return;
                      }
                      const textContentFocusNode = focusNode.textContent;
                      if (textContentFocusNode === null) {
                        return;
                      }
                      const tagOp = findTag(textContentFocusNode);
                      // ('the tag string is ', tagOp!.tagString);
                      if (tagOp === undefined) return;
                      const { limitLeft, limitRight } = tagOp;
                      const textNode1Text = textContentFocusNode.substring(
                        0,
                        limitLeft - 1,
                      );
                      const textNode2Text = textContentFocusNode.substring(
                        limitRight + 1,
                      );
                      const textNode1 = document.createTextNode(textNode1Text);
                      const anchorNode = document.createElement("a");
                      anchorNode.id = item?.id.toString();
                      anchorNode.href = "#";
                      anchorNode.textContent = `@${item?.name.trim()}`;
                      anchorNode.contentEditable = "false";
                      const textNode2 = document.createTextNode(textNode2Text);
                      const dummyNode = document.createElement("span");
                      div!.replaceChild(textNode2, focusNode);
                      div!.insertBefore(anchorNode, textNode2);
                      div!.insertBefore(dummyNode, anchorNode);
                      div!.insertBefore(textNode1, dummyNode);
                      clearTaggingList();
                      setCursorAtEnd(textFieldRef!);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="tag-container reply-editor"
                    >
                      {setTagUserImage(item)}
                      <div
                        style={{
                          padding: "0px 0.5rem",
                          textTransform: "capitalize",
                          overflowY: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        className="tag-name reply-editor"
                      >
                        {item?.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : null}
        <div
          ref={textFieldRef}
          contentEditable={true}
          suppressContentEditableWarning
          tabIndex={0}
          autoFocus={true}
          data-placeholder="Write something here..."
          className="edit-reply-text-area"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              //prevent the default behaviour (where the browser would add a new text node)
              document.execCommand("insertLineBreak");
              event.preventDefault();
            }
          }}
          onInput={(event: React.KeyboardEvent<HTMLDivElement>) => {
            const selection = window.getSelection();
            setReplyText!(event.currentTarget.textContent!);
            if (selection === null) return;
            const focusNode = selection.focusNode;
            if (focusNode === null) {
              return;
            }
            const div = focusNode.parentElement;
            if (div === null) {
              return;
            }
            const replyText = div.childNodes;
            if (focusNode === null || replyText.length === 0) {
              return;
            }
            const textContentFocusNode = focusNode.textContent;
            const tagOp = findTag(textContentFocusNode!);
            if (tagOp?.tagString !== null && tagOp?.tagString !== undefined) {
              setTaggingString(tagOp?.tagString);
            } else {
              setTaggingString(null);
            }
          }}
        ></div>
      </div>
      <img
        src={replyAction}
        alt="edit-reply-action"
        className="lm-cursor-pointer"
        onClick={editReply}
      />
    </div>
  );
};

export default LMFeedReplyEditTextArea;
