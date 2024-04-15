import React, { useContext } from "react";
import { getAvatar } from "./LMUserMedia";
import LMFeedUserProviderContext from "../../contexts/LMFeedUserProviderContext";
import replyAction from "../../assets/images/reply-action.svg";

import { findTag, returnCSSForTagging, setCursorAtEnd } from "../utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTagging } from "../../hooks/useTagging";

import { setTagUserImage } from "../taggingParser";
import { useLMPostReply } from "../../hooks/useLMPostReply";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import { useParams } from "react-router-dom";

const LMFeedReplyTextArea = ({
  setOpenReplyText,
}: {
  setOpenReplyText?: React.Dispatch<boolean>;
}) => {
  const { reply } = useContext(ReplyContext);
  const { currentUser } = useContext(LMFeedUserProviderContext);
  const { id } = useParams();
  const { name, imageUrl } = currentUser!;
  const avatar = getAvatar({
    imageUrl,
    name,
  });
  const { taggingList, clearTaggingList, fetchTaggingList, setTaggingString } =
    useTagging();
  const {
    // replyText = "",
    setReplyText,
    textFieldRef,
    containerRef,
    postReply,
    postComment,
  } = useLMPostReply(id?.split("-")[0].toString() || "", reply?.Id || "");
  //   useEffect(() => {
  //     if (temporaryPost && textFieldRef?.current) {
  //       textFieldRef.current.innerHTML = convertTextToHTML(
  //         temporaryPost.text,
  //       ).innerHTML;
  //       setReplyText!(textFieldRef.current.textContent || "");
  //     }
  //   }, [textFieldRef, setReplyText]);
  function postReplyAndCloseReplyText() {
    if (setOpenReplyText) {
      postReply();
      setOpenReplyText(false);
    } else {
      postComment();
      while (textFieldRef.current?.firstChild) {
        textFieldRef.current.removeChild(textFieldRef.current?.firstChild);
      }
    }
  }
  return (
    <>
      <div
        className="lm-reply-avatar"
        // style={LMPostHeaderStyles?.avatar}
        // onClick={() => {
        //   if (postHeaderAvatarClickCallback) {
        //     postHeaderAvatarClickCallback(navigate);
        //   }
        // }}
      >
        {avatar}
      </div>

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
          //   id="editableDiv"
          data-placeholder="Write something here..."
          className="reply-text-area"
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
        alt="reply-action"
        onClick={postReplyAndCloseReplyText}
      />
    </>
  );
};

export default LMFeedReplyTextArea;
