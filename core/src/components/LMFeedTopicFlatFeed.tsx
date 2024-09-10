// /* eslint-disable @typescript-eslint/no-unused-vars */
// // Base component for setting Feed List.

// import { useCallback } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { FeedPostContext } from "../contexts/LMFeedPostContext";
// import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
// import { Post } from "../shared/types/models/post";
// import Posts from "./LMFeedPosts";
// import { useParams } from "react-router-dom";

// interface LMFeedUniversalFeedProps {
//   PostView?: React.FC;
//   Shimmer?: React.FC;
//   FooterView?: React.FC;
//   HeaderView?: React.FC;
//   likeActionCall?: () => void;
// }

// const LMFeedTopicFlatFeed = (props: LMFeedUniversalFeedProps) => {
//   const params = useParams();

//   const {
//     topics,
//     selectedTopics,
//     setSelectedTopics,
//     loadMoreFeeds,
//     feedList,
//     feedUsersList,
//     getNextPage,
//     widgets,
//   } = useFetchFeeds(params.topicId ? params.topicId : undefined);

//   const renderFeeds = useCallback(() => {
//     return feedList.map((post: Post) => {
//       const postUuid = post.uuid;
//       const usersArray = Object.values(feedUsersList);
//       const filteredUser = usersArray.find((user) => user.uuid === postUuid);

//       return (
//         <FeedPostContext.Provider
//           key={post.Id}
//           value={{
//             widgets: widgets,
//             post: post,
//             users: feedUsersList,
//             topics: topics,
//           }}
//         >
//           {/* <Link to={`${ROUTES.POST}/${post.Id}`}> */}
//           <Posts post={post} user={filteredUser} />
//           {/* </Link> */}
//         </FeedPostContext.Provider>
//       );
//     });
//   }, [feedList, feedUsersList, topics, widgets]);

//   return (
//     <div className="lm-feed-wrapper lm-d-flex">
//       <div>
//         {/* Topics */}
//         {/* <div className="lm-mb-4">
//           <LMFeedViewTopicDropdown
//             mode={TopicsDropdownMode.view}
//             selectedTopic={selectedTopics}
//             setSelectedTopics={setSelectedTopics}
//           />
//         </div> */}
//         {/* Commented for the topic feed view page */}
//         {/* Topics */}

//         {/* Posts */}
//         <InfiniteScroll
//           dataLength={feedList.length}
//           hasMore={loadMoreFeeds}
//           next={getNextPage}
//           // TODO set shimmer on loader component
//           loader={null}
//         >
//           {renderFeeds()}
//         </InfiniteScroll>
//         {/* Posts */}
//       </div>
//     </div>
//   );
// };

// export default LMFeedTopicFlatFeed;
