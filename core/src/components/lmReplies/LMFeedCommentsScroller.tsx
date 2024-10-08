import { useContext } from "react";
import { FeedPostContext } from "../../contexts/LMFeedPostContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Reply } from "../../shared/types/models/replies";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import LMFeedReply from "./LMFeedReply";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
import { LMFeedReplyMode } from "../../shared/constants/lmFeedReplyMode";

const LMFeedCommentsScroller = () => {
  const {
    replies = [],
    loadNextPage = false,
    getNextPage = () => {},
    users,
    likeReply,
    updateReply,
  } = useContext(FeedPostContext);
  const { CustomComponents } = useContext(CustomAgentProviderContext);

  const renderComments = () => {
    return replies.map((reply: Reply) => {
      return (
        <ReplyContext.Provider
          value={{
            user: users![reply.uuid],
            reply: reply,
            likeReply,
            updateReply,
          }}
          key={reply?.id}
        >
          {CustomComponents?.CustomReply || (
            <LMFeedReply mode={LMFeedReplyMode.COMMENT} />
          )}
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

export default LMFeedCommentsScroller;
