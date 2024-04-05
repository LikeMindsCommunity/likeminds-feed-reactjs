import dummyUser from "../assets/images/user.png";

const LMFeedAllMembers = () => {
  return (
    <div className="lm-member-wrapper">
      <div className="lm-member-wrapper__header">Member List</div>
      <div className="lm-member-wrapper__body">
        {/* user container */}
        <div className="lm-member-wrapper__body__media">
          <div className="lm-member-wrapper__body__media__imgBox">
            <img src={dummyUser} alt="dummyUser" />
          </div>
          <div className="lm-member-wrapper__body__media__content">
            <div className="lm-member-wrapper__body__media__content--name">
              Erin Shipron
            </div>
          </div>
        </div>
        {/* user container */}
        {/* user container */}
        <div className="lm-member-wrapper__body__media">
          <div className="lm-member-wrapper__body__media__imgBox">
            <img src={dummyUser} alt="dummyUser" />
          </div>
          <div className="lm-member-wrapper__body__media__content">
            <div className="lm-member-wrapper__body__media__content--name">
              Erin Shipron
            </div>
          </div>
        </div>
        {/* user container */}
      </div>
    </div>
  );
};

export default LMFeedAllMembers;
