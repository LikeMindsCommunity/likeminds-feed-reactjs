import React, { useContext, useEffect } from "react";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";
import { findTag, returnCSSForTagging, setCursorAtEnd } from "../utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTagging } from "../../hooks/useTagging";

import { convertTextToHTML, setTagUserImage } from "../taggingParser";

const LMFeedTextArea = () => {
  const { taggingList, clearTaggingList, fetchTaggingList, setTaggingString } =
    useTagging();
  const { setPostText, textFieldRef, containerRef, temporaryPost } = useContext(
    LMFeedCreatePostContext,
  );
  useEffect(() => {
    if (temporaryPost && textFieldRef?.current) {
      textFieldRef.current.innerHTML = convertTextToHTML(
        temporaryPost.text,
      ).innerHTML;
      // setPostText!(textFieldRef.current.textContent || "");
    }
  }, [textFieldRef, temporaryPost]);
  return (
    <div ref={containerRef}>
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
            {taggingList?.map!((item) => {
              return (
                <button
                  key={item?.id.toString() + Math.random().toString()}
                  className="taggingTile"
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
                  >
                    {setTagUserImage(item)}
                    <div
                      style={{
                        padding: "0px 0.5rem",
                        textTransform: "capitalize",
                        overflowY: "hidden",
                        textOverflow: "ellipsis",
                      }}
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
        id="editableDiv"
        data-placeholder="Write something here...."
        className="lm-feed-create-post-text-area"
        onInput={(event: React.KeyboardEvent<HTMLDivElement>) => {
          const selection = window.getSelection();
          setPostText!(event.currentTarget.textContent!);
          if (selection === null) return;
          const focusNode = selection.focusNode;
          if (focusNode === null) {
            return;
          }
          const div = focusNode.parentElement;
          if (div === null) {
            return;
          }
          const postText = div.childNodes;
          if (focusNode === null || postText.length === 0) {
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
  );
};

export default LMFeedTextArea;
