import React, { useMemo, useState } from "react";
import { TopicsDropdownMode } from "../../enums/topicFeedDropdownMode";
import { Menu, MenuItem } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTopicDropdown } from "../../hooks/useTopicDropdown";
import { LMTopicSelectionTile } from "./LMTopicSelectionTile";
import { Topic } from "../../types/models/topic";
import { LMTopicSelectedBlock } from "./LMTopicSelectedBlock";

interface LMTopicDropdownProps {
  // view for topic view && modify for creating or editing post
  mode: TopicsDropdownMode;
}

const LMFeedViewTopicDropdown: React.FC<LMTopicDropdownProps> = ({ mode }) => {
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
  } = useTopicDropdown();

  // state to handle the view || setting it to true will render a view for selection topics.
  const [isTopicSelectionMode, setIsTopicSelectionMode] =
    useState<boolean>(true);

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
    setTopicMenuAnchor(null);
  };

  // UI for searchBox
  const searchBox = (
    <div className="topicSearchBoxContainer">
      <svg
        className="searchIcon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.3833 12.8767C7.76953 12.8767 9.04785 12.4285 10.0938 11.6814L14.0283 15.616C14.2109 15.7986 14.4517 15.8899 14.709 15.8899C15.2485 15.8899 15.6304 15.4749 15.6304 14.9436C15.6304 14.6946 15.5474 14.4539 15.3647 14.2795L11.4551 10.3616C12.2769 9.28247 12.7666 7.94604 12.7666 6.49341C12.7666 2.98218 9.89453 0.110107 6.3833 0.110107C2.88037 0.110107 0 2.97388 0 6.49341C0 10.0046 2.87207 12.8767 6.3833 12.8767ZM6.3833 11.4988C3.64404 11.4988 1.37793 9.23267 1.37793 6.49341C1.37793 3.75415 3.64404 1.48804 6.3833 1.48804C9.12256 1.48804 11.3887 3.75415 11.3887 6.49341C11.3887 9.23267 9.12256 11.4988 6.3833 11.4988Z"
          fill="#3C3C43"
          fillOpacity="0.6"
        />
      </svg>
      <input
        className="topicSearchBox"
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
          value={topic._id}
          role="option"
          key={topic._id}
          sx={{
            padding: "0px",
          }}
        >
          <LMTopicSelectionTile
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
        return null;
      case TopicsDropdownMode.view:
        return handleFilterView();
    }
  };

  const handleFilterView = function () {
    switch (isTopicSelectionMode) {
      case true: {
        return (
          <div>
            <button onClick={openTopicMenu} className="allTopicButton">
              All Topics{" "}
              <svg
                style={{
                  marginLeft: "2px",
                }}
                width="12"
                height="16"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.52567 15.7821L11.287 11.0208C11.5775 10.7303 11.5775 10.2591 11.287 9.96863C10.9964 9.67807 10.5254 9.67807 10.2349 9.96863L6.74356 13.4599L6.74356 0.743959C6.74356 0.333115 6.41044 0 5.9996 0C5.58882 0 5.25564 0.333115 5.25564 0.743959L5.25564 13.4599L1.76433 9.96875C1.47377 9.67819 1.00275 9.67819 0.712193 9.96875C0.567032 10.114 0.494303 10.3044 0.494303 10.4948C0.494303 10.6852 0.567032 10.8756 0.712193 11.0209L5.47353 15.7821C5.76409 16.0727 6.23511 16.0727 6.52567 15.7821Z"
                  fill="#666666"
                />
              </svg>
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
                    height: "341px",
                    paddingX: "24px",
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
                <MenuItem
                  disableRipple={true}
                  role="option"
                  key={Math.random()}
                  sx={{
                    padding: "0px",
                    borderBottom: "1px solid rgba(208, 216, 226, 0.40)",
                  }}
                >
                  <LMTopicSelectionTile
                    clickHandler={updateCheckedTopics}
                    topic={{
                      _id: Math.random().toString(),
                      name: "All Topics",
                      isEnabled: true,
                    }}
                    checkedList={checkedTopics}
                  />
                </MenuItem>

                {menuList}
              </InfiniteScroll>
            </Menu>
          </div>
        );
      }
      case false: {
        return (
          <div className="displaySelectedTopicsContainer">
            <div className="topicTagsContainer">
              {checkedTopics.map((topic: Topic) => {
                return (
                  <LMTopicSelectedBlock
                    onDeleteClick={updateCheckedTopics}
                    key={topic._id}
                    topic={topic}
                  />
                );
              })}
            </div>
            <div className="clearButton" onClick={clearAllCheckedTopics}>
              <span>Clear</span>
            </div>
          </div>
        );
      }
    }
  };
  return setView();
};

export default LMFeedViewTopicDropdown;
