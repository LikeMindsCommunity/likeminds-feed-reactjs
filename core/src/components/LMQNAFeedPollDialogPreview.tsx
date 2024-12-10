import React, { useContext } from "react";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";
import { WordAction } from "../shared/enums/wordAction";
import removePollOptionIcon from '../assets/images/remove-poll-option.svg';
import editIcon from "../assets/images/edit-icon.svg";

import { getAvatar } from "../shared/components/LMUserMedia";
import LMFeedTextArea from "../shared/components/LMFeedTextArea";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import LMFeedCreatePostSubmitButton from "../shared/components/LMFeedCreatePostSubmitButton";
import { LMFeedCreatePostContext } from "../contexts/LMFeedCreatePostContext";
import LMFeedViewTopicDropdown from "./lmTopicFeed/LMFeedViewTopicDropdown";
import { LMTopicsDropdownMode } from "../shared/enums/lmTopicFeedDropdownMode";
import { Checkbox, Divider } from "@mui/material";
import { LMFeedOGTagMediaItem } from "./LMFeedOgTagMediaItem";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { changePostCase } from "../shared/utils";
import { formatDate } from '../shared/utils';
import { renderMessage } from "../shared/utils";

const LMQNAPollDialogPreview = () => {
    const { currentUser } = useContext(LMFeedUserProviderContext);
    const {
        setSelectedTopicIds,
        selectedTopicIds,
        preSelectedTopics,
        setPreSelectedTopics,
        temporaryPost,
        showOGTagViewContainer,
        createPostComponentClickCustomCallback,
        ogTag,
        isAnonymousPost,
        changeAnonymousPostStatus,

        setOpenCreatePollDialog,
        pollOptions,
        pollText,
        pollExpirationDate,
        advancedOptions,
        question,
        clearPollFunction,
        editPollFunction,
        setQuestionText,
    } = useContext(LMFeedCreatePostContext);
    const {
        CustomComponents = {},
        isAnonymousPostAllowed,
        hintTextForAnonymous,
    } = useContext(CustomAgentProviderContext);

    const { CustomTopicDropDown } = CustomComponents;

    const renderAnonymousOption = () => {
        if (isAnonymousPostAllowed && !temporaryPost) {
            return (
                <>
                    <div className="lm-feed-create-post-anonymous-post">
                        <Checkbox
                            checked={isAnonymousPost}
                            className="anonymous-post-checkbox"
                            onChange={changeAnonymousPostStatus}
                        />
                        <span className="anonymous-post-text">
                            {hintTextForAnonymous || "Post this anonymously"}
                        </span>
                    </div>
                </>
            );
        }
    };

    return (
        <div
            className="lm-feed-create-post-wrapper"
            onClick={(e) => {
                if (createPostComponentClickCustomCallback) {
                    createPostComponentClickCustomCallback(e);
                }
            }}
        >
            <div className="lm-feed-create-post-wrapper__dialog-heading">
                {temporaryPost
                    ? `Edit ${changePostCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`
                    : `Create ${changePostCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`}
                <img
                    src={cancelModelMcon}
                    alt="cancelModelMcon"
                    onClick={() => {
                        if (setOpenCreatePollDialog) {
                            setOpenCreatePollDialog(false);
                        }
                    }}
                    className="cancelIcon"
                />
            </div>
            <div className="lm-feed-create-post-wrapper__user-meta">
                <div className="lm-avatar lm-mr-4">
                    {getAvatar({
                        imageUrl: currentUser?.imageUrl,
                        name: currentUser?.name,
                    })}
                </div>
                <div>{currentUser?.name}</div>
            </div>
            {renderAnonymousOption()}
            {CustomTopicDropDown || (
                <LMFeedViewTopicDropdown
                    mode={
                        temporaryPost
                            ? LMTopicsDropdownMode.edit
                            : LMTopicsDropdownMode.modify
                    }
                    setSelectedTopicsIds={setSelectedTopicIds}
                    selectedTopicIds={selectedTopicIds}
                    preSelectedTopics={preSelectedTopics}
                    setPreSelectedTopics={setPreSelectedTopics}
                />
            )}

            <Divider
                sx={{
                    borderColor: "#FFF",
                }}
                className="lm-feed-create-post-topic-text-area-divider"
            />

            <div className="lm-textarea">
                <input
                    type="text"
                    className="lm-feed-create-post-text-box"
                    placeholder="Add your question here..."
                    onChange={(e) => {
                        if (setQuestionText) {
                            setQuestionText(e.target.value);
                        }
                    }}
                    value={question!}
                />
            </div>
            <div className="lm-textarea">
                {CustomComponents.CustomCreatePostTextArea || <LMFeedTextArea />}
            </div>

            {showOGTagViewContainer &&
                ogTag
                ? (
                    <LMFeedOGTagMediaItem />
                ) : null}

            <div className="poll-preview-wrapper">
                <div className="poll-preview-title-parent">
                    <div className="poll-preview-title">{pollText}</div>
                    <div className="poll-preview-edit-button-parent">
                        <span
                            className="poll-preview-header-icon lm-cursor-pointer"
                            onClick={() => { editPollFunction() }}
                        >
                            <img src={editIcon} alt="edit" />
                        </span>
                        <span
                            className="poll-preview-header-icon lm-cursor-pointer"
                            onClick={() => {
                                clearPollFunction();
                            }}
                        >
                            <img src={removePollOptionIcon} alt="remove" />
                        </span>
                    </div>
                </div>
                {
                    !(advancedOptions.MULTIPLE_SELECTION_STATE == 0 && advancedOptions.MULTIPLE_SELECTION_NO <= 1) &&
                    <div className="poll-preview-advance-options poll-preview-subheading-style">
                        *Select {renderMessage(advancedOptions.MULTIPLE_SELECTION_STATE)} {advancedOptions.MULTIPLE_SELECTION_NO} options.
                    </div>
                }

                {pollOptions.map((pollOption, index) => {
                    return (
                        <div className="poll-option-wrapper" key={index}>
                            <div
                                className="poll-option-text-input poll-option-text-input-preview"
                            >{pollOption.text}</div>
                        </div>
                    );
                })}

                <div className="poll-preview-subheading-style">
                    Expires on {pollExpirationDate && formatDate(pollExpirationDate)}
                </div>
            </div>

            <LMFeedCreatePostSubmitButton />
        </div>
    )
}

export default LMQNAPollDialogPreview;