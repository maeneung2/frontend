import { Box, Center } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <Center w={"100%"} bg={"frame"} h={"100vh"}>
      <Box
        w={["100%", "380px"]}
        bg={"bgColor"}
        h={["100%", "860px"]}
        border={"1px solid black"}
        overflowY={"scroll"}
        scrollbar={"hidden"}
      >
        {children}
      </Box>
    </Center>
  );
}

export default Layout;
