import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import { api } from "../../api/axios.ts";
import { useAuthStore } from "../../store/authStore.ts";

const SocialCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const setLogin = useAuthStore((s) => s.setLogin);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login", { replace: true });
      return;
    }

    api
      .get("/api/v1/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setLogin(accessToken, refreshToken, res.data);
        navigate("/", { replace: true });
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate, searchParams, setLogin]);

  return <Spin fullscreen />;
};

export default SocialCallbackPage;
