import { FeedPostContext } from "..";
import { useContext, useMemo } from "react";
import { getTimeLeftInPoll, hasPollEnded, getPollSelectionText, PollOption, multipleOptionSubmitVoteValidation, isInstantPoll } from "../shared/utils";
import { Dialog } from "@mui/material";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";
import checkPollOptionIcon from '../assets/images/select-tick.svg';
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getAvatar } from "../shared/components/LMUserMedia";
import noResponses from "../assets/images/no-response.svg";
import { usePostPoll } from "../hooks/usePostPoll";
import DotIcon from '../assets/images/dot-icon.svg';
import { textPreprocessor } from "../shared/taggingParser";
import { pluralizeOrCapitalize } from "../shared/utils";
import { WordAction } from "../shared/enums/wordAction";
import InfiniteScroll from "react-infinite-scroll-component";

export const LMPostPoll = () => {
    const { currentUser } = useContext(LMFeedUserProviderContext);
    const { users } = useContext(FeedPostContext);
    const {
        pollData,
        hasSelectedOption,
        isAddOptionDialogOpen,
        handleAddOptionDialog,
        showSubmitVoteButton,
        showAddOptionButton,
        resultScreenDialogOpen,
        setResultScreenDialogOpenFunction,
        pollResultSelectedTab,
        setPollResultSelectedTabFunction,
        totalMultipleOptions,
        newOption,
        setNewOptionFunction,
        voteDetails,
        pollOptions,
        handleOptionClick,
        handleAddOptionSubmit,
        submitVoteHandler,
        totalMembersVotes,
        isEditMode,
        setIsEditModeFunction,
        onOptionVoteCountClick,
        pollReadMoreTapped,
        pollReadMoreTappedFunction,
        hasMoreVotes,
        fetchNextPage,
    } = usePostPoll();

    const pollExpiryTime = pollData?.metadata.expiryTime;
    const pollTimeLeft = getTimeLeftInPoll(pollExpiryTime);
    const multiSelectNo = pollData?.metadata.multipleSelectNumber;
    const multiSelectState = pollData?.metadata.multipleSelectState;
    const pollSelectionText = getPollSelectionText(multiSelectNo, multiSelectState);
    const allowAddOption = pollData?.metadata.allowAddOption;
    const pollType = pollData?.metadata.pollType;

    const memoizedPollOptions = useMemo(() => {
        return pollOptions.map((pollOption: PollOption, index: number) => {
            const addedByText = pollData?.metadata.allowAddOption
                ? pollOption.uuid === currentUser?.uuid
                    ? `Added by you`
                    : users && users[pollOption.uuid]?.name
                        ? `Added by ${pluralizeOrCapitalize(users[pollOption.uuid].name, WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`
                        : ""
                : "";

            return (
                <div key={index}>
                    <div
                        onClick={() => handleOptionClick(index)}
                        className={
                            `poll-feed-option-wrapper cursor-pointer poll-margin-bottom ` +
                            (!isInstantPoll(pollType)
                                ? isEditMode
                                    ? ` `
                                    : `cursor-default`
                                : hasSelectedOption
                                    ? `cursor-default poll-margin-remove`
                                    : ` `) +
                            (pollOption.isSelected ? ` poll-feed-selected-option-wrapper ` : ` `) +
                            (hasPollEnded(pollExpiryTime) ? `cursor-default poll-margin-remove` : ``) + (pollData?.lmMeta?.toShowResults ? ` ` : ` poll-results-margin `)
                        }
                    >
                        {((hasSelectedOption && isInstantPoll(pollType)) ||
                            hasPollEnded(pollExpiryTime)) &&
                            <div
                                className="poll-background-bar post-poll-selected-option-custom-style"
                                style={{ width: `${pollData?.lmMeta?.toShowResults ? pollOption.percentage : 0}%` }}
                            />}
                        <div
                            className={
                                `poll-feed-option-text-input poll-option-text-input-preview poll-text` +
                                (allowAddOption && addedByText ? ` poll-text-added-by ` : ``) + (((hasSelectedOption && isInstantPoll(pollType)) ||
                                    hasPollEnded(pollExpiryTime)) && !pollOption.isSelected ? ` post-poll-unselected-option-custom-style ` : ` `)
                            }
                        >
                            {pollOption.text}
                            {allowAddOption && addedByText && (
                                <div className="poll-feed-added-by">{addedByText}</div>
                            )}
                        </div>
                        {((isInstantPoll(pollType) && !hasSelectedOption) ||
                            !isInstantPoll(pollType)) &&
                            pollOption.isSelected ? (
                            <span className="poll-option-remove">
                                <img src={checkPollOptionIcon} alt="check" />
                            </span>
                        ) : null}
                    </div>
                    {((isInstantPoll(pollType) && hasSelectedOption) ||
                        hasPollEnded(pollExpiryTime)) &&
                        pollData?.lmMeta?.toShowResults && (
                            <div
                                onClick={() => { onOptionVoteCountClick(index, true); }}
                                className="lm-cursor-pointer poll-feed-vote-count poll-feed-preview-advance-options-votes poll-preview-subheading-style post-poll-vote-count-custom-style"
                            >
                                {pollOption.voteCount <= 1 ? `${pollOption.voteCount} vote` : `${pollOption.voteCount} votes`}
                            </div>
                        )}
                </div>
            );
        });
    }, [
        pollOptions,
        pollData,
        currentUser,
        users,
        pollType,
        isEditMode,
        hasSelectedOption,
        pollExpiryTime,
        allowAddOption,
        handleOptionClick,
        onOptionVoteCountClick,
    ]);

    return (
        <div
            className="attachment-poll"
        >
            <div className="poll-feed-title post-poll-question-custom-style">
                {(() => {
                    const preprocessedText = textPreprocessor(pollData?.metadata.title);

                    if (preprocessedText.showReadMore && !pollReadMoreTapped) {
                        return (<>
                            {preprocessedText.text}
                            <span
                                className="lm-feed-wrapper__card__body__content__read-more-tap-icon"
                                style={{
                                    color: "gray",
                                    fontWeight: "400",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                                onClick={() => pollReadMoreTappedFunction()}
                            >
                                ...ReadMore
                            </span>
                        </>)
                    }
                    else {
                        return pollData?.metadata.title
                    }
                })()
                }
            </div >
            {
                pollSelectionText && <div className="poll-feed-vote-count poll-feed-preview-advance-options-select poll-preview-subheading-style post-poll-info-custom-style">
                    {pollSelectionText}
                </div>
            }

            {memoizedPollOptions}
            {
                showAddOptionButton ? <div className="poll-feed-option-add-more post-poll-add-option-custom-style" onClick={() => {
                    handleAddOptionDialog(true);
                }}>
                    <div className="poll-option-add-more-icon">
                        <span className="add-more-text">+ Add an option</span>
                    </div>
                </div> : null
            }



            {
                showSubmitVoteButton && (
                    multipleOptionSubmitVoteValidation(multiSelectNo,
                        multiSelectState, totalMultipleOptions) ?
                        <div
                            className="lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-multiple-options-submit-button post-poll-submit-button-custom-style"
                            onClick={submitVoteHandler}
                        >
                            Submit Vote
                        </div> : <div
                            className="lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-multiple-options-submit-button poll-feed-submit-button-disabled post-poll-submit-button-custom-style"
                        >
                            Submit Vote
                        </div>
                )
            }

            <div className="poll-feed-vote-count poll-feed-preview-advance-options-total poll-preview-subheading-style">
                {
                    (isInstantPoll(pollType) && hasSelectedOption || hasPollEnded(pollExpiryTime)) &&
                    <div className="lm-cursor-pointer poll-feed-total-votes member-voted-count-custom-style" onClick={() => { setPollResultSelectedTabFunction(0); setResultScreenDialogOpenFunction(true); }}>
                        {totalMembersVotes <= 1 ? `${totalMembersVotes} vote` : `${totalMembersVotes} votes`}
                    </div>
                }
                {
                    (!hasSelectedOption && !hasPollEnded(pollExpiryTime) && totalMembersVotes == 0) &&
                    <div className=" poll-feed-total-votes poll-first-vote-text" >
                        {pollData?.lmMeta?.pollAnswerText}
                    </div>
                }
                {(isInstantPoll(pollType) && hasSelectedOption || hasPollEnded(pollExpiryTime) || (!isInstantPoll(pollType) && hasSelectedOption)) &&
                    <div className="poll-feed-time-left">
                        {(isInstantPoll(pollType) && hasSelectedOption || hasPollEnded(pollExpiryTime)) && <img className="poll-feed-dot" src={DotIcon} alt="dot-icon" />}
                        {pollTimeLeft}
                    </div>
                }
                {
                    !hasPollEnded(pollExpiryTime) && !isInstantPoll(pollType) && !isEditMode &&
                    <div className="lm-cursor-pointer poll-feed-total-votes" onClick={() => { setIsEditModeFunction(true); }}>
                        <img className="poll-feed-dot" src={DotIcon} alt="" />
                        Edit Vote
                    </div>
                }
            </div>

            <Dialog
                open={isAddOptionDialogOpen}
                onClose={() => {
                    handleAddOptionDialog(false);
                }}
            >
                <div
                    className="lm-feed-create-post-wrapper"
                >
                    <div className="lm-feed-create-post-wrapper__dialog-heading">
                        <div className="poll-feed-add-poll-option-heading-custom-style">
                            Add new poll option
                        </div>
                        <img
                            src={cancelModelMcon}
                            alt="cancelModelMcon"
                            onClick={() => {
                                handleAddOptionDialog(false);
                                setNewOptionFunction("");
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
                            onChange={(e) => setNewOptionFunction(e.target.value)}
                            placeholder="Type new Option"
                            className="poll-option-text-input poll-feed-add-poll-option-input-custom-style"
                        />
                    </div>
                    <div
                        className={`lm-cursor-pointer lm-feed-create-post-wrapper__submit-button lm-mt-4 poll-feed-submit-button ` + (newOption.trim().length === 0 ? `poll-feed-submit-button-disabled` : ``) + ` poll-feed-add-poll-option-submit-button-custom-style `}
                        onClick={handleAddOptionSubmit}
                    >
                        <span>
                            SUBMIT
                        </span>
                    </div>
                </div>
            </Dialog>


            {
                (!pollData?.metadata.isAnonymous && (isInstantPoll(pollType) && pollData?.lmMeta?.toShowResults || hasPollEnded(pollData?.metadata.expiryTime))) ?
                    <Dialog
                        open={resultScreenDialogOpen}
                        onClose={() => {
                            setResultScreenDialogOpenFunction(false);
                        }}
                        sx={{
                            '& .MuiDialog-paper': {
                                width: '50%', // Default width for larger screens
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
                                        setResultScreenDialogOpenFunction(false);
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
                                        onChange={(e, val) => {
                                            setPollResultSelectedTabFunction(val);
                                        }}
                                        variant="scrollable"
                                        scrollButtons
                                        aria-label="visible arrows tabs example"
                                        className="post-poll-results-tab-layout-custom-style "
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
                                                    label={<div className={`poll-results-tab2 ` + (pollResultSelectedTab == idx ? ` post-poll-results-selected-option-custom-style ` : ` post-poll-results-other-option-custom-style `)}> <span>{option.voteCount}</span>
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

                                <div className="poll-results-memeber-list-wrapper" id="poll-scroll-container">
                                    {voteDetails && voteDetails.users.length > 0 ? (
                                        <InfiniteScroll
                                            dataLength={voteDetails.users.length}
                                            next={fetchNextPage}
                                            hasMore={hasMoreVotes}
                                            loader={<div>Loading...</div>}
                                            scrollableTarget="poll-scroll-container"
                                        >
                                            {voteDetails.users.map((currentUser) => (
                                                <div
                                                    key={currentUser?.id}
                                                    className="lm-feed-create-post-wrapper__user-meta poll-results__user-meta"
                                                >
                                                    <div className="lm-avatar lm-mr-4">
                                                        {getAvatar({
                                                            imageUrl: currentUser?.imageUrl,
                                                            name: currentUser?.name,
                                                        })}
                                                    </div>
                                                    <div>{currentUser?.name}</div>
                                                </div>
                                            ))}
                                        </InfiniteScroll>
                                    ) : (
                                        <div className="poll-results-no-response">
                                            <img src={noResponses} alt="check" />
                                            <span className="poll-results-no-response-text">
                                                No Responses
                                            </span>
                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>
                    </Dialog > :

                    <Dialog
                        open={resultScreenDialogOpen}
                        onClose={() => {
                            setResultScreenDialogOpenFunction(false);
                        }}
                    >
                        <div className="lm-feed-create-post-wrapper" >
                            <div className="lm-feed-create-post-wrapper__dialog-heading">
                                Poll Results
                                <img
                                    src={cancelModelMcon}
                                    alt="cancelModelMcon"
                                    onClick={() => {
                                        setResultScreenDialogOpenFunction(false);
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