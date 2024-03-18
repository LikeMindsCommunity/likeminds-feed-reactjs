import { useContext } from "react";
import { parseAndReplaceTags } from "../shared/taggingParser";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import LMFeedAttachments from "../shared/components/LMFeedAttachments";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

const LMFeedPostBody = () => {
  const { post } = useContext(FeedPostContext);
  const { text, attachments, heading } = post!;
  const { LMPostBodyStyles } = useContext(CustomAgentProviderContext);
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
        <div
          className="lm-feed-wrapper__card__body__heading"
          style={LMPostBodyStyles?.heading}
        >
          {heading}
        </div>
      )}
      <div
        className="lm-feed-wrapper__card__body__content"
        style={LMPostBodyStyles?.content}
      >
        {parseAndReplaceTags(text)}
      </div>
      <div className="lm-feed-wrapper__card__body__attachment">
        {renderAttachments()}
      </div>
    </div>
  );
};

export default LMFeedPostBody;
