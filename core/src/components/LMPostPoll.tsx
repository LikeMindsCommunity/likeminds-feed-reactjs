import { FeedPostContext } from "..";
import { useContext } from "react";
import { getTimeLeftInPoll, hasPollEnded, getPollSelectionText, PollOption, multipleOptionSubmitVoteValidation } from "../shared/utils";
import { Dialog } from "@mui/material";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";
import checkPollOptionIcon from '../assets/images/select tick.svg';
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getAvatar } from "../shared/components/LMUserMedia";
import noResponses from "../assets/images/no response.svg";
import { usePostPoll } from "../hooks/usePostPoll";

export const LMPostPoll = () => {
    const { currentUser } = useContext(LMFeedUserProviderContext);
    const { users } = useContext(FeedPostContext);
    const {
        pollData,
        hasSelectedOption,
        isAddOptionDialogOpen,
        setIsAddOptionDialogOpenFun,
        showSubmitVoteButton,
        showAddOptionButton,
        resultScreenDialogOpen,
        setResultScreenDialogOpenFun,
        pollResultSelectedTab,
        setPollResultSelectedTabFun,
        totalMultipleOptions,
        newOption,
        setNewOptionFun,
        voteDetails,
        pollOptions,
        handleOptionClick,
        handleAddOptionSubmit,
        submitVoteHandler,
        totalVotesCount,
    } = usePostPoll();

    const {
        LMPostPollUniversalFeedStyles,
        LMFeedPostPollResultScreenStyles,
        onOptionSelectedCustomCallback,
    } = useContext(CustomAgentProviderContext);

    const pollExpiryTime = pollData?.metadata.expiryTime;
    const pollTimeLeft = getTimeLeftInPoll(pollExpiryTime);
    const multiSelectNo = pollData?.metadata.multipleSelectNumber;
    const multiSelectState = pollData?.metadata.multipleSelectState;
    const pollSelectionText = getPollSelectionText(multiSelectNo, multiSelectState);
    const allowAddOption = pollData?.metadata.allowAddOption;

    const renderProgress = (option: PollOption) => {
        const percentage = pollData?.LmMeta?.toShowResults ? option.percentage : 0;
        return (
            <div
                className="poll-background-bar"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: "#e6ebf5",
                    transition: "width 0.5s ease",
                }}
            />
        );
    };

    return (
        <div
            className="attachment-poll"
        >
            <div style={LMPostPollUniversalFeedStyles?.addPollOptionHeadingStyles} className="poll-feed-title">
                {pollData?.metadata.title}
            </div>
            {
                pollSelectionText && <div className="poll-feed-vote-count poll-feed-preview-advance-options-select poll-preview-subheading-style">
                    {pollSelectionText}
                </div>
            }
            <div>
                {pollOptions.map((pollOption: PollOption, index: number) => {
                    const addedByText = pollData?.metadata.allowAddOption
                        ? pollOption.uuid === currentUser?.uuid
                            ? "Added by you"
                            : users && users[pollOption.uuid]?.name
                                ? `Added by ${users[pollOption.uuid].name}`
                                : ""
                        : "";
                    return (
                        <div key={index}>
                            <div onClick={() => {
                                handleOptionClick(index);
                            }}
                                style={LMPostPollUniversalFeedStyles?.addPollOptionInputBoxStyles}
                                className={`poll-feed-option-wrapper ` + (hasSelectedOption ? `` : ` cursor-pointer poll-margin-bottom`) + (pollOption.isSelected ? ` poll-feed-selected-option-wrapper ` : ` `)} key={index} >
                                {hasSelectedOption && renderProgress(pollOption)}
                                <div className={`poll-feed-option-text-input poll-option-text-input-preview poll-text` + (allowAddOption && addedByText ? ` .poll-text-added-by ` : ``)} >
                                    {pollOption.text}
                                    {allowAddOption && addedByText && (
                                        <div className="poll-feed-added-by">
                                            {addedByText}
                                        </div>
                                    )}
                                </div>
                                {!hasSelectedOption && pollOption.isSelected ? <span
                                    className="poll-option-remove"
                                >
                                    <img src={checkPollOptionIcon} alt="check" />
                                </span> : null}
                            </div>
                            {hasSelectedOption && pollData?.LmMeta?.toShowResults && pollOption.voteCount >= 0 && (
                                <div
                                    onClick={() => { setPollResultSelectedTabFun(index); setResultScreenDialogOpenFun(true); }}
                                    className="lm-cursor-pointer poll-feed-vote-count poll-feed-preview-advance-options-votes poll-preview-subheading-style">
                                    {pollOption.voteCount} votes
                                </div>
                            )}
                        </div>
                    );
                })}

                {
                    showAddOptionButton ? <div className="poll-feed-option-add-more" onClick={() => {
                        setIsAddOptionDialogOpenFun(true);
                    }}>
                        <div className="poll-option-add-more-icon">
                            <span className="add-more-text">+ Add an option</span>
                        </div>
                    </div> : null
                }
            </div>

            <div>
                {showSubmitVoteButton && (
                    multipleOptionSubmitVoteValidation(multiSelectNo,
                        multiSelectState, totalMultipleOptions.current) ?
                        <div
                            style={LMPostPollUniversalFeedStyles?.submitButtonStyles}
                            className={`lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-multiple-options-submit-button `}
                            onClick={submitVoteHandler}
                        >
                            Submit Vote
                        </div> : <div
                            style={LMPostPollUniversalFeedStyles?.submitButtonStyles}
                            className={` lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-multiple-options-submit-button poll-feed-submit-button-disabled`}
                        >
                            Submit Vote
                        </div>
                )
                }
            </div>

            <div className="poll-feed-vote-count poll-feed-preview-advance-options-total poll-preview-subheading-style">
                <div className="lm-cursor-pointer poll-feed-total-votes" onClick={() => { setPollResultSelectedTabFun(0); setResultScreenDialogOpenFun(true); }}>
                    {totalVotesCount} votes</div>
                <div className="poll-feed-time-left">
                    {pollTimeLeft}
                </div>
            </div>

            <Dialog
                open={isAddOptionDialogOpen}
                onClose={() => {
                    setIsAddOptionDialogOpenFun(false);
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
                                setIsAddOptionDialogOpenFun(false);
                                setNewOptionFun("");
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
                            value={newOption}
                            onChange={(e) => setNewOptionFun(e.target.value)}
                            placeholder={`Type new Option`}
                            className="poll-option-text-input"
                        />
                    </div>

                    <div
                        className={`lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-submit-button ` + (newOption.trim().length === 0 ? `poll-feed-submit-button-disabled` : ``)}
                        onClick={handleAddOptionSubmit}
                    >
                        <span>
                            SUBMIT
                        </span>
                    </div>
                </div>
            </Dialog>


            {
                (pollData?.LmMeta?.toShowResults && !pollData?.metadata.isAnonymous || hasPollEnded(pollData?.metadata.expiryTime)) ?
                    <Dialog
                        open={resultScreenDialogOpen}
                        onClose={() => {
                            setResultScreenDialogOpenFun(false);
                        }}
                        sx={{
                            '& .MuiDialog-paper': {
                                width: '70%', // Default width for larger screens
                                maxWidth: '800px', // Restrict max width
                                '@media (max-width: 900px)': {
                                    width: '85%', // Adjust for medium screens
                                },
                                '@media (max-width: 600px)': {
                                    width: '95%', // Adjust for small screens
                                },
                            },
                        }}
                    >
                        <div className="lm-feed-create-post-wrapper lm-feed-poll-wrapper2 " >
                            <div className="lm-feed-create-post-wrapper__dialog-heading">
                                Poll Results
                                <img
                                    src={cancelModelMcon}
                                    alt="cancelModelMcon"
                                    onClick={() => {
                                        setResultScreenDialogOpenFun(false);
                                    }}
                                    className="cancelIcon"
                                />
                            </div>

                            <div className="poll-results-screen-wrapper">
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        width: "100%",
                                        bgcolor: 'background.paper',
                                        borderBottom: '2px solid #d9dce0'
                                    }}
                                >
                                    <Tabs
                                        value={pollResultSelectedTab}
                                        onChange={(e, val) => { setPollResultSelectedTabFun(val); onOptionSelectedCustomCallback?.(); }}
                                        variant="scrollable"
                                        scrollButtons
                                        aria-label="visible arrows tabs example"
                                        sx={{
                                            [`& .${tabsClasses.scrollButtons}`]: {
                                                '&.Mui-disabled': { opacity: 0.3 },
                                            },
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: '#5046e5',// Set the color for the indicator (selected tab)
                                                borderBottom: '5px solid #5046e5',
                                            },
                                        }}
                                    >
                                        {
                                            pollOptions.map((option, idx) => (
                                                <Tab
                                                    label={<div style={pollResultSelectedTab == idx ? LMFeedPostPollResultScreenStyles?.selectOptionStyles : LMFeedPostPollResultScreenStyles?.otherOptionsStyles} className="poll-results-tab2"> <span>{option.voteCount}</span>
                                                        <span> {option.text.length > 20 ? option.text.slice(0, 20) + "..." : option.text}</span></div>}
                                                    sx={{
                                                        color: '#666666', // Default color for unselected tabs
                                                        textTransform: 'none', // Prevents text from being capitalized
                                                        '&.Mui-selected': { color: '#5046e5' }, // Color for selected tab
                                                    }}
                                                    key={idx}
                                                />

                                            ))
                                        }
                                    </Tabs>
                                </Box>
                                <div className="poll-results-memeber-list-wrapper">
                                    {
                                        voteDetails ? voteDetails.users.map((currentUser, idx) => (
                                            <div key={idx}
                                                className="lm-feed-create-post-wrapper__user-meta poll-results__user-meta">
                                                <div className="lm-avatar lm-mr-4">
                                                    {getAvatar({
                                                        imageUrl: currentUser?.imageUrl,
                                                        name: currentUser?.name,
                                                    })}
                                                </div>
                                                <div>{currentUser?.name}</div>
                                            </div>
                                        )) : <>
                                            <div className="poll-results-no-response">
                                                <img src={noResponses} alt="check" />
                                                <span className="poll-results-no-response-text">No Responses</span>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                        </div>
                    </Dialog > :

                    <Dialog
                        open={resultScreenDialogOpen}
                        onClose={() => {
                            setResultScreenDialogOpenFun(false);
                        }}
                    >
                        <div className="lm-feed-create-post-wrapper" >
                            <div className="lm-feed-create-post-wrapper__dialog-heading">
                                Poll Results
                                <img
                                    src={cancelModelMcon}
                                    alt="cancelModelMcon"
                                    onClick={() => {
                                        setResultScreenDialogOpenFun(false);
                                    }}
                                    className="cancelIcon"
                                />
                            </div>
                            {
                                pollData?.metadata.isAnonymous ?
                                    <div className="poll-feed-add-option-dialog-text">
                                        This being an anonymous poll, the names of the voters cannot be disclosed.
                                    </div> :
                                    <div className="poll-feed-add-option-dialog-text">
                                        The results will be visible after the poll has ended.
                                    </div>
                            }
                        </div>
                    </Dialog >
            }
        </div >
    )
}

export default LMPostPoll