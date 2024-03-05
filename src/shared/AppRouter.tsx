import { Navigate, createBrowserRouter } from "react-router-dom";
import LMAppLayout from "../App";
import Error from "./components/LMError";
import LMFeed from "../components/LMFeed";
import LMFeedDetails from "../components/LMFeedDetails";
import { LMFeedClient } from "@likeminds.community/feed-js-beta";

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
              .setApiKey("69edd43f-4a5e-4077-9c50-2b7aa740acce")
              .setPlatformCode("rt")
              .setVersionCode(2)
              .build()}
          />
        ),
      },
      {
        path: "/post/:id",
        element: <LMFeedDetails />,
      },
    ],
    errorElement: <Error />,
  },
]);

export default LMAppRoute;
