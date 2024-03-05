import { useParams } from "react-router-dom";
import { useFeedDetails } from "../hooks/useFeedDetails";
import Posts from "./Posts";
import { FeedPostContext } from "../contexts/FeedPostContext";
import { Helmet } from "react-helmet-async";
import lmBack from "../assets/images/lm-back.svg";

const LMFeedDetails = () => {
  const { id = "" } = useParams();

  const { post, users, topics, replies, getNextPage, loadNextPage } =
    useFeedDetails(id);

  return !post || !users ? null : (
    <div>
      <Helmet>
        <title>{post.text}</title>
      </Helmet>
      <FeedPostContext.Provider
        value={{ post, users, topics, replies, getNextPage, loadNextPage }}
      >
        <div className="lm-post-header">
          <img
            onClick={() => window.history.back()}
            src={lmBack}
            alt="Back Icon"
            className="lm-cursor-pointer"
          />
          <span>Back to feed</span>
        </div>

        <Posts
          post={post}
          user={Object.values(users).find((user) => user.uuid === post.uuid)}
        />
      </FeedPostContext.Provider>
    </div>
  );
};

export default LMFeedDetails;
