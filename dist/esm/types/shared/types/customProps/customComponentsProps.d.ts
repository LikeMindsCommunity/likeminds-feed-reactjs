/// <reference types="react" />
export interface CustomComponents {
    PostViewHeader?: () => JSX.Element;
    PostViewFooter?: () => JSX.Element;
    PostViewTopicsWrapper?: () => JSX.Element;
    PostViewBody?: () => JSX.Element;
    TopicDropDown?: () => JSX.Element;
    Reply?: () => JSX.Element;
    PostView?: () => JSX.Element;
    RepliesScroller?: () => JSX.Element;
}
