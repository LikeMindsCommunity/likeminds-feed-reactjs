import React from "react";
import { Attachment, Attachment as AttachmentType } from "../types/models/attachment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { OgTag } from "../types/models/ogTag";
export interface LMFeedAttachmentsProps {
    attachments: AttachmentType[];
    postId: string;
}
declare const LMFeedAttachments: React.FC<LMFeedAttachmentsProps>;
interface OgTagHolderProps {
    ogTags: OgTag;
    postId: string;
}
export declare const LMFeedOGTagAttachmentView: ({ ogTags, postId, }: OgTagHolderProps) => import("react/jsx-runtime").JSX.Element;
interface LMFeedDocumentAttachmentViewProps {
    attachment: Attachment;
    postId: string;
}
export declare const LMFeedDocumentAttachmentView: ({ attachment, postId, }: LMFeedDocumentAttachmentViewProps) => import("react/jsx-runtime").JSX.Element;
export default LMFeedAttachments;
