import React from "react";
import Slider from "react-slick";
import { Attachment as AttachmentType } from "../../types/models/attachment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PDFViewer from "./PDFViewer";

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
  const { name, url } = attachmentMeta;

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
          <PDFViewer pdfUrl={url} />
          {/* <iframe src={url} title={name} width="100%" height="500px"></iframe> */}
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
