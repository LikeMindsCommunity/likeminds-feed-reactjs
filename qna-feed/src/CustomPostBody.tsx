import {
  CustomAgentProviderContext,
  FeedPostContext,
  LMFeedAttachments,
} from "@likeminds.community/likeminds-feed-reactjs";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useCallback, useContext, useMemo } from "react";

const CustomLMFeedPostBody = () => {
  const { post, widgets } = useContext(FeedPostContext);
  const { text, attachments, heading } = post!;
  const { CustomComponents = {} } = useContext(CustomAgentProviderContext);
  const { CustomPostViewAttachment } = CustomComponents;
  const customWidgetMetadata = useMemo(() => {
    const customWidgetIndex = attachments?.findIndex(
      (attachment) => attachment.attachmentType === 5
    );

    if (customWidgetIndex !== -1 && widgets) {
      const customWidgetAttachment = attachments[customWidgetIndex];
      const customWidgetEntityID =
        customWidgetAttachment.attachmentMeta.entityId || "";
      const customWidgetObject = widgets[customWidgetEntityID];
      const customWidgetMetadata = customWidgetObject.metadata;
      return customWidgetMetadata;
    } else {
      return null;
    }
  }, []);
  // Render attachments
  const renderAttachments = useCallback(() => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div
        className="attachments"
        lm-feed-component-id={`lm-feed-post-body-dn2pl-${post?.Id}`}
      >
        <LMFeedAttachments
          postId={post?.Id || ""}
          attachments={attachments.filter(
            (attachment) => attachment.attachmentType !== 5
          )}
        />
      </div>
    );
  }, [CustomPostViewAttachment, attachments, post?.Id]);

  return (
    <div
      className="lm-feed-wrapper__card__body relative"
      lm-feed-component-id={`lm-feed-post-body-vwxyz-${post?.Id}`}
    >
      {heading.length > 0 && (
        <h1
          className="lm-feed-wrapper__card__body__heading"
          style={{
            cursor: !window.location.pathname.includes("/post")
              ? "pointer"
              : undefined,
          }}
          lm-feed-component-id={`lm-feed-post-body-abcde-${post?.Id}`}
        >
          {heading}
        </h1>
      )}
      {/* post text */}
      {text ? (
        <div
          className="lm-feed-wrapper__card__body__content"
          lm-feed-component-id={`lm-feed-post-body-fghij-${post?.Id}`}
        >
          {text}
        </div>
      ) : null}
      {/* post text */}
      <div
        className="lm-feed-wrapper__card__body__attachment"
        lm-feed-component-id={`lm-feed-post-body-pqrst-${post?.Id}`}
      >
        {renderAttachments()}
      </div>
      {customWidgetMetadata && (
        <CustomCTAActionButton metadata={customWidgetMetadata} />
      )}
    </div>
  );
};

interface CustomCTAActionButtonProps {
  metadata: any;
}
export const CustomCTAActionButton = ({
  metadata,
}: CustomCTAActionButtonProps) => {
  const link = metadata.meta.cta || "";
  return (
    <a href={link} className="custom-cta-action">
      <ArrowOutwardIcon
        style={{
          color: "white",
        }}
      />
    </a>
  );
};

export default CustomLMFeedPostBody;
