import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/login.tsx";

const IndexRoute: RouteObject = {
  path: "/login",
  children: [
    {
      index: true,
      element: <LoginPage />,
    },
  ],
};

export default IndexRoute;
