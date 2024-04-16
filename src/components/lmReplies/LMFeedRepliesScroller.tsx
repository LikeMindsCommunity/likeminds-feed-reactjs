import { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Reply } from "../../shared/types/models/replies";
import { ReplyContext } from "../../contexts/LMFeedReplyContext";
import LMFeedReply from "./LMFeedReply";
import { CustomAgentProviderContext } from "../../contexts/LMFeedCustomAgentProviderContext";
import { useReply } from "../../hooks/useLMReply";
import { LMFeedReplyMode } from "../../shared/constants/lmFeedReplyMode";
interface LMFeedRepliesScrollerProps {
  replyId: string;
  postId: string;
}
const LMFeedRepliesScroller = ({
  replyId,
  postId,
}: LMFeedRepliesScrollerProps) => {
  const {
    replies = [],
    loadMoreReplies = false,
    getNextPage = () => {},
    users,
  } = useReply(postId, replyId);
  const { CustomComponents } = useContext(CustomAgentProviderContext);
  const renderComments = () => {
    return replies.map((reply: Reply) => {
      return (
        <ReplyContext.Provider
          value={{
            user: users![reply.uuid],
            reply: reply,
          }}
          key={reply.Id}
        >
          {CustomComponents?.Reply || (
            <LMFeedReply mode={LMFeedReplyMode.REPLY} />
          )}
        </ReplyContext.Provider>
      );
    });
  };
  return (
    <div>
      <InfiniteScroll
        dataLength={replies?.length}
        hasMore={loadMoreReplies}
        loader={null}
        next={getNextPage}
      >
        {renderComments()}
      </InfiniteScroll>
    </div>
  );
};

export default LMFeedRepliesScroller;
