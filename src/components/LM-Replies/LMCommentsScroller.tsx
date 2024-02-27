import { useContext } from "react";
import { FeedPostContext } from "../../contexts/FeedPostContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Reply } from "../../types/models/replies";
import { ReplyContext } from "../../contexts/ReplyContext";
import LMReply from "./LMReply";

const LMCommentsScroller = () => {
  const {
    replies = [],
    loadNextPage = false,
    getNextPage = () => {},
    users,
  } = useContext(FeedPostContext);
  const renderComments = () => {
    console.log(replies);
    return replies.map((reply: Reply) => {
      return (
        <ReplyContext.Provider
          value={{
            user: users![reply.uuid],
            reply: reply,
          }}
        >
          <LMReply />
        </ReplyContext.Provider>
      );
    });
  };
  return (
    <div>
      <InfiniteScroll
        dataLength={replies?.length}
        hasMore={loadNextPage}
        loader={null}
        next={getNextPage}
      >
        {renderComments()}
      </InfiniteScroll>
    </div>
  );
};

export default LMCommentsScroller;
