import { ReactNode } from "react";
import { Topic } from "../models/topic";

export interface CustomComponents {
  PostViewHeader?: ReactNode;
  PostViewFooter?: ReactNode;
  PostViewTopicsWrapper?: ReactNode;
  PostViewBody?: ReactNode;
  TopicDropDown?: ReactNode;
  Reply?: ReactNode;
  PostView?: ReactNode;
  RepliesScroller?: ReactNode;
  PostTopicTile?: React.FC<{ key: string; topic: Topic }>;
}
