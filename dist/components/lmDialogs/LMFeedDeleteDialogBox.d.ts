import { LMFeedDeletePostModes } from "../../shared/enums/lmDeleteDialogModes";
interface LMDeletePostDialogProps {
    mode: LMFeedDeletePostModes;
    onClose: () => void;
}
declare const LMFeedDeleteDialogBox: ({ mode, onClose }: LMDeletePostDialogProps) => import("react/jsx-runtime").JSX.Element;
export default LMFeedDeleteDialogBox;
