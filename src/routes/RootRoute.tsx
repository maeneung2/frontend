import { useRoutes } from "react-router-dom";
import IndexRoute from "./IndexRoute.tsx";
import LoginRoute from "./LoginRoute.tsx";
import GroupRouter from "./GroupRouter.tsx";
import NotFoundPage from "../pages/notFoundPage.tsx";

const RootRoute = () => {
  return useRoutes([
    IndexRoute,
    LoginRoute,
    GroupRouter,
    { path: "*", element: <NotFoundPage /> },
  ]);
};

export default RootRoute;
