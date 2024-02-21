import React from "react";
import { Attachment as AttachmentType } from "../../types/models/attachment"; // Import the Attachment interface

interface AttachmentProps {
  attachment: AttachmentType; // Use the new Attachment interface
}

const Attachment: React.FC<AttachmentProps> = ({ attachment }) => {
  const { attachmentMeta, attachmentType } = attachment;

  // Handle different attachment types (e.g., images, documents)
  const renderAttachmentContent = () => {
    switch (attachmentType) {
      case 1: // Handle image attachments
        return <img src={attachmentMeta.url} alt={attachmentMeta.name} />;
      // Add cases for other attachment types as needed
      default:
        return null;
    }
  };

  return (
    <div className="attachment">
      {renderAttachmentContent()}
      {/* You can add additional rendering logic for attachment metadata if needed */}
    </div>
  );
};

export default Attachment;
