import { useParams, Link } from "react-router-dom";
import { useFeedDetails } from "../hooks/useFeedDetails";
import Posts from "./Posts";
import { FeedPostContext } from "../contexts/FeedPostContext";
import { ROUTES } from "../shared/constants/routes.constant";
import lmBack from "../assets/images/lm-back.svg";

const LMFeedDetails = () => {
  const { id = "" } = useParams();
  const { post, users, topics, replies, getNextPage, loadNextPage } =
    useFeedDetails(id);

  return !post || !users ? null : (
    <div>
      <FeedPostContext.Provider
        value={{ post, users, topics, replies, getNextPage, loadNextPage }}
      >
        <Link to={`${ROUTES.ROOT_PATH}`}>
          <div className="lm-post-header">
            <img src={lmBack} alt="Back Icon" />
            <span>Back to feed</span>
          </div>
        </Link>
        <Posts
          post={post}
          user={Object.values(users).find((user) => user.uuid === post.uuid)}
        />
      </FeedPostContext.Provider>
    </div>
  );
};

export default LMFeedDetails;
