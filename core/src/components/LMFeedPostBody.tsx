import { useCallback, useContext, useState } from "react";
import { parseAndReplaceTags, textPreprocessor } from "../shared/taggingParser";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMFeedAttachments from "../shared/components/LMFeedAttachments";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

const LMFeedPostBody = () => {
  const { post } = useContext(FeedPostContext);
  const { text, attachments, heading } = post!;
  const { CustomComponents = {} } = useContext(CustomAgentProviderContext);
  const { CustomPostViewAttachment } = CustomComponents;
  const [hasReadMoreTapped, setHasReadMoreTapped] = useState<boolean>(false);

  // Render attachments
  const renderAttachments = useCallback(() => {
    // return null;
    if (!attachments || attachments.length === 0) return null;

    return (
      <div
        className="attachments"
        lm-feed-component-id={`lm-feed-post-body-dn2pl-${post?.id}`}
      >
        {CustomPostViewAttachment ? (
          <CustomPostViewAttachment
            postId={post?.id || ""}
            attachments={attachments}
          />
        ) : (
          <LMFeedAttachments
            postId={post?.id || ""}
            attachments={attachments.filter(
              (attachment) => attachment.attachmentType !== 5,
            )}
          />
        )}
      </div>
    );
  }, [CustomPostViewAttachment, attachments, post?.id]);

  return (
    <div
      className="lm-feed-wrapper__card__body overflow-word-break"
      lm-feed-component-id={`lm-feed-post-body-vwxyz-${post?.id}`}
    >
      {heading.length > 0 && (
        <a href={``}>
          <h1
            className="lm-feed-wrapper__card__body__heading"
            style={{
              cursor: !window.location.pathname.includes("/post")
                ? "pointer"
                : undefined,
            }}
            lm-feed-component-id={`lm-feed-post-body-abcde-${post?.id}`}
          >
            {heading}
          </h1>
        </a>
      )}
      {/* post text */}
      {text ? (
        <div
          className="lm-feed-wrapper__card__body__content"
          lm-feed-component-id={`lm-feed-post-body-fghij-${post?.id}`}
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
                    lm-feed-component-id={`lm-feed-post-body-klmno-${post?.id}`}
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
        lm-feed-component-id={`lm-feed-post-body-pqrst-${post?.id}`}
      >
        {renderAttachments()}
      </div>
    </div>
  );
};

export default LMFeedPostBody;
