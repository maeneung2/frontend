import { Box, Center } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

/**
 * 콘텐츠 화면은 하나의 반응형 쉘을 공유한다. 넓은 스케줄 편집 작업공간은
 * 가로 정보량이 많으므로 모바일 폭으로 강제하지 않고 별도로 둔다.
 */
function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const isScheduleWorkspace = /^\/group\/[^/]+\/setting\/schedule\/(create|[^/]+(?:\/edit)?)$/.test(pathname);

  return (
    <Center w="100%" minH="100dvh" bg="frame" alignItems="stretch">
      <Box
        w="100%"
        maxW={isScheduleWorkspace ? "none" : { base: "100%", md: "760px", xl: "960px" }}
        minH="100dvh"
        bg="bgColor"
        borderWidth={{ base: 0, md: isScheduleWorkspace ? 0 : "1px" }}
        overflowY="auto"
        scrollbar="hidden"
      >
        {children}
      </Box>
    </Center>
  );
}

export default Layout;
