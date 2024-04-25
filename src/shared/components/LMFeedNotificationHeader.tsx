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

      <div>
        <LMFeedNotification customEventClient={customEventClient} />
      </div>
    </div>
  );
};

export default LMFeedNotificationHeader;
