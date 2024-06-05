/// <reference types="react" />
export declare function useLMPostReply(postId: string, commentId?: string): UseLMPostReply;
interface UseLMPostReply {
    replyText: string;
    setReplyText: (text: string) => void;
    textFieldRef: React.MutableRefObject<HTMLDivElement | null>;
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
    postReply: () => void;
    postComment: () => void;
    editComment: () => void;
}
export {};
