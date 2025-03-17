import { LMFeedCustomEvents } from "../customEvents";
import LMFeedNotification from "./LMFeedNotification";

const LMFeedNotificationHeader = ({
  customEventClient,
}: {
  customEventClient: LMFeedCustomEvents;
}) => {
  return (
    <div className="lm-header-notification">
      <div className="lm-header-toggle-wrapper">
        <h1>LMFeed</h1>
      </div>

      <div>
        <LMFeedNotification customEventClient={customEventClient} />
      </div>
    </div>
  );
};

export default LMFeedNotificationHeader;
