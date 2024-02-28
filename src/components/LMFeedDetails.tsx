import { useParams } from "react-router-dom";
import { useFeedDetails } from "../hooks/useFeedDetails";
import Posts from "./Posts";
import { FeedPostContext } from "../contexts/FeedPostContext";

const LMFeedDetails = () => {
  const { id = "" } = useParams();
  const { post, users, topics, replies, getNextPage, loadNextPage } =
    useFeedDetails(id);

  return !post || !users ? null : (
    <div>
      <FeedPostContext.Provider
        value={{ post, users, topics, replies, getNextPage, loadNextPage }}
      >
        <Posts
          post={post}
          user={Object.values(users).find((user) => user.uuid === post.uuid)}
        />
      </FeedPostContext.Provider>
    </div>
  );
};

export default LMFeedDetails;
