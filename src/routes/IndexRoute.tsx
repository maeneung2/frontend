import type { RouteObject } from "react-router-dom";
import IndexPage from "../pages/mainPage.tsx";
import MypagePage from "../pages/mypage/mypagePage.tsx";
import AlarmPage from "../pages/mypage/alarmPage.tsx";
import MypageEditPage from "../pages/mypage/mypageEditPage.tsx";
import SplashPage from "../pages/splashPage.tsx";
import PrivateRoute from "../components/PrivateRoute.tsx";

const IndexRoute: RouteObject = {
  path: "",
  children: [
    {
      path: "/splash",
      element: <SplashPage />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          index: true,
          element: <IndexPage />,
        },
        {
          path: "/mypage",
          element: <MypagePage />,
        },
        {
          path: "/mypage/edit",
          element: <MypageEditPage />,
        },
        {
          path: "/alarm",
          element: <AlarmPage />,
        },
      ],
    },
  ],
};

export default IndexRoute;