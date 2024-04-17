import { LMFeedCustomEvents } from "../customEvents";
import LMFeedNotification from "./LMFeedNotification";

const LMFeedNotificationHeader = ({
  customEventClient,
}: {
  customEventClient: LMFeedCustomEvents;
}) => {
  return (
    <div className="lm-header-notification">
      <h1>LMFeed</h1>
      <LMFeedNotification customEventClient={customEventClient} />
      <div>notification</div>
    </div>
  );
};

export default LMFeedNotificationHeader;
