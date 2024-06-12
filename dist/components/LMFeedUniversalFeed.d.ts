/// <reference types="react" />
interface LMFeedUniversalFeedProps {
    PostView?: React.FC;
    Shimmer?: React.FC;
    FooterView?: React.FC;
    HeaderView?: React.FC;
    likeActionCall?: () => void;
}
declare const LMFeedUniversalFeed: (props: LMFeedUniversalFeedProps) => import("react/jsx-runtime").JSX.Element;
export default LMFeedUniversalFeed;
