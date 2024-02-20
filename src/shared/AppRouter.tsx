import { Navigate, createBrowserRouter } from "react-router-dom";
import LMAppLayout from "../App";
import Error from "./components/Error";
import LMFeed from "../components/LMFeed";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";
import LMFlatFeed from "../components/LMFlatFeed";

// Routing
const LMAppRoute = createBrowserRouter([
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

export default LMAppRoute;
