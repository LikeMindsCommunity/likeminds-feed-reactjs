import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Error from "./shared/components/Error";
import Feed from "./components/Feed";
import "./App.css";

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
        element: <Feed />,
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
