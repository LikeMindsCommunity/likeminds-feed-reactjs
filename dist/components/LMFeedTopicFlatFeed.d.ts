/// <reference types="react" />
interface LMFeedUniversalFeedProps {
    PostView?: React.FC;
    Shimmer?: React.FC;
    FooterView?: React.FC;
    HeaderView?: React.FC;
    likeActionCall?: () => void;
}
declare const LMFeedTopicFlatFeed: (props: LMFeedUniversalFeedProps) => import("react/jsx-runtime").JSX.Element;
export default LMFeedTopicFlatFeed;
