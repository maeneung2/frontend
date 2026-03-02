import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/login/loginPage.tsx";
import FindPasswordPage from "../pages/login/findPasswordPage.tsx";
import FindIdPage from "../pages/login/findIdPage.tsx";
import SignupPage from "../pages/login/signup/signupPage.tsx";

const IndexRoute: RouteObject = {
  path: "/login",
  children: [
    {
      index: true,
      element: <LoginPage />,
    },
    {
      path: "/login/find-password",
      element: <FindPasswordPage />,
    },
    {
      path: "/login/find-id",
      element: <FindIdPage />,
    },
    {
      path: "/login/sign-up",
      element: <SignupPage />,
    },
  ],
};

export default IndexRoute;
