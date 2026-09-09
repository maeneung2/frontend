import { ChakraProvider, Theme } from "@chakra-ui/react";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { system, antdLightTheme, antdDarkTheme } from "../theme/theme.ts";
import { useThemeStore } from "../store/themeStore.ts";
import Layout from "./Layout.tsx";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const preference = useThemeStore((s) => s.preference);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isDark = preference === "dark" || (preference === "system" && systemDark);
  const colorMode = isDark ? "dark" : "light";

  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider layer>
        <ConfigProvider theme={isDark ? antdDarkTheme : antdLightTheme}>
          <ChakraProvider value={system}>
            <Theme appearance={colorMode}>
              <Layout>{children}</Layout>
            </Theme>
          </ChakraProvider>
        </ConfigProvider>
      </StyleProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Provider;
