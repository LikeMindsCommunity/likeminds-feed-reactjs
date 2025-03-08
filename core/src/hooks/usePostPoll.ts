/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isPollSubmitted,
  hasPollEnded,
  isInstantPoll,
  isMultiChoicePoll,
  shouldShowSubmitButton,
  shouldShowAddOptionButton,
  PollOption,
} from "../shared/utils";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LMFeedGlobalClientProviderContext from "../contexts/LMFeedGlobalClientProviderContext";
import { FeedPostContext } from "..";
import { User } from "../shared/types/models/member";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";
import { WidgetResponse } from "../shared/utils";
import {
  ApplicationGeneralsStore,
  PollCreationDataStore,
  PollCreationDefaultActions,
} from "../shared/types/cutomCallbacks/dataStores";
import LMFeedUserProviderContext from "../contexts/LMFeedUserProviderContext";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";

interface UsePostPoll {
  pollData: WidgetResponse | null;
  hasSelectedOption: boolean;
  isAddOptionDialogOpen: boolean;
  handleAddOptionDialog: (toggle: boolean) => void;
  showSubmitVoteButton: boolean;
  showAddOptionButton: boolean;
  resultScreenDialogOpen: boolean;
  setResultScreenDialogOpenFunction: (toggle: boolean) => void;
  hasMultiOptionSelect: MutableRefObject<boolean>;
  pollResultSelectedTab: number;
  setPollResultSelectedTabFunction: (tab: number) => void;
  totalMultipleOptions: number;
  newOption: string;
  setNewOptionFunction: (option: string) => void;
  voteDetails: {
    users: (User | undefined)[];
  } | null;
  pollOptions: PollOption[];
  handleOptionClick: (index: number) => void;
  handleAddOptionSubmit: () => void;
  submitVoteHandler: () => void;
  totalVotesCount: number;
  totalMembersVotes: number;
  isEditMode: boolean;
  setIsEditModeFunction: (toggle: boolean) => void;
  onOptionVoteCountClick: (tab: number, toggle: boolean) => void;
  pollReadMoreTapped: boolean;
  pollReadMoreTappedFunction: () => void;
  fetchNextPage: () => void;
  hasMoreVotes: boolean;
}

export function usePostPoll(): UsePostPoll {
  const { post, widgets } = useContext(FeedPostContext);
  const { lmFeedclient } = useContext(LMFeedGlobalClientProviderContext);
  const { currentCommunity, currentUser, logoutUser } = useContext(
    LMFeedUserProviderContext,
  );

  const { displaySnackbarMessage, closeSnackbar, showSnackbar, message } =
    useContext(GeneralContext);
  const { PostPollCustomCallbacks = {} } = useContext(
    CustomAgentProviderContext,
  );
  const {
    onSubmitButtonClicked,
    onAddPollOptionsClicked,
    onPollOptionClicked,
    onSubmitButtonClick,
    onOptionSelected,
  } = PostPollCustomCallbacks;

  const pollId = post?.attachments[0].metaData.entityId;
  const pollData = widgets && pollId ? widgets[pollId] : null;
  const pollExpiryTime = pollData?.metadata.expiryTime;
  const multiSelectNo = pollData?.metadata.multipleSelectNumber;
  const multiSelectState = pollData?.metadata.multipleSelectState;
  const pollType = pollData?.metadata.pollType;
  const allowAddOption = pollData?.metadata.allowAddOption;
  const totalMembersVoted = pollData?.lmMeta?.votersCount;
  const [hasSelectedOption, setHasSelectedOption] = useState<boolean>(
    hasPollEnded(pollExpiryTime),
  );
  const hasMultiOptionSelect = useRef<boolean>(
    isMultiChoicePoll(multiSelectNo, multiSelectState),
  );
  const [pollOptions, setPollOptions] = useState<PollOption[]>(
    pollData?.lmMeta.options,
  );
  const [isAddOptionDialogOpen, setIsAddOptionDialogOpen] =
    useState<boolean>(false);
  const [showSubmitVoteButton, setShowSubmitVoteButton] =
    useState<boolean>(false);
  const [showAddOptionButton, setShowAddOptionButton] =
    useState<boolean>(false);
  const [resultScreenDialogOpen, setResultScreenDialogOpen] =
    useState<boolean>(false);
  const [pollResultSelectedTab, setPollResultSelectedTab] = useState<number>(0);
  const [totalMultipleOptions, setTotalMultipleOptions] = useState<number>(0);
  const [newOption, setNewOption] = useState<string>("");
  const [voteDetails, setVoteDetails] = useState<{
    users: (User | undefined)[];
  } | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMoreVotes, setHasMoreVotes] = useState<boolean>(true);

  const totalVotes = useMemo(() => {
    let totalCount = 0;
    let alreadySelectedCount = 0;
    pollOptions.map((pollOption) => {
      totalCount += pollOption.voteCount;
      if (pollOption.isSelected) alreadySelectedCount++;
    });
    setTotalMultipleOptions(alreadySelectedCount);

    return totalCount;
  }, [pollOptions]);

  const [totalVotesCount, setTotalVotesCount] = useState<number>(totalVotes);
  const [totalMembersVotes, setTotalMembersVotes] =
    useState<number>(totalMembersVoted);

  const [isEditMode, setIsEditMode] = useState(!hasSelectedOption);
  const [pollReadMoreTapped, setPollReadMoreTapped] = useState<boolean>(false);

  const handleOptionClick = (index: number) => {
    if (hasPollEnded(pollExpiryTime)) return;
    if (hasSelectedOption && isInstantPoll(pollType)) return;
    if (hasSelectedOption && !isInstantPoll(pollType) && !isEditMode) return;
    if (hasMultiOptionSelect.current) {
      setPollOptions((prevOptions) =>
        prevOptions.map((option, idx) => {
          if (idx === index) {
            setTotalMultipleOptions(
              totalMultipleOptions + (option.isSelected ? -1 : 1),
            );
            return {
              ...option,
              isSelected: !option.isSelected,
              voteCount: !option.isSelected
                ? option.voteCount + 1
                : option.voteCount - 1,
            };
          }
          return option;
        }),
      );
    } else {
      if (hasSelectedOption) {
        setPollOptions((prevOptions) =>
          prevOptions.map((option) => {
            if (option.isSelected) {
              return {
                ...option,
                isSelected: false,
                voteCount: option.voteCount - 1,
              };
            }
            return option;
          }),
        );
      }
      setPollOptions((prevOptions) =>
        prevOptions.map((option, idx) => {
          if (idx === index) {
            return {
              ...option,
              isSelected: true,
              voteCount: option.voteCount + 1,
            };
          }
          return option;
        }),
      );

      setTotalVotesCount((totalVotesCount) => totalVotesCount + 1);
      setHasSelectedOption(true);
      setIsEditMode(false);
    }
  };

  const handleAddOptionSubmit = async () => {
    try {
      if (!pollId) {
        return;
      }
      const call = await lmFeedclient?.addPollOption({
        pollId,
        text: newOption.trim(),
      });
      if (call?.success) {
        const options = (call?.data?.widget?.lmMeta as any).options;
        setPollOptions(options);
      }
      setIsAddOptionDialogOpen(false);
      setNewOptionFunction("");
    } catch (error) {
      console.error("Error adding poll option:", error);
    }
  };

  const submitVoteHandler = () => {
    setTotalVotesCount(() => {
      let count = 0;
      pollOptions.map((pollOption) => {
        count += pollOption.voteCount;
      });
      return count;
    });
    setHasSelectedOption(true);
    setIsEditMode(false);
  };

  const voteSubmissionHandler = async () => {
    try {
      const updatedPollOptions = pollOptions;
      const selectedOptionIds: string[] = [];
      updatedPollOptions.forEach((option) => {
        if (option.isSelected) {
          selectedOptionIds.push(option.id);
        }
      });
      const pollId = post?.attachments[0].metaData.entityId;

      await lmFeedclient?.submitPollVote({
        pollId: pollId ?? "",
        votes: selectedOptionIds,
      });
      setTotalMembersVotes((totalMembersVotes) => totalMembersVotes + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const setResultScreenDialogOpenFunction = (toggle: boolean) => {
    setResultScreenDialogOpen(toggle);
  };

  const onOptionVoteCountClick = (tab: number, toggle: boolean) => {
    setPollResultSelectedTabFunction(tab);
    setResultScreenDialogOpenFunction(toggle);
  };

  const setPollResultSelectedTabFunction = (tab: number) => {
    setPollResultSelectedTab(tab);
  };

  const setNewOptionFunction = (option: string) => {
    setNewOption(option);
  };

  const handleAddOptionDialog = (toggle: boolean) => {
    setIsAddOptionDialogOpen(toggle);
  };

  const setIsEditModeFunction = (toggle: boolean) => {
    setIsEditMode(toggle);
  };

  const pollReadMoreTappedFunction = () => {
    setPollReadMoreTapped((pollReadMoreTapped) => !pollReadMoreTapped);
  };

  const setShowSubmitVoteButtonFunction = (): boolean => {
    return shouldShowSubmitButton({
      pollType,
      pollOptions,
      pollExpiryTime,
      pollMultiSelectNo: multiSelectNo,
      pollMultiSelectState: multiSelectState,
      isEditMode,
    });
  };

  const setShowAddOptionButtonFunction = (): boolean => {
    return shouldShowAddOptionButton({
      pollType,
      pollOptions,
      pollExpiryTime,
      allowAddOption,
      isEditMode,
    });
  };

  useEffect(() => {
    if (hasSelectedOption) {
      setPollOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          percentage:
            totalVotesCount > 0
              ? (option.voteCount / totalVotesCount) * 100
              : 0,
        })),
      );
      if (!hasPollEnded(pollData?.metadata.expiryTime)) voteSubmissionHandler();
    } else {
      if (isPollSubmitted(pollOptions)) {
        setHasSelectedOption(true);
        setIsEditMode(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalVotesCount]);

  useEffect(() => {
    setShowSubmitVoteButton(setShowSubmitVoteButtonFunction);
    setShowAddOptionButton(setShowAddOptionButtonFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSelectedOption, isEditMode]);

  const fetchNextPage = () => {
    if (hasMoreVotes) {
      selectedOptionMemberList(page + 1);
    }
  };

  const selectedOptionMemberList = async (currentPage = 1) => {
    const pollId = pollData?.id;
    const pollOption = pollOptions[pollResultSelectedTab];
    const optionId = pollOption.id;

    if (pollOption.voteCount > 0) {
      try {
        const response = await lmFeedclient?.getPollVotes({
          pollId: pollId,
          votes: [optionId],
          page: currentPage,
          pageSize: 10,
        });

        const vote = response?.data?.votes?.find((v) => v.id === optionId);

        if (vote && vote.users.length > 0) {
          setVoteDetails({
            users: vote.users.map((userId) => response?.data?.users[userId]),
          });
          setPage(currentPage);
          setHasMoreVotes(vote.users.length >= 10); // If less than pageSize, assume no more data
        } else {
          setVoteDetails(null);
          setHasMoreVotes(false);
        }
      } catch (error) {
        console.error(error);
        setVoteDetails(null);
        setHasMoreVotes(false);
      }
    } else {
      setVoteDetails(null);
    }
  };

  useEffect(() => {
    if (resultScreenDialogOpen) {
      selectedOptionMemberList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollResultSelectedTab, resultScreenDialogOpen]);

  const pollPostDataStore: PollCreationDataStore = {
    pollData,
    hasSelectedOption,
    isAddOptionDialogOpen,
    showSubmitVoteButton,
    showAddOptionButton,
    resultScreenDialogOpen,
    hasMultiOptionSelect,
    pollResultSelectedTab,
    totalMultipleOptions,
    newOption,
    voteDetails,
    pollOptions,
    totalVotesCount,
    isEditMode,
  };

  const defaultActions: PollCreationDefaultActions = {
    handleAddOptionDialog,
    setResultScreenDialogOpenFunction,
    setPollResultSelectedTabFunction,
    setNewOptionFunction,
    handleOptionClick,
    handleAddOptionSubmit,
    submitVoteHandler,
    setIsEditModeFunction,
  };

  const applicationGeneralsStore: ApplicationGeneralsStore = {
    userDataStore: {
      lmFeedUser: currentUser,
      lmFeedUserCurrentCommunity: currentCommunity,
      logOutUser: logoutUser,
    },
    generalDataStore: {
      displaySnackbarMessage,
      closeSnackbar,
      showSnackbar,
      message,
    },
  };

  return {
    pollData,
    hasSelectedOption,
    isAddOptionDialogOpen,
    handleAddOptionDialog: onAddPollOptionsClicked
      ? onAddPollOptionsClicked.bind(null, {
        pollCreationDataStore: pollPostDataStore,
        applicationGeneralStore: applicationGeneralsStore,
        defaultActions: defaultActions,
      })
      : handleAddOptionDialog,
    showSubmitVoteButton,
    showAddOptionButton,
    resultScreenDialogOpen,
    setResultScreenDialogOpenFunction,
    hasMultiOptionSelect,
    pollResultSelectedTab,
    setPollResultSelectedTabFunction: onOptionSelected
      ? onOptionSelected.bind(null, {
        pollCreationDataStore: pollPostDataStore,
        applicationGeneralStore: applicationGeneralsStore,
        defaultActions: defaultActions,
      })
      : setPollResultSelectedTabFunction,
    totalMultipleOptions,
    newOption,
    setNewOptionFunction,
    voteDetails,
    pollOptions,
    handleOptionClick,
    handleAddOptionSubmit: onSubmitButtonClick
      ? onSubmitButtonClick.bind(null, {
        pollCreationDataStore: pollPostDataStore,
        applicationGeneralStore: applicationGeneralsStore,
        defaultActions: defaultActions,
      })
      : handleAddOptionSubmit,
    submitVoteHandler: onSubmitButtonClicked
      ? onSubmitButtonClicked.bind(null, {
        pollCreationDataStore: pollPostDataStore,
        applicationGeneralStore: applicationGeneralsStore,
        defaultActions: defaultActions,
      })
      : submitVoteHandler,
    totalVotesCount,
    totalMembersVotes,
    isEditMode,
    setIsEditModeFunction,
    onOptionVoteCountClick: onPollOptionClicked
      ? onPollOptionClicked.bind(null, {
        pollCreationDataStore: pollPostDataStore,
        applicationGeneralStore: applicationGeneralsStore,
        defaultActions: defaultActions,
      })
      : onOptionVoteCountClick,
    pollReadMoreTapped,
    pollReadMoreTappedFunction,
    fetchNextPage,
    hasMoreVotes,
  };
}
