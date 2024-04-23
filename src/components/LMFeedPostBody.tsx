import { useCallback, useContext, useState } from "react";
import { parseAndReplaceTags, textPreprocessor } from "../shared/taggingParser";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMFeedAttachments from "../shared/components/LMFeedAttachments";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { useNavigate } from "react-router-dom";

const LMFeedPostBody = () => {
  const { post } = useContext(FeedPostContext);
  const { text, attachments, heading } = post!;
  const { LMPostBodyStyles, CustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
  const [hasReadMoreTapped, setHasReadMoreTapped] = useState<boolean>(false);
  const navigate = useNavigate();
  const { postHeadingClickCallback } = CustomCallbacks;
  // Render attachments
  const renderAttachments = useCallback(() => {
    // return null;
    if (!attachments || attachments.length === 0) return null;

    return (
      <div
        className="attachments"
        lm-feed-component-id={`lm-feed-post-wrapper-dn2pl-${post?.Id}`}
      >
        <LMFeedAttachments attachments={attachments} />
      </div>
    );
  }, [attachments, post?.Id]);

  return (
    // <div className="lm-feed-wrapper__card__body">
    //   {heading.length > 0 && (
    //     <h1
    //       className="lm-feed-wrapper__card__body__heading"
    //       style={{
    //         cursor: !window.location.pathname.includes("/post")
    //           ? "pointer"
    //           : undefined,
    //         ...LMPostBodyStyles?.heading,
    //       }}
    //       onClick={() => {
    //         if (postHeadingClickCallback) {
    //           postHeadingClickCallback(navigate);
    //         } else {
    //           if (!window.location.pathname.includes("/post")) {
    //             navigate(
    //               `/community/post/${`${post?.Id}-${post?.heading}`.substring(0, 59)}`,
    //             );
    //           }
    //         }
    //       }}
    //     >
    //       {heading}
    //     </h1>
    //   )}
    //   {/* post text */}
    //   {text ? (
    //     <div
    //       className="lm-feed-wrapper__card__body__content"
    //       style={LMPostBodyStyles?.content}
    //     >
    //       {(() => {
    //         const processedText = textPreprocessor(text);
    //         if (processedText.showReadMore && !hasReadMoreTapped) {
    //           return (
    //             <>
    //               {parseAndReplaceTags(processedText.text)}
    //               <span
    //                 className="lm-feed-wrapper__card__body__content__read-more-tap-icon"
    //                 style={{
    //                   color: "gray",
    //                   fontWeight: "400",
    //                   cursor: "pointer",
    //                   fontSize: "14px",
    //                 }}
    //                 onClick={() => setHasReadMoreTapped(true)}
    //               >
    //                 ...ReadMore
    //               </span>
    //             </>
    //           );
    //         } else {
    //           return parseAndReplaceTags(text);
    //         }
    //       })()}
    //     </div>
    //   ) : null}
    //   {/* post text */}

    //   <div className="lm-feed-wrapper__card__body__attachment">
    //     {renderAttachments()}
    //   </div>
    // </div>
    <div
      className="lm-feed-wrapper__card__body"
      lm-feed-component-id={`lm-feed-post-wrapper-vwxyz-${post?.Id}`}
    >
      {heading.length > 0 && (
        <h1
          className="lm-feed-wrapper__card__body__heading"
          style={{
            cursor: !window.location.pathname.includes("/post")
              ? "pointer"
              : undefined,
            ...LMPostBodyStyles?.heading,
          }}
          onClick={() => {
            if (postHeadingClickCallback) {
              postHeadingClickCallback(navigate);
            } else {
              if (!window.location.pathname.includes("/post")) {
                navigate(
                  `/community/post/${`${post?.Id}-${post?.heading}`.substring(0, 59)}`,
                );
              }
            }
          }}
          lm-feed-component-id={`lm-feed-post-wrapper-abcde-${post?.Id}`}
        >
          {heading}
        </h1>
      )}
      {/* post text */}
      {text ? (
        <div
          className="lm-feed-wrapper__card__body__content"
          style={LMPostBodyStyles?.content}
          lm-feed-component-id={`lm-feed-post-wrapper-fghij-${post?.Id}`}
        >
          {(() => {
            const processedText = textPreprocessor(text);
            if (processedText.showReadMore && !hasReadMoreTapped) {
              return (
                <>
                  {parseAndReplaceTags(processedText.text)}
                  <span
                    className="lm-feed-wrapper__card__body__content__read-more-tap-icon"
                    style={{
                      color: "gray",
                      fontWeight: "400",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => setHasReadMoreTapped(true)}
                    lm-feed-component-id={`lm-feed-post-wrapper-klmno-${post?.Id}`}
                  >
                    ...ReadMore
                  </span>
                </>
              );
            } else {
              return parseAndReplaceTags(text);
            }
          })()}
        </div>
      ) : null}
      {/* post text */}
      <div
        className="lm-feed-wrapper__card__body__attachment"
        lm-feed-component-id={`lm-feed-post-wrapper-pqrst-${post?.Id}`}
      >
        {renderAttachments()}
      </div>
    </div>
  );
};

export default LMFeedPostBody;
