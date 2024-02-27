import { useParams } from "react-router-dom";
import { useFeedDetails } from "../hooks/useFeedDetails";
import Posts from "./Posts";
import { FeedPostContext } from "../contexts/FeedPostContext";

const LMFeedDetails = () => {
  const { id = "" } = useParams();
  const { post, users, topics, replies, getNextPage, loadNextPage } =
    useFeedDetails(id);
  if (!post || !users) {
    return null;
  }
  return (
    <div>
      <FeedPostContext.Provider
        value={{ post, users, topics, replies, getNextPage, loadNextPage }}
      >
        <Posts
          post={post!}
          user={(function () {
            const postUuid = post!.uuid;
            const usersArray = Object.values(users);
            const filteredUser = usersArray.find(
              (user) => user.uuid === postUuid,
            );
            return filteredUser;
          })()}
        />
      </FeedPostContext.Provider>
    </div>
  );
};

export default LMFeedDetails;
