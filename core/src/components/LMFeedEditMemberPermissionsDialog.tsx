import { useContext } from "react";
import IOSSwitch from "../shared/components/LMFeedSwitchTheme";
import { FeedModerationContext } from "../contexts/LMFeedModerationContext";

const LMFeedEditMemberPermissionsDialog = () => {
  const {
    memberRights,
    setIsEditPermissionDialogOpen,
    modifiedRights,
    setModifiedRights,
    customTitle,
    setCustomTitle,
    updateMemberRightsHandler,
  } = useContext(FeedModerationContext);

  const handleToggle = (id: number) => {
    setModifiedRights((prevRights) =>
      prevRights.map((right) =>
        right.id === id ? { ...right, isSelected: !right.isSelected } : right,
      ),
    );
  };

  const isSaveDisabled =
    JSON.stringify(memberRights) === JSON.stringify(modifiedRights) &&
    customTitle.trim() === "";

  return (
    <div className="lm-feed-create-post-wrapper">
      <div className="lm-feed-create-post-wrapper__dialog-heading edit-member-permission-title">
        Edit Permission
      </div>

      <hr className="edit-permissions-divider" />
      <div className="edit-permission-body-wrapper">
        {modifiedRights.map((right) => (
          <div
            key={right.id}
            className="edit-permission-body-wrapper__container"
          >
            <span className="poll-advanced-option-text">{right.title}</span>
            <IOSSwitch
              className="iso-switch-toggle"
              checked={right.isSelected}
              onChange={() => handleToggle(right.id)}
              disabled={right.isLocked}
            />
          </div>
        ))}

        <div className="edit-permission-custom-title">
          <span className="poll-advanced-option-text">Custom title</span>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => {
              setCustomTitle(e.target.value);
            }}
            placeholder={`Assign title to this member e.g. mentor`}
            className="poll-option-text-input edit-permission-input"
          />
        </div>
      </div>

      <div className="edit-permissions-footer-wrapper">
        <div
          className="edit-permissions-footer-wrapper__button edit-permissions-footer-wrapper__cancel-button"
          onClick={() => {
            setIsEditPermissionDialogOpen(false);
          }}
        >
          Cancel
        </div>
        <div
          className={`edit-permissions-footer-wrapper__button ${
            isSaveDisabled ? "disabled" : ""
          }`}
          style={{
            cursor: isSaveDisabled ? "not-allowed" : "pointer",
            opacity: isSaveDisabled ? 0.5 : 1,
          }}
          onClick={() => {
            updateMemberRightsHandler();
          }}
        >
          Save changes
        </div>
      </div>
    </div>
  );
};

export default LMFeedEditMemberPermissionsDialog;
