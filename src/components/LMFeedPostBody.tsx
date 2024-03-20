import { useContext, useState } from "react";
import { parseAndReplaceTags, textPreprocessor } from "../shared/taggingParser";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMFeedAttachments from "../shared/components/LMFeedAttachments";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

const LMFeedPostBody = () => {
  const { post } = useContext(FeedPostContext);
  const { text, attachments, heading } = post!;
  const { LMPostBodyStyles } = useContext(CustomAgentProviderContext);
  const [hasReadMoreTapped, setHasReadMoreTapped] = useState<boolean>(false);

  // Render attachments
  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="attachments">
        <LMFeedAttachments attachments={attachments} />
      </div>
    );
  };

  return (
    <div className="lm-feed-wrapper__card__body">
      {heading.length > 0 && (
        <h1
          className="lm-feed-wrapper__card__body__heading"
          style={LMPostBodyStyles?.heading}
        >
          {heading}
        </h1>
      )}
      <div
        className="lm-feed-wrapper__card__body__content"
        style={LMPostBodyStyles?.content}
      >
        {/* {parseAndReplaceTags(text)} */}
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
      <div className="lm-feed-wrapper__card__body__attachment">
        {renderAttachments()}
      </div>
    </div>
  );
};

export default LMFeedPostBody;
