import { useRoutes } from "react-router-dom";
import IndexRoute from "./IndexRoute.tsx";
import LoginRoute from "./LoginRoute.tsx";

const RootRoute = () => {
  return useRoutes([IndexRoute, LoginRoute]);
};

export default RootRoute;
