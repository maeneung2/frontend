import { ChakraProvider, Theme } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import { system } from "../theme/theme.ts";
import Layout from "./Layout.tsx";

const Provider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [dark] = useState(false);

  return (
    <ChakraProvider value={system}>
      <Theme appearance={dark ? "dark" : "light"}>
        <Layout>{children}</Layout>
      </Theme>
    </ChakraProvider>
  );
};

export default Provider;
