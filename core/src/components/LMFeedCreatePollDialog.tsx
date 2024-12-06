import React, { useContext, useState } from "react";
import cancelModelMcon from "../assets/images/cancel-model-icon.svg";
import { changePollCase } from "../shared/utils";
import { WordAction } from "../shared/enums/wordAction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import removePollOptionIcon from '../assets/images/remove-poll-option.svg';
import pollOptionAddMoreIcon from "../assets/images/poll-option-add-more.svg";
import createPollTick from "../assets/images/create-poll-tick.png";
import downArrow from "../assets/images/down-arrow.svg";
import editIcon from "../assets/images/edit-icon.svg";
import {
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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



interface LMFeedCreatePollDialogProps {
}

const switchButtonTheme = createTheme({
  palette: {
    primary: {
      main: '#5046e5',
    }
  },
});
// eslint-disable-next-line no-empty-pattern
const LMFeedCreatePollDialog = ({ }: LMFeedCreatePollDialogProps) => {

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const toggleAdvancedOptions = () => {
    setIsAdvancedOpen((current) => !current);
  };

  const { currentUser } = useContext(LMFeedUserProviderContext);
  const {
    setSelectedTopicIds,
    selectedTopicIds,
    preSelectedTopics,
    setPreSelectedTopics,
    temporaryPost,
    showOGTagViewContainer,
    setOpenCreatePostDialog,
    createPostComponentClickCustomCallback,
    ogTag,
    isAnonymousPost,
    changeAnonymousPostStatus,

    setOpenCreatePollDialog,
    pollOptions,
    addPollOption,
    removePollOption,
    updatePollOption,
    changePollText,
    pollText,
    updatePollExpirationDate,
    pollExpirationDate,
    advancedOptions,
    validatePoll,
    previewPoll,
    setPreviewPoll,
    updateAdvancedOptions,
    pollExpiryTimeClickFunction,
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
    <>
      {previewPoll ? <div
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
                onClick={() => { setPreviewPoll(false) }}
              >
                <img src={editIcon} alt="remove" />
              </span>
              <span
                className="poll-preview-header-icon lm-cursor-pointer"
                onClick={() => {
                  if (setOpenCreatePollDialog) {
                    setOpenCreatePollDialog(false);
                  }
                  if (setOpenCreatePostDialog) {
                    setOpenCreatePostDialog(true);
                  }
                }}
              >
                <img src={removePollOptionIcon} alt="remove" />
              </span>
            </div>
          </div>
          {
            advancedOptions.MULTIPLE_SELECTION_NO > 1 &&
            <div className="poll-preview-advance-options poll-preview-subheading-style">
              *Select {advancedOptions.MULTIPLE_SELECTION_STATE} {advancedOptions.MULTIPLE_SELECTION_NO} options.
            </div>
          }
          <div>
            {pollOptions.map((pollOption, index) => {
              return (
                <div className="poll-option-wrapper" key={index}>
                  <div
                    className="poll-option-text-input poll-option-text-input-preview"
                  >{pollOption.text}</div>
                </div>
              );
            })}
          </div>
          <div className="poll-preview-subheading-style">
            Expires on {pollExpirationDate && formatDate(pollExpirationDate)}
          </div>
        </div>

        <LMFeedCreatePostSubmitButton />
      </div> : <div
        className="lm-feed-create-post-wrapper"
        onClick={() => { }}
      >
        <div className="lm-feed-create-post-wrapper__dialog-heading">
          {`Create ${changePollCase(WordAction.FIRST_LETTER_CAPITAL_SINGULAR)}`}
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

        <div className="lm-poll-creation-body">
          <textarea
            name="poll-creation-textarea"
            id="poll-creation-textarea"
            className="poll-creation-textarea poll-question-custom-style"
            value={pollText}
            onChange={changePollText}
            placeholder="Ask a question*"
          ></textarea>
          <div className="poll-options-container">
            <p className="poll-options-head-text">POLL OPTIONS *</p>
            {pollOptions.map((pollOption, index) => {
              return (
                <div className="poll-option-wrapper" key={index}>
                  <input
                    type="text"
                    value={pollOption.text}
                    onChange={(e) => updatePollOption(e.target.value, index)}
                    placeholder={`Option`}
                    className="poll-option-text-input poll-options-custom-style"
                  />
                  {
                    pollOptions.length > 2 ? <span
                      className="poll-option-remove lm-cursor-pointer"
                      onClick={() => {
                        removePollOption(index);
                      }}
                    >
                      <img src={removePollOptionIcon} alt="remove" />
                    </span> : null
                  }
                </div>
              );
            })}
            <div className="poll-option-add-more" onClick={() => {
              addPollOption();
            }}>
              <div className="poll-option-add-more-icon">
                <img src={pollOptionAddMoreIcon} alt="addMore" />
                <span className="add-more-text">Add an option</span>
              </div>
            </div>
            <p className="poll-expires-heading">POLL EXPIRES ON*</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider
                theme={createTheme({
                  palette: {
                    primary: {
                      main: '#5046e5',
                    },
                  },
                  components: {
                    MuiSvgIcon: {
                      styleOverrides: {
                        root: {
                          color: '#5046e5',
                        },
                      },
                    },
                    MuiOutlinedInput: {
                      styleOverrides: {
                        root: {
                          color: '#484f67',
                          '& .MuiInputBase-input': {
                            color: '#484f67',
                          },
                        },
                      },
                    },
                  },
                })}
              >
                <DateTimePicker
                  onOpen={() => {
                    pollExpiryTimeClickFunction();
                  }}
                  className="poll-expiry-field poll-expiry-time-custom-style"
                  disablePast
                  value={pollExpirationDate ? dayjs(pollExpirationDate) : null}
                  onChange={(day) => {
                    if (day) {
                      updatePollExpirationDate(day?.toDate()?.getTime());
                    }
                  }}
                />
              </ThemeProvider>
            </LocalizationProvider>
            <Collapse in={isAdvancedOpen}>
              <div className="poll-advanced-options-container">
                {/* Option for Allowing voters to add options */}
                <div className="poll-advanced-switch-option">
                  <span className="poll-advanced-option-text">
                    Allow voters to add options{" "}
                  </span>
                  <ThemeProvider theme={switchButtonTheme}>
                    <Switch
                      className="poll-advace-option-switch-custom-style"
                      name={"ALLOW_VOTERS_TO_ADD_OPTIONS"}
                      checked={advancedOptions.ALLOW_VOTERS_TO_ADD_OPTIONS}
                      onChange={updateAdvancedOptions}
                    />
                  </ThemeProvider>

                </div>
                {/* Option for Allowing Anonymous Poll */}
                <div className="poll-advanced-switch-option">
                  <span className="poll-advanced-option-text">
                    Anonymous poll{" "}
                  </span>
                  <ThemeProvider theme={switchButtonTheme}>
                    <Switch
                      className="poll-advace-option-switch-custom-style"
                      name={"ALLOW_ANONYMOUS_VOTING"}
                      checked={advancedOptions.ALLOW_ANONYMOUS_VOTING}
                      onChange={updateAdvancedOptions}
                    />
                  </ThemeProvider>

                </div>
                {/* Option for not showing live reults */}
                <div className="poll-advanced-switch-option">
                  <span className="poll-advanced-option-text">
                    Don't show live results{" "}
                  </span>
                  <ThemeProvider theme={switchButtonTheme}>
                    <Switch
                      className="poll-advace-option-switch-custom-style"
                      name={"DONT_SHOW_LIVE_RESULTS"}
                      checked={advancedOptions.DONT_SHOW_LIVE_RESULTS}
                      onChange={updateAdvancedOptions}
                    />
                  </ThemeProvider>

                </div>
                <div className="poll-advanced-select-option">
                  <div className="poll-advanced-select-option-label">
                    <InputLabel id="poll-advanced-option-select-multiple-select-state">
                      User can vote for
                    </InputLabel>
                  </div>
                  <div className="poll-advanced-select-option-position">
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        labelId="poll-advanced-option-select-multiple-select-state"
                        id="poll-advanced-option-select-multiple-select-state"
                        value={advancedOptions.MULTIPLE_SELECTION_STATE}
                        onChange={updateAdvancedOptions}
                        name="MULTIPLE_SELECTION_STATE"
                        className="custom-select-text poll-dropdown-menu-custom-style"
                        MenuProps={{
                          MenuListProps: {
                            className: 'custom-select-text',
                          },
                        }}
                      >
                        <MenuItem className="custom-select-text" value={0}>
                          Exactly
                        </MenuItem>
                        <MenuItem className="custom-select-text" value={1}>
                          At max
                        </MenuItem>
                        <MenuItem className="custom-select-text" value={2}>
                          At Least
                        </MenuItem>
                      </Select>
                    </FormControl>
                    {"="}
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        id="poll-advanced-option-select-multiple-select-no"
                        value={advancedOptions.MULTIPLE_SELECTION_NO}
                        onChange={updateAdvancedOptions}
                        defaultValue={1}
                        name="MULTIPLE_SELECTION_NO"
                        className="custom-select-text poll-dropdown-menu-custom-style"
                        MenuProps={{
                          MenuListProps: {
                            className: 'custom-select-text',
                          },
                        }}
                      >
                        {pollOptions.map((option, index) => (
                          <MenuItem className="custom-select-text" key={index + option.text} value={index + 1}>
                            {`${index + 1} ` + ((index == 0) ? `option` : `options`)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </Collapse>
            <div
              className="poll-advanced-option-toggle"
              onClick={toggleAdvancedOptions}
            >
              <div className="poll-advanced-option-parent poll-advance-options-text-custom-style">
                ADVANCED{" "}
                <img src={downArrow} alt="down-arrow" />
              </div>
            </div>
          </div>
        </div>

        <div className="poll-create-button-parent">
          <IconButton
            className={validatePoll ? `poll-create-button` : `poll-create-button-disabled`}
            onClick={validatePoll ? () => {
              setPreviewPoll(true);
            } : () => { }}
          >
            <img src={createPollTick} alt="Create Poll" />
          </IconButton>
        </div>

      </div>}
    </>
  );
};


export default LMFeedCreatePollDialog;
