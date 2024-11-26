import { FeedPostContext } from "..";
import { useContext, useEffect, useMemo, useState } from "react";
import { getTimeLeftInPoll, isPollSubmitted, hasPollEnded, getPollSelectionText, isInstantPoll, isMultiChoicePoll, shouldShowSubmitButton, shouldShowAddOptionButton, PollOption } from "../shared/utils";
import pollOptionAddMoreIcon from "../assets/images/poll-option-add-more.svg";
import { Dialog } from "@mui/material";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";

export const LMPostPoll = () => {

    const { post, widgets } = useContext(FeedPostContext);
    console.log("widgets", widgets);
    const postId2 = post?.attachments[0].attachmentMeta.entityId;
    console.log("post", postId2);
    if (widgets && postId2) {
        console.log(widgets[postId2].metadata.title);
    }

    const pollData = widgets && postId2 ? widgets[postId2] : null;
    const pollExpiryTime = pollData.metadata.expiryTime;
    const pollTimeLeft = getTimeLeftInPoll(pollExpiryTime);
    const multiSelectNo = pollData.metadata.multipleSelectNumber;
    const multiSelectState = pollData.metadata.multipleSelectState;
    const pollSelectionText = getPollSelectionText(multiSelectNo, multiSelectState);
    const pollType = pollData.metadata.pollType;
    const allowAddOption = pollData.metadata.allowAddOption;

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [pollOptions, setPollOptions] = useState<PollOption[]>(pollData?.LmMeta.options);
    const [isAddOptionDialogOpen, setIsAddOptoinDialogOpen] = useState(false);
    const [newOptionText, setNewOptionText] = useState(
        {
            id: `new-${Date.now()}`,
            text: "",
            isSelected: false,
            percentage: 0,
            uuid: `uuid-${Date.now()}`,
            voteCount: 0
        }
    );

    const totalVotes = useMemo(() => {
        let totalCount = 0;
        pollOptions.map((pollOption) => {
            totalCount += pollOption.voteCount;
        })

        return totalCount;
    }, []);

    const [totalVotesCount, setTotalVotesCount] = useState(totalVotes);


    useEffect(() => {

    }, []);

    return (
        <div
            className="attachment-poll"
        >
            <div className="poll-feed-title">
                {pollData?.metadata.title}
            </div>
            {
                pollSelectionText && <div className="poll-feed-vote-count poll-feed-preview-advance-options-select poll-preview-subheading-style">
                    {pollSelectionText}
                </div>
            }
            <div>
                {pollOptions.map((pollOption, index) => {
                    return (
                        <div>
                            <div onClick={() => {
                                pollOption.isSelected = true;
                                pollOption.voteCount += 1;
                                setTotalVotesCount((totalVotesCount) => totalVotesCount + 1);
                                pollOption.percentage = ((pollOption.voteCount) / totalVotesCount) * 100;
                            }} className="poll-option-wrapper progress-bar" style={{
                                width: `${pollOption.percentage}%`,
                                backgroundColor: '#4caf50', // You can customize the color
                            }} key={index} >
                                <div
                                    className="poll-feed-option-text-input poll-option-text-input-preview"
                                >{pollOption.text}</div>
                            </div>
                            {
                                pollOption.voteCount >= 0 &&
                                <div className="poll-feed-vote-count poll-feed-preview-advance-options-votes poll-preview-subheading-style">
                                    {pollOption.voteCount} votes
                                </div>
                            }
                        </div>
                    );
                })}

                {
                    shouldShowAddOptionButton({
                        pollType,
                        pollOptions,
                        pollExpiryTime,
                        allowAddOption,
                    }) ? <div className="poll-feed-option-add-more" onClick={() => {
                        setIsAddOptoinDialogOpen(true);
                    }}>
                        <div className="poll-option-add-more-icon">
                            <img className="poll-option-img" src={pollOptionAddMoreIcon} alt="addMore" />
                            <span className="add-more-text">Add an option</span>
                        </div>
                    </div> : null
                }
            </div>

            <div>
                {shouldShowSubmitButton({
                    pollType, pollOptions,
                    pollExpiryTime,
                    pollMultiSelectNo: multiSelectNo,
                    pollMultiSelectState: multiSelectState
                }) ? <div
                    className={`lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-multiple-options-submit-button ` + (newOptionText.text.trim().length === 0 ? `poll-feed-submit-button-disabled` : ``)}
                    onClick={(newOptionText.text.trim().length !== 0) ? () => {

                    } : () => { }}
                >
                    <span>
                        Submit Vote
                    </span>
                </div> : null}
            </div>

            <div className="poll-feed-vote-count poll-feed-preview-advance-options-total poll-preview-subheading-style">
                <div className="poll-feed-total-votes">{totalVotesCount} votes</div>
                <div className="poll-feed-time-left">
                    {pollTimeLeft} left
                </div>
            </div>

            <Dialog
                open={isAddOptionDialogOpen}
                onClose={() => {
                    setIsAddOptoinDialogOpen(false);
                }}
            >
                <div
                    className="lm-feed-create-post-wrapper"
                >
                    <div className="lm-feed-create-post-wrapper__dialog-heading">
                        Add new poll option
                        <img
                            src={cancelModelMcon}
                            alt="cancelModelMcon"
                            onClick={() => {
                                setIsAddOptoinDialogOpen(false);
                                setNewOptionText({ ...newOptionText, text: "" });
                            }}
                            className="cancelIcon"
                        />
                    </div>

                    <div className="poll-feed-add-option-dialog-text">
                        Enter an option that you think is missing in this poll. This cannot be undone.
                    </div>

                    <div className="poll-option-wrapper" >
                        <input
                            type="text"
                            value={newOptionText.text}
                            onChange={(e) => setNewOptionText({ ...newOptionText, text: e.target.value })}
                            placeholder={`Type new Option`}
                            className="poll-option-text-input"
                        />
                    </div>


                    <div
                        className={`lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-submit-button ` + (newOptionText.text.trim().length === 0 ? `poll-feed-submit-button-disabled` : ``)}
                        onClick={(newOptionText.text.trim().length !== 0) ? () => {
                            setPollOptions([...pollOptions, newOptionText]);
                            setIsAddOptoinDialogOpen(false);
                        } : () => { }}
                    >
                        <span>
                            SUBMIT
                        </span>
                    </div>
                </div>
            </Dialog>

        </div >
    )
}

export default LMPostPoll