import React, { useContext, useEffect } from "react";
import { LMFeedCreatePostContext } from "../../contexts/LMFeedCreatePostContext";
import { findTag, returnCSSForTagging, setCursorAtEnd } from "../utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTagging } from "../../hooks/useTagging";

import { convertTextToHTML, setTagUserImage } from "../taggingParser";
import LMFeedGlobalClientProviderContext from "../../contexts/LMFeedGlobalClientProviderContext";
// import LMFeedGlobalClientProviderContext from "../../contexts/LMFeedGlobalClientProviderContext";

const LMFeedTextArea = () => {
  const {
    taggingList,
    clearTaggingList,
    fetchTaggingList,
    setTaggingString,
    fetchMoreTags,
  } = useTagging();
  const { setPostText, textFieldRef, containerRef, temporaryPost } = useContext(
    LMFeedCreatePostContext,
  );
  const { lmfeedAnalyticsClient } = useContext(
    LMFeedGlobalClientProviderContext,
  );
  // const { customEventClient } = useContext(LMFeedGlobalClientProviderContext);
  function setCursorToTheEnd() {
    if (textFieldRef?.current) {
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
  }
  // useEffect(() => {
  //   if (textFieldRef?.current && customEventClient) {
  //     const eventL = customEventClient.createEventListener(() => {});
  //     textFieldRef.current.addEventListener(
  //       "click",
  //       (() => console.log(this)).bind(eventL),
  //     );
  //   }
  // }, [customEventClient, textFieldRef]);

  useEffect(() => {
    if (temporaryPost && textFieldRef?.current) {
      textFieldRef.current.innerHTML = convertTextToHTML(
        temporaryPost.text,
      ).innerHTML;
    }
    setCursorToTheEnd();
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
            hasMore={fetchMoreTags}
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

                    const selection = window.getSelection();

                    if (!selection) {
                      return;
                    }

                    const focusNode = selection.focusNode;

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
                    lmfeedAnalyticsClient?.sendUserTaggedInPostEvent(
                      item?.id?.toString() || "",
                    );
                    const textNode1 = document.createTextNode(textNode1Text);
                    const anchorNode = document.createElement("a");
                    anchorNode.id = item?.id.toString();
                    anchorNode.href = "#";
                    anchorNode.textContent = `@${item?.name.trim()} `;
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
        data-placeholder="Write something here..."
        className="lm-feed-create-post-text-area"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            //prevent the default behaviour (where the browser would add a new text node)
            // document.execCommand("insertLineBreak");
            // event.preventDefault();
            const selection = window.getSelection()!;
            const range = selection.getRangeAt(0).cloneRange();
            const p = document.createElement("p");
            const br = document.createElement("br");
            p.appendChild(br);
            textFieldRef?.current?.appendChild(p);
            range.setStart(p, 0);
            range.setEnd(p, 0);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }}
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
