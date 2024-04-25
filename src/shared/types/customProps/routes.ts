import { ReactNode } from "react";
import { Post } from "../models/post";

export interface LMFeedCustomAppRoutes extends FeedRoutes, OptionalRoutes {}
interface FeedRoutes {
  homeFeedRoute: RouteObject;
  feedDetailsRoute: RouteObject;
}
interface RouteObject {
  pathname: string;
  element: ReactNode;
  params: string[];
}
interface OptionalRoutes {
  [key: string]: RouteObject;
}
export type ClickNavigator = (post: Post) => void;
