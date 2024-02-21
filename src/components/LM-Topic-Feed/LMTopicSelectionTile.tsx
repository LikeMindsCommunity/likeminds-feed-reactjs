import React, { memo } from "react";

import { Checkbox } from "@mui/material";
import { Topic } from "../../types/models/topic";
interface TopicListProps {
  topic: Topic;
  checkedList: Topic[];
  clickHandler: (topic: Topic) => void;
}
export const LMTopicSelectionTile = memo(
  ({ topic, checkedList, clickHandler }: TopicListProps) => {
    return (
      <div
        className="lm-topic-tile"
        onClick={() => {
          clickHandler(topic);
        }}
      >
        <Checkbox
          disableRipple={true}
          sx={{
            "&.Mui-checked": {
              color: "#5046e5",
            },
            ":hover": {
              background: "white",
            },
            paddingX: "0px",
          }}
          checked={
            topic.name === "All Topics"
              ? checkedList.length === 0
              : checkedList.some((el) => el._id === topic._id)
          }
        />
        <span className="lm-topic-name-container">{topic.name}</span>
      </div>
    );
  },
);
