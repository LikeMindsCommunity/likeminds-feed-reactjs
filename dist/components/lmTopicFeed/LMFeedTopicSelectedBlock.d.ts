import { Topic } from "../../shared/types/models/topic";
interface TopicBlockProps {
    topic: Topic;
    onDeleteClick: (topic: Topic) => void;
    isCreateMode?: boolean;
}
export declare const LMFeedTopicSelectedBlock: ({ topic, onDeleteClick, isCreateMode, }: TopicBlockProps) => import("react/jsx-runtime").JSX.Element;
export {};
