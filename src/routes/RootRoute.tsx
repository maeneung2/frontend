import { useRoutes } from "react-router-dom";
import IndexRoute from "./IndexRoute.tsx";
import LoginRoute from "./LoginRoute.tsx";
import GroupRouter from "./GroupRouter.tsx";

const RootRoute = () => {
  return useRoutes([IndexRoute, LoginRoute, GroupRouter]);
};

export default RootRoute;
