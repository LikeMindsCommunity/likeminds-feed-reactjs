import { Navigate, createBrowserRouter } from "react-router-dom";
import LMAppLayout from "../App";
import Feed from "../components/Feed";
import Error from "./components/Error";

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
        element: <Feed />,
      },
    ],
    errorElement: <Error />,
  },
]);

export default LMAppRoute;
