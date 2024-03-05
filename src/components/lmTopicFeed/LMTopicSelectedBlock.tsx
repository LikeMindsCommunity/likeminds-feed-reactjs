import { Topic } from "../../types/models/topic";
import lmCancelIcon from "../../assets/images/topic-delete-icon.svg";
interface TopicBlockProps {
  topic: Topic;
  onDeleteClick: (topic: Topic) => void;
  isCreateMode?: boolean;
}
export const LMTopicSelectedBlock = ({
  topic,
  onDeleteClick,
  isCreateMode,
}: TopicBlockProps) => {
  const { name } = topic;

  switch (isCreateMode) {
    case true: {
      return <span>{name}</span>;
    }

    default: {
      return (
        <div className="lm-float-left lm-mr-3 lm-feed-topic-tile lm-d-flex lm-align-items-center">
          <span>{name}</span>
          <span onClick={() => onDeleteClick(topic)}>
            <img
              src={lmCancelIcon}
              alt="cross-icon"
              className="lm-mt-2 lm-cursor-pointer"
            />
          </span>
        </div>
      );
    }
  }
};
