import React, { useContext } from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LMFeedUniversalFeed from "./LMFeedUniversalFeed";
import { ROUTES } from "../shared/constants/lmRoutesConstant";
import { HelmetProvider } from "react-helmet-async";
import LMFeedDetails from "./LMFeedDetails";
import LMFeedTopicFlatFeed from "./LMFeedTopicFlatFeed";

const LMFeedDataContextProvider = () => {
  const {
    topics,
    selectedTopics,
    setSelectedTopics,
    loadMoreFeeds,
    feedList,
    feedUsersList,
    getNextPage,
    deletePost,
    pinPost,
    likePost,
    postComponentClickCustomCallback,
  } = useFetchFeeds();
  const { useParentRouter, routes } = useContext(GeneralContext);
  return (
    <LMFeedDataContext.Provider
      value={{
        topics,
        selectedTopics,
        setSelectedTopics,
        loadMoreFeeds,
        feedList,
        feedUsersList,
        getNextPage,
        deletePost,
        pinPost,
        likePost,
        postComponentClickCustomCallback,
      }}
    >
      {useParentRouter ? (
        <>
          {routes ? (
            <>
              <Routes>
                {routes.map((routeObject) => (
                  <Route key={routeObject.route} path={routeObject.route} />
                ))}
              </Routes>
            </>
          ) : (
            <Routes>
              <Route
                path={ROUTES.ROOT_PATH}
                element={<LMFeedUniversalFeed />}
              ></Route>

              <Route
                path={ROUTES.POST_DETAIL}
                element={
                  <HelmetProvider>
                    <LMFeedDetails />
                  </HelmetProvider>
                }
              ></Route>
              <Route path={ROUTES.TOPIC} element={<LMFeedTopicFlatFeed />} />
            </Routes>
          )}
        </>
      ) : (
        <BrowserRouter>
          {routes ? (
            <>
              <Routes>
                {routes.map((routeObject) => (
                  <Route
                    path={routeObject.route}
                    element={routeObject.element}
                  />
                ))}
              </Routes>
            </>
          ) : (
            <Routes>
              <Route
                path={ROUTES.ROOT_PATH}
                element={<LMFeedUniversalFeed />}
              ></Route>

              <Route
                path={ROUTES.POST_DETAIL}
                element={
                  <HelmetProvider>
                    <LMFeedDetails />
                  </HelmetProvider>
                }
              ></Route>
              <Route path={ROUTES.TOPIC} element={<LMFeedTopicFlatFeed />} />
            </Routes>
          )}
        </BrowserRouter>
      )}
    </LMFeedDataContext.Provider>
  );
};

export default LMFeedDataContextProvider;
