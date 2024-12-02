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

interface UsePostPoll {
  pollData: WidgetResponse | null;
  hasSelectedOption: boolean;
  isAddOptionDialogOpen: boolean;
  setIsAddOptionDialogOpenFun: (toggle: boolean) => void;
  showSubmitVoteButton: boolean;
  showAddOptionButton: boolean;
  resultScreenDialogOpen: boolean;
  setResultScreenDialogOpenFun: (toggle: boolean) => void;
  hasMultiOptionSelect: MutableRefObject<boolean>;
  pollResultSelectedTab: number;
  setPollResultSelectedTabFun: (tab: number) => void;
  totalMultipleOptions: MutableRefObject<number>;
  newOption: string;
  setNewOptionFun: (option: string) => void;
  voteDetails: {
    users: (User | undefined)[];
  } | null;
  pollOptions: PollOption[];
  handleOptionClick: (index: number) => void;
  handleAddOptionSubmit: () => void;
  submitVoteHandler: () => void;
  totalVotesCount: number;
}

export function usePostPoll(): UsePostPoll {
  const { post, widgets } = useContext(FeedPostContext);
  const { lmFeedclient } = useContext(LMFeedGlobalClientProviderContext);
  const { onPollFeedSubmitButtonClicked } = useContext(
    CustomAgentProviderContext,
  );
  const postId2 = post?.attachments[0].attachmentMeta.entityId;
  const pollData = widgets && postId2 ? widgets[postId2] : null;
  const pollExpiryTime = pollData?.metadata.expiryTime;
  const multiSelectNo = pollData?.metadata.multipleSelectNumber;
  const multiSelectState = pollData?.metadata.multipleSelectState;
  const pollType = pollData?.metadata.pollType;
  const allowAddOption = pollData?.metadata.allowAddOption;

  const [hasSelectedOption, setHasSelectedOption] = useState<boolean>(
    hasPollEnded(pollExpiryTime),
  );
  const hasMultiOptionSelect = useRef<boolean>(
    isMultiChoicePoll(multiSelectNo, multiSelectState) ||
      !isInstantPoll(pollData?.metadata.pollType),
  );
  const [pollOptions, setPollOptions] = useState<PollOption[]>(
    pollData?.LmMeta.options,
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
  const totalMultipleOptions = useRef<number>(0);
  const [newOption, setNewOption] = useState<string>("");
  const [voteDetails, setVoteDetails] = useState<{
    users: (User | undefined)[];
  } | null>(null);

  const totalVotes = useMemo(() => {
    let totalCount = 0;
    pollOptions.map((pollOption) => {
      totalCount += pollOption.voteCount;
    });

    return totalCount;
  }, []);

  const [totalVotesCount, setTotalVotesCount] = useState<number>(totalVotes);

  const handleOptionClick = (index: number) => {
    if (hasSelectedOption) return;
    if (hasMultiOptionSelect.current) {
      setPollOptions((prevOptions) =>
        prevOptions.map((option, idx) => {
          if (idx === index) {
            totalMultipleOptions.current += option.isSelected ? -1 : 1;
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
    }
  };

  const handleAddOptionSubmit = async () => {
    try {
      const pollId = postId2;
      if (!pollId) {
        return;
      }
      const call = await lmFeedclient?.addPollOption({
        pollId,
        text: newOption.trim(),
      });
      if (call?.success) {
        const options = (call?.data?.widget?.LmMeta as any).options;
        setPollOptions(options);
      }
      setIsAddOptionDialogOpen(false);
    } catch (error) {
      console.error("Error adding poll option:", error);
    }
  };

  const submitVoteHandler = () => {
    setTotalVotesCount(
      (totalVotesCount) => totalVotesCount + totalMultipleOptions.current,
    );
    setHasSelectedOption(true);
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
      const pollId = post?.attachments[0].attachmentMeta.entityId;

      await lmFeedclient?.submitPollVote({
        pollId: pollId ?? "",
        votes: selectedOptionIds,
      });

      if (onPollFeedSubmitButtonClicked) {
        onPollFeedSubmitButtonClicked();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setResultScreenDialogOpenFun = (toggle: boolean) => {
    setResultScreenDialogOpen(toggle);
  };

  const setPollResultSelectedTabFun = (tab: number) => {
    setPollResultSelectedTab(tab);
  };

  const setNewOptionFun = (option: string) => {
    setNewOption(option);
  };

  const setIsAddOptionDialogOpenFun = (toggle: boolean) => {
    setIsAddOptionDialogOpen(toggle);
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
      }
    }
  }, [totalVotesCount]);

  useEffect(() => {
    setShowSubmitVoteButton(
      shouldShowSubmitButton({
        pollType,
        pollOptions,
        pollExpiryTime,
        pollMultiSelectNo: multiSelectNo,
        pollMultiSelectState: multiSelectState,
      }),
    );
    setShowAddOptionButton(
      shouldShowAddOptionButton({
        pollType,
        pollOptions,
        pollExpiryTime,
        allowAddOption,
      }),
    );
  }, [hasSelectedOption]);

  const selectedOptionMemberList = async () => {
    const pollId = pollData?.id;
    const pollOption = pollOptions[pollResultSelectedTab];
    const optionId = pollOption.id;
    if (pollOption.voteCount > 0) {
      const response = await lmFeedclient?.getPollVotes({
        pollId: pollId,
        votes: [optionId],
        page: 1,
        pageSize: 10,
      });
      const vote = response?.data?.votes?.find((v) => v.id === optionId);
      if (vote && vote.users.length > 0) {
        setVoteDetails({
          users: vote.users.map((userId) => response?.data?.users[userId]),
        });
      } else {
        setVoteDetails(null);
      }
    } else {
      setVoteDetails(null);
    }
  };

  useEffect(() => {
    if (resultScreenDialogOpen) {
      selectedOptionMemberList();
    }
  }, [pollResultSelectedTab, resultScreenDialogOpen]);

  return {
    pollData,
    hasSelectedOption,
    isAddOptionDialogOpen,
    setIsAddOptionDialogOpenFun,
    showSubmitVoteButton,
    showAddOptionButton,
    resultScreenDialogOpen,
    setResultScreenDialogOpenFun,
    hasMultiOptionSelect,
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
  };
}
