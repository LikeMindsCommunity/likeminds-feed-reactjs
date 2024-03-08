import React from "react";
import Slider from "react-slick";
import { Attachment as AttachmentType } from "../types/models/attachment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { truncateString } from "../utils";
// import PdfThumbnail from "./LMPDFThumbnail";
// import PDFViewer from "./LMPDFViewer";

interface AttachmentProps {
  attachments: AttachmentType[];
}

const Attachment: React.FC<AttachmentProps> = ({ attachments }) => {
  // Configure settings for react-slick carousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Render attachments as carousel if there are multiple attachments
  if (attachments.length > 1) {
    return (
      <div className="slider-container">
        <Slider {...settings}>
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
};

// Helper function to render individual attachment
const RenderAttachment: React.FC<{ attachment: AttachmentType }> = ({
  attachment,
}) => {
  // Render attachment based on attachmentType
  const { attachmentMeta, attachmentType } = attachment;
  const { name, url, ogTags } = attachmentMeta;
  console.log(attachmentMeta);
  switch (attachmentType) {
    case 1: // Image
      return (
        <div>
          <img loading="lazy" width="576" height="324" src={url} alt={name} />
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
      return (
        <div className="attachment-pdf">
          {/* <PdfThumbnail pdfUrl="https://beta-likeminds-media.s3.ap-south-1.amazonaws.com/files/post/0e53748a-969b-44c6-b8fa-a4c8e1eb1208/16D769E6-D6F4-424B-B69E-B754EA29C842-3586-00000097F7862420.pdf" /> */}
          <iframe src={url} title={name} width="100%" height="500px"></iframe>
        </div>
      );
    case 4: // OG Tags
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
    default:
      // Unsupported attachment type
      return (
        <div className="attachment-unsupported">
          Unsupported attachment type
        </div>
      );
  }
};

export default Attachment;
