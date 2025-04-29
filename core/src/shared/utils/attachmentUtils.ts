import { AttachmentType } from "@likeminds.community/feed-js";

export function isMediaAttachmentType(type: AttachmentType): boolean {
  return (
    type === AttachmentType.IMAGE ||
    type === AttachmentType.VIDEO ||
    type === AttachmentType.DOCUMENT ||
    type === AttachmentType.REEL
  );
}
