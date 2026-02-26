import { ChakraProvider, Center, Theme } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { system } from "../theme/theme.ts";

const Provider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  // const [dark, setDark] = useState(false);

  return (
    <ChakraProvider value={system}>
      <Theme appearance={"light"}>
        <Center flexDirection={"column"} h={"100vh"}>
          {/*<Navigation />*/}
          {children}
        </Center>
      </Theme>
    </ChakraProvider>
  );
};

export default Provider;
