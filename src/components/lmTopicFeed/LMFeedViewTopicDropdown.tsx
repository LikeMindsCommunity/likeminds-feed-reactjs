import React, { useMemo, useState } from "react";
import { TopicsDropdownMode } from "../../shared/enums/lmTopicFeedDropdownMode";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTopicDropdown } from "../../hooks/useLMTopicDropdown";
import LMFeedTopicSelectionTile from "./LMFeedTopicSelectionTile";
import { Topic } from "../../shared/types/models/topic";
import { LMFeedTopicSelectedBlock } from "./LMFeedTopicSelectedBlock";
import { ALL_TOPICS } from "../../shared/constants/lmAppConstant";
import downArrowIcon from "../../assets/images/lm-down-arrow.svg";
import topicSearchIcon from "../../assets/images/topic-search-icon.svg";
import { Checkbox } from "@mui/material";

interface LMFeedTopicDropdownProps {
  // view for topic view && modify for creating or editing post
  mode: TopicsDropdownMode;
  selectedTopicIds?: string[];
  setSelectedTopicsIds?: React.Dispatch<string[]>;
  preSelectedTopics?: Topic[];
  setPreSelectedTopics?: React.Dispatch<Topic[]>;
}

const LMFeedViewTopicDropdown: React.FC<LMFeedTopicDropdownProps> = ({
  mode,
  setSelectedTopicsIds,
  selectedTopicIds,
  preSelectedTopics,
  setPreSelectedTopics,
}) => {
  // using the useTopicHook to get all the required data.
  const {
    checkedTopics,
    topics,
    loadNewTopics,
    getNextPage,
    searchKey,
    setSearchKey,
    updateCheckedTopics,
    clearAllCheckedTopics,
  } = useTopicDropdown(
    selectedTopicIds,
    setSelectedTopicsIds,
    preSelectedTopics,
    setPreSelectedTopics,
  );

  // state to handle the view || setting it to true will render a view for selection topics.
  const [isTopicSelectionMode, setIsTopicSelectionMode] = useState<boolean>(
    preSelectedTopics?.length ? false : true,
  );

  // state to hold the anchor element for the topicMenuBox
  const [topicMenuAnchor, setTopicMenuAnchor] = useState<HTMLElement | null>(
    null,
  );

  // function to open topicMenuSelection box
  const openTopicMenu = (e: React.MouseEvent<HTMLElement>) => {
    setTopicMenuAnchor(e.currentTarget);
  };

  // function to close topicMenuSelection box
  const closeTopicMenu = () => {
    if (checkedTopics.length) {
      setIsTopicSelectionMode(false);
    }
    setSelectedTopicsIds
      ? setSelectedTopicsIds(checkedTopics.map((topic) => topic.Id))
      : null;
    setTopicMenuAnchor(null);
  };

  // UI for searchBox
  const searchBox = (
    <div className="lm-topic-dropdown__search">
      <img src={topicSearchIcon} alt="Topic search" />
      <input
        className="lm-topic-search-box"
        placeholder="Search"
        value={searchKey}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
      />
    </div>
  );

  // UI of List of LMTopicSelectionTiles
  const menuList = useMemo(() => {
    return topics.map((topic: Topic) => {
      return (
        <MenuItem
          disableRipple={true}
          value={topic.Id}
          role="option"
          key={topic.Id}
        >
          <LMFeedTopicSelectionTile
            clickHandler={updateCheckedTopics}
            topic={topic}
            checkedList={checkedTopics}
          />
        </MenuItem>
      );
    });
  }, [checkedTopics, topics, updateCheckedTopics]);

  const setView = () => {
    switch (mode) {
      case TopicsDropdownMode.modify:
        return setTopicsForPostView();
      case TopicsDropdownMode.view:
        return handleFilterView();
    }
  };

  // Function to handle the filter section view
  const handleFilterView = () => {
    switch (isTopicSelectionMode) {
      case true: {
        return (
          <div className="lm-topic-btn-box">
            <button onClick={openTopicMenu} className="lm-all-topic-button">
              <span>{ALL_TOPICS}</span>
              <img src={downArrowIcon} alt="down arrow icon" loading="lazy" />
            </button>

            <Menu
              anchorEl={topicMenuAnchor}
              open={Boolean(topicMenuAnchor)}
              onClose={closeTopicMenu}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
              slotProps={{
                paper: {
                  id: "scrollerTopics",
                  sx: {
                    height: "300px",
                    borderRadius: "8px",
                    overflow: "auto",
                  },
                },
              }}
            >
              <InfiniteScroll
                next={getNextPage}
                hasMore={loadNewTopics}
                loader={null}
                dataLength={topics.length}
                scrollableTarget={"scrollerTopics"}
              >
                {/* Search */}
                {searchBox}
                {/* Search */}
                <MenuItem
                  disableRipple={true}
                  role="option"
                  key={Math.random()}
                >
                  {/* <LMFeedTopicSelectionTile
                    clickHandler={updateCheckedTopics}
                    topic={{
                      Id: Math.random().toString(),
                      name: "All Topics",
                      isEnabled: true,
                    }}
                    checkedList={checkedTopics}
                  /> */}
                  <div
                    className="lm-topic-dropdown__topic"
                    onClick={clearAllCheckedTopics}
                  >
                    <Checkbox
                      disableRipple={true}
                      checked={!checkedTopics.length}
                      className="lm-topic-checkbox"
                    />
                    <span className="lm-topic-name-container">
                      {"All Topics"}
                    </span>
                  </div>
                </MenuItem>

                {menuList}
              </InfiniteScroll>
            </Menu>
          </div>
        );
      }
      case false: {
        return (
          <div className="lmSelectedTopics">
            <div className="lmSelectedTopics__tags">
              {checkedTopics.map((topic: Topic) => {
                return (
                  <LMFeedTopicSelectedBlock
                    onDeleteClick={() => {
                      updateCheckedTopics(topic);
                      if (checkedTopics.length === 1) {
                        setIsTopicSelectionMode(true);
                      }
                    }}
                    key={topic.Id}
                    topic={topic}
                  />
                );
              })}
            </div>
            <div
              className="lmSelectedTopics--clear"
              onClick={() => {
                clearAllCheckedTopics();
                setIsTopicSelectionMode(true);
              }}
            >
              Clear
            </div>
          </div>
        );
      }
    }
  };

  const setTopicsForPostView = function () {
    switch (isTopicSelectionMode) {
      case true: {
        return (
          <div>
            <button
              onClick={openTopicMenu}
              className="lm-post-creation-all-topic-button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C2 8.16537 2.05939 8.30749 2.17818 8.42636C2.29697 8.54005 2.43641 8.5969 2.59651 8.5969H7.40736V13.4109C7.40736 13.5711 7.46417 13.708 7.57779 13.8217C7.69658 13.9406 7.83861 14 8.00387 14C8.16398 14 8.30084 13.9406 8.41446 13.8217C8.52808 13.708 8.58489 13.5711 8.58489 13.4109V8.5969H13.4112C13.5713 8.5969 13.7082 8.54005 13.8218 8.42636C13.9406 8.30749 14 8.16537 14 8C14 7.83979 13.9406 7.70284 13.8218 7.58915C13.7082 7.47028 13.5713 7.41085 13.4112 7.41085H8.58489V2.58915C8.58489 2.43411 8.52808 2.29716 8.41446 2.17829C8.30084 2.05943 8.16398 2 8.00387 2C7.83861 2 7.69658 2.05943 7.57779 2.17829C7.46417 2.29716 7.40736 2.43411 7.40736 2.58915V7.41085H2.59651C2.43641 7.41085 2.29697 7.47028 2.17818 7.58915C2.05939 7.70284 2 7.83979 2 8Z"
                  fill="#5046E5"
                />
              </svg>
              Select Topics{" "}
            </button>
            <Menu
              anchorEl={topicMenuAnchor}
              open={Boolean(topicMenuAnchor)}
              onClose={closeTopicMenu}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
              slotProps={{
                paper: {
                  sx: {
                    height: "284px",
                    marginTop: "6px",
                    borderRadius: "8px",
                    paddingTop: "0px",
                  },
                  id: "scrollerTopics",
                },
              }}
            >
              <InfiniteScroll
                next={getNextPage}
                hasMore={loadNewTopics}
                loader={null}
                dataLength={topics.length}
                scrollableTarget={"scrollerTopics"}
              >
                {searchBox}
                {/* {menuListOfSelectedTopics} */}
                {menuList}
              </InfiniteScroll>
            </Menu>
          </div>
        );
      }
      case false: {
        return (
          <div className="lm-display-selected-topics-container">
            <Menu
              anchorEl={topicMenuAnchor}
              open={Boolean(topicMenuAnchor)}
              onClose={closeTopicMenu}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
              slotProps={{
                paper: {
                  sx: {
                    height: "284px",
                    marginTop: "6px",
                    borderRadius: "8px",
                    paddingTop: "0px",
                  },
                  id: "scrollerTopics",
                },
              }}
            >
              <InfiniteScroll
                next={getNextPage}
                hasMore={loadNewTopics}
                loader={null}
                dataLength={topics.length}
                scrollableTarget={"scrollerTopics"}
              >
                {searchBox}
                {menuList}
              </InfiniteScroll>
            </Menu>
            <div className="lm-topic-tags-container">
              {checkedTopics.map((topic) => {
                return (
                  <LMFeedTopicSelectedBlock
                    isCreateMode={true}
                    onDeleteClick={updateCheckedTopics}
                    key={topic.Id}
                    topic={topic}
                  />
                );
              })}
              <div className="lm-edit-topics-icon" onClick={openTopicMenu}>
                {" "}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.754 5.41104L14.6656 4.31708C14.245 3.89431 13.5619 3.89431 13.1399 4.31708L12.0973 5.36498L14.5379 7.81801L15.754 6.59569C16.0803 6.26776 16.0803 5.73894 15.754 5.41104ZM11.4615 6.00267L13.9021 8.45567L7.72422 14.665L5.285 12.212L11.4615 6.00267ZM4.34375 15.9919C4.14383 16.0408 3.96335 15.8608 4.00777 15.6599L4.62417 12.8762L7.06339 15.3292L4.34375 15.9919Z"
                    fill="#5046E5"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      }
    }
  };
  return setView();
};

export default LMFeedViewTopicDropdown;
