import { ChakraProvider, Theme } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { system } from "../theme/theme.ts";
import Layout from "./Layout.tsx";

const Provider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <ChakraProvider value={system}>
      <Theme appearance="light">
        <Layout>{children}</Layout>
      </Theme>
    </ChakraProvider>
  );
};

export default Provider;
