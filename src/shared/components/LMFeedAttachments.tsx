import React, { memo } from "react";
import Slider from "react-slick";
import {
  Attachment,
  Attachment as AttachmentType,
} from "../types/models/attachment";
import { formatFileSize, truncateString } from "../utils";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pdfIcon from "../../assets/images/pdf-icon.svg";
import { Document, Page } from "react-pdf";
import { OgTag } from "../types/models/ogTag";
interface LMFeedAttachmentsProps {
  attachments: AttachmentType[];
}

const LMFeedAttachments: React.FC<LMFeedAttachmentsProps> = memo(
  ({ attachments }) => {
    // Configure settings for react-slick carousel
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    // Render attachments as carousel if there are multiple attachments
    if (attachments.length > 1) {
      return (
        <div className="slider-container">
          <Slider {...settings} lazyLoad={"anticipated"}>
            {attachments.map((attachment, index) => (
              <div key={index}>
                <RenderAttachment attachment={attachment} />
              </div>
            ))}
          </Slider>
        </div>
      );
    }

    // Render single attachment if there's only one attachment
    if (attachments.length === 1) {
      return <RenderAttachment attachment={attachments[0]} />;
    }

    // Render nothing if there are no attachments
    return null;
  },
);

// Helper function to render individual attachment
const RenderAttachment: React.FC<{ attachment: AttachmentType }> = memo(
  ({ attachment }) => {
    // Render attachment based on attachmentType
    const { attachmentMeta, attachmentType } = attachment;
    const { name, url, ogTags } = attachmentMeta;

    switch (attachmentType) {
      case 1: // Image
        return (
          <div className="attachment-image">
            <img loading="lazy" src={url} alt={name} />
          </div>
        );
      case 2: // Video
        return (
          <div className="attachment-video">
            <video controls width="100%" height="auto">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 3: // PDF
        return <LMFeedDocumentAttachmentView attachment={attachment} />;

      case 4: // OG Tags
        return <LMFeedOGTagAttachmentView ogTags={ogTags} />;

      default:
        // Unsupported attachment type
        return (
          <div className="attachment-unsupported">
            Unsupported attachment type
          </div>
        );
    }
  },
);
interface OgTagHolderProps {
  ogTags: OgTag;
}
export const LMFeedOGTagAttachmentView = ({ ogTags }: OgTagHolderProps) => {
  return (
    <div className="attachmentOGTag">
      {ogTags?.image ? (
        <img
          src={ogTags.image}
          alt="og tag image"
          className="attachmentOGTag__img"
        />
      ) : (
        <div className="attachmentOGTag__noImg">{ogTags?.url}</div>
      )}
      <div className="attachmentOGTag__content">
        <a href={ogTags.url} target="_blank">
          {truncateString(ogTags?.title, 100)}
        </a>
        <div className="attachmentOGTag__content--desc">
          {truncateString(ogTags?.description, 300)}
        </div>
        <div className="attachmentOGTag__content--url">{ogTags?.url}</div>
      </div>
    </div>
  );
};
interface LMFeedDocumentAttachmentViewProps {
  attachment: Attachment;
}
export const LMFeedDocumentAttachmentView = ({
  attachment,
}: LMFeedDocumentAttachmentViewProps) => {
  const { attachmentMeta } = attachment;
  const { name, url, size } = attachmentMeta;
  return (
    <div className="attachmentPdf">
      <Document file={attachmentMeta?.url}>
        <Page
          pageNumber={1}
          className={"pdfPage"}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          // height={324}
        />
      </Document>

      <div className="attachmentPdf__content">
        <img
          src={pdfIcon}
          alt="pdf"
          className="attachmentOGTag__content--icon"
        />
        <div>
          <a
            className="attachmentPdf__content--title"
            target="_blank"
            href={url}
          >
            {name}
          </a>
          <div className="attachmentPdf__content--url">
            {formatFileSize(size)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LMFeedAttachments;
