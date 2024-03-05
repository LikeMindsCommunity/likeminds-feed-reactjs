import React, { useContext } from "react";
import { parseAndReplaceTags } from "../shared/taggingParser";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import Attachment from "../shared/components/LMAttachments";

const LMPostBody = () => {
  const { post } = useContext(FeedPostContext);
  const { text, attachments } = post!;
  // Render attachments
  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) {
      return null;
    }

    return (
      <div className="attachments">
        <Attachment attachments={attachments} />
      </div>
    );
  };

  return (
    <>
      <div className="lm-feed-wrapper__card__body">
        <div className="lm-feed-wrapper__card__body__content">
          {parseAndReplaceTags(text)}
        </div>
        <div className="lm-feed-wrapper__card__body__attachment">
          {renderAttachments()}
        </div>
      </div>
    </>
  );
};

export default LMPostBody;
