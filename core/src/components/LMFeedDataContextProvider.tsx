import React, { useContext } from "react";
import { useFetchFeeds } from "../hooks/useLMFetchFeeds";
import { LMFeedDataContext } from "../contexts/LMFeedDataContext";
import { GeneralContext } from "../contexts/LMFeedGeneralContext";
import { Route, Routes } from "react-router-dom";
import LMFeedUniversalFeed from "./LMFeedUniversalFeed";
import { ROUTES } from "../shared/constants/lmRoutesConstant";
import { HelmetProvider } from "react-helmet-async";
import LMFeedDetails from "./LMFeedDetails";

const LMFeedListDataContextProvider = () => {
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
    clickNavigator,
    widgets,
  } = useFetchFeeds();
  const { routes } = useContext(GeneralContext);
  function renderCustomRoutes() {
    if (!routes) {
      return null;
    }
    const routeKeys = Object.keys(routes);
    return routeKeys.map((routeKey) => {
      const { pathname, params, element } = routes[routeKey];
      const route = pathname.concat(
        params.reduce((accumulatedRoute, currentParam) =>
          accumulatedRoute.concat(`/:${currentParam}`),
        ),
      );
      return <Route key={route} path={route} element={element} />;
    });
  }
  return (
    <LMFeedDataContext.Provider
      value={{
        topics,
        widgets,
        selectedTopics,
        setSelectedTopics,
        loadMoreFeeds,
        clickNavigator,
        feedList,
        feedUsersList,
        getNextPage,
        deletePost,
        pinPost,
        likePost,
        postComponentClickCustomCallback,
      }}
    >
      {routes ? (
        <>
          <Routes>{renderCustomRoutes()}</Routes>
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
        </Routes>
      )}
    </LMFeedDataContext.Provider>
  );
};

export default LMFeedListDataContextProvider;
