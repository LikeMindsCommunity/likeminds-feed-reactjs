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

export interface LMFeedAttachmentsProps {
  attachments: AttachmentType[];
  postId: string;
}

const LMFeedAttachments: React.FC<LMFeedAttachmentsProps> = memo(
  ({ attachments, postId }) => {
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
              <div
                key={index}
                lm-feed-component-id={`lm-feed-post-attachments-zabcd-${postId}`}
              >
                <RenderAttachment attachment={attachment} postId={postId} />
              </div>
            ))}
          </Slider>
        </div>
      );
    }

    // Render single attachment if there's only one attachment
    if (attachments.length === 1) {
      return <RenderAttachment attachment={attachments[0]} postId={postId} />;
    }

    // Render nothing if there are no attachments
    return null;
  },
);

// Helper function to render individual attachment
const RenderAttachment: React.FC<{
  attachment: AttachmentType;
  postId: string;
}> = memo(({ attachment, postId }) => {
  // Render attachment based on attachmentType
  const { attachmentMeta, attachmentType } = attachment;
  const { name, url, ogTags } = attachmentMeta;

  switch (attachmentType) {
    case 1: // Image
      return (
        <div
          className="attachment-image"
          lm-feed-component-id={`lm-feed-post-attachments-efghi-${postId}`}
        >
          <img
            loading="lazy"
            src={url}
            alt={name}
            lm-feed-component-id={`lm-feed-post-attachments-jklmn-${postId}`}
          />
        </div>
      );
    case 2: // Video
      return (
        <div
          className="attachment-video"
          lm-feed-component-id={`lm-feed-post-attachments-opqrs-${postId}`}
        >
          <video
            controls
            width="100%"
            height="auto"
            lm-feed-component-id={`lm-feed-post-attachments-tuvwx-${postId}`}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case 11: // Reel
      return (
        <div
          className="attachment-video"
          lm-feed-component-id={`lm-feed-post-attachments-opqrs-${postId}`}
        >
          <video
            controls
            width="100%"
            height="auto"
            lm-feed-component-id={`lm-feed-post-attachments-tuvwx-${postId}`}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case 3: // PDF
      return (
        <LMFeedDocumentAttachmentView postId={postId} attachment={attachment} />
      );
    case 4: // OG Tags
      return <LMFeedOGTagAttachmentView postId={postId} ogTags={ogTags} />;

    default: // Unsupported attachment type
      return (
        <div
          className="attachment-unsupported"
          lm-feed-component-id={`lm-feed-post-attachments-defgh-${postId}`}
        >
          Unsupported attachment type
        </div>
      );
  }
});
interface OgTagHolderProps {
  ogTags: OgTag;
  postId: string;
}
export const LMFeedOGTagAttachmentView = ({
  ogTags,
  postId,
}: OgTagHolderProps) => {
  return (
    // <div className="attachmentOGTag">
    //   {ogTags?.image ? (
    //     <img
    //       src={ogTags.image}
    //       alt="og tag image"
    //       className="attachmentOGTag__img"
    //     />
    //   ) : (
    //     <div className="attachmentOGTag__noImg">{ogTags?.url}</div>
    //   )}
    //   <div className="attachmentOGTag__content">
    //     <a href={ogTags.url} target="_blank">
    //       {truncateString(ogTags?.title, 100)}
    //     </a>
    //     <div className="attachmentOGTag__content--desc">
    //       {truncateString(ogTags?.description, 300)}
    //     </div>
    //     <div className="attachmentOGTag__content--url">{ogTags?.url}</div>
    //   </div>
    // </div>
    <div
      className="attachmentOGTag"
      lm-feed-component-id={`lm-feed-post-attachments-ijklm-${postId}`}
    >
      {ogTags?.image ? (
        <img
          src={ogTags.image}
          alt="og tag image"
          className="attachmentOGTag__img"
          lm-feed-component-id={`lm-feed-post-attachments-nopqr-${postId}`}
        />
      ) : (
        <div
          className="attachmentOGTag__noImg"
          lm-feed-component-id={`lm-feed-post-attachments-stuvw-${postId}`}
        >
          {ogTags?.url}
        </div>
      )}
      <div
        className="attachmentOGTag__content"
        lm-feed-component-id={`lm-feed-post-attachments-xyzab-${postId}`}
      >
        <a
          href={ogTags.url}
          target="_blank"
          lm-feed-component-id={`lm-feed-post-attachments-cdefg-${postId}`}
        >
          {truncateString(ogTags?.title, 100)}
        </a>
        <div
          className="attachmentOGTag__content--desc"
          lm-feed-component-id={`lm-feed-post-attachments-hijkl-${postId}`}
        >
          {truncateString(ogTags?.description, 300)}
        </div>
        <div
          className="attachmentOGTag__content--url"
          lm-feed-component-id={`lm-feed-post-attachments-mnopq-${postId}`}
        >
          {ogTags?.url}
        </div>
      </div>
    </div>
  );
};
interface LMFeedDocumentAttachmentViewProps {
  attachment: Attachment;
  postId: string;
}
export const LMFeedDocumentAttachmentView = ({
  attachment,
  postId,
}: LMFeedDocumentAttachmentViewProps) => {
  const { attachmentMeta } = attachment;
  const { name, url, size } = attachmentMeta;
  return (
    // <div className="attachmentPdf">
    //   <Document file={attachmentMeta?.url}>
    //     <Page
    //       pageNumber={1}
    //       className={"pdfPage"}
    //       renderAnnotationLayer={false}
    //       renderTextLayer={false}
    //       // height={324}
    //     />
    //   </Document>

    //   <div className="attachmentPdf__content">
    //     <img
    //       src={pdfIcon}
    //       alt="pdf"
    //       className="attachmentOGTag__content--icon"
    //     />
    //     <div>
    //       <a
    //         className="attachmentPdf__content--title"
    //         target="_blank"
    //         href={url}
    //       >
    //         {name}
    //       </a>
    //       <div className="attachmentPdf__content--url">
    //         {formatFileSize(size)}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div
      className="attachmentPdf"
      lm-feed-component-id={`lm-feed-post-attachments-rstuw-${postId}`}
    >
      <Document file={attachmentMeta?.url}>
        <Page
          pageNumber={1}
          // className={"pdfPage"}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          lm-feed-component-id={`lm-feed-post-attachments-vwxyz-${postId}`}
        />
      </Document>
      <div
        className="attachmentPdf__content"
        lm-feed-component-id={`lm-feed-post-attachments-abcde-${postId}`}
      >
        <img
          src={pdfIcon}
          alt="pdf"
          className="attachmentOGTag__content--icon"
          lm-feed-component-id={`lm-feed-post-attachments-fghij-${postId}`}
        />
        <div lm-feed-component-id={`lm-feed-post-attachments-klmno-${postId}`}>
          <a
            className="attachmentPdf__content--title"
            target="_blank"
            href={url}
            lm-feed-component-id={`lm-feed-post-attachments-pqrst-${postId}`}
          >
            {name}
          </a>
          <div
            className="attachmentPdf__content--url"
            lm-feed-component-id={`lm-feed-post-attachments-uvwxy-${postId}`}
          >
            {formatFileSize(size)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LMFeedAttachments;
