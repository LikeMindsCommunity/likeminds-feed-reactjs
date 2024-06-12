import { OgTag } from "./ogTag";
export interface Attachment {
    attachmentMeta: {
        entityId?: string;
        format: string;
        name: string;
        ogTags: OgTag;
        size: number;
        url: string;
    };
    attachmentType: number;
}
