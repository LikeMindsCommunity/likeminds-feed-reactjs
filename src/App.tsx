import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Error from "./shared/components/Error";
// import Feed from "./components/Feed";
import "./App.css";
import LMFeed from "./components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFlatFeed from "./components/LMFlatFeed";

// Routing
const appRoute = createBrowserRouter([
  {
    path: "/",
    element: <LMAppLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/feed" />,
      },
      {
        path: "/feed",
        element: (
          <LMFeed
            client={LMFeedClient.Builder()
              .setApiKey("6b11d5f6-19fc-48aa-9140-0f59c88b0d0a")
              .setPlatformCode("rt")
              .setVersionCode(2)
              .build()}
          >
            <LMFlatFeed />
          </LMFeed>
        ),
      },
    ],
    errorElement: <Error />,
  },
]);

function LMAppLayout() {
  return <Outlet />;
}

export { appRoute };
export default LMAppLayout;
