import { Topic } from "../../shared/types/models/topic";
import lmCancelIcon from "../../assets/images/topic-delete-icon.svg";
interface TopicBlockProps {
  topic: Topic;
  onDeleteClick: (topic: Topic) => void;
  isCreateMode?: boolean;
}
export const LMFeedTopicSelectedBlock = ({
  topic,
  onDeleteClick,
  isCreateMode,
}: TopicBlockProps) => {
  const { name } = topic;

  switch (isCreateMode) {
    case true: {
      return (
        <div className="lm-float-left lm-mr-3 lm-feed-topic-tile-create lm-d-flex lm-align-items-center">
          <span>{name}</span>
        </div>
      );
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
