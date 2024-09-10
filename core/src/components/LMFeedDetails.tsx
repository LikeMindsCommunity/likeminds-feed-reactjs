import { useFeedDetails } from "../hooks/useLMFeedDetails";
import Posts from "./LMFeedPosts";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import lmBack from "../assets/images/lm-back.svg";
import LMFeedCreatePost from "./LMFeedCreatePost";
import { useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

interface LMFeedDetailsProps {
  postId: string;
}

const LMFeedDetails = ({ postId }: LMFeedDetailsProps) => {
  const { CustomComponents = {} } = useContext(CustomAgentProviderContext);
  const { CustomPostView } = CustomComponents;
  const {
    post,
    users,
    topics,
    replies,
    getNextPage,
    loadNextPage,
    addNewComment,
    removeAComment,
    updateReply,
    updateReplyOnPostReply,
    likeReply,
    likePost,
    pinPost,
    deletePost,

    postComponentClickCustomCallback,
    widgets,
  } = useFeedDetails(postId);

  return !post || !users ? null : (
    <div className="lm-feed-wrapper">
      <FeedPostContext.Provider
        value={{
          post,
          users,
          topics,
          replies,
          widgets,
          getNextPage,
          loadNextPage,
          addNewComment,
          removeAComment,
          updateReply,
          updateReplyOnPostReply,
          likeReply,
          likePost,
          pinPost,
          deletePost,

          postComponentClickCustomCallback,
        }}
      >
        <LMFeedCreatePost />
        <div className="lm-post-header">
          <img
            onClick={() => window.history.back()}
            // onClick={() => window.history.back()}
            src={lmBack}
            alt="Back Icon"
            className="lm-cursor-pointer"
          />
          <span>Back to feed</span>
        </div>

        {CustomPostView || (
          <Posts
            post={post}
            user={Object.values(users).find((user) => user.uuid === post.uuid)}
          />
        )}
      </FeedPostContext.Provider>
    </div>
  );
};

export default LMFeedDetails;
