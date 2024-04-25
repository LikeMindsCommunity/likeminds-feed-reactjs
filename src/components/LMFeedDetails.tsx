import { useParams } from "react-router-dom";
import { useFeedDetails } from "../hooks/useLMFeedDetails";
import Posts from "./LMFeedPosts";
import { FeedPostContext } from "../contexts/LMFeedPostContext";
import { Helmet } from "react-helmet-async";
import lmBack from "../assets/images/lm-back.svg";
import LMFeedCreatePost from "./LMFeedCreatePost";
import { useContext } from "react";
import { CustomAgentProviderContext } from "../contexts/LMFeedCustomAgentProviderContext";

const LMFeedDetails = () => {
  const { id = "" } = useParams();
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
    clickNavigator,
    postComponentClickCustomCallback,
  } = useFeedDetails(id.split("-")[0]);

  return !post || !users ? null : (
    <div className="lm-feed-wrapper">
      <Helmet>
        <title>{post.heading}</title>
        <meta name="description" content={post?.text} />
      </Helmet>
      <FeedPostContext.Provider
        value={{
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
          clickNavigator,
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
