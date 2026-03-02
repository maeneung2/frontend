import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <Flex color={"frame"} flexDir={"column"}>
      test
      <Flex h={"1000px"}></Flex>
      test
    </Flex>
  );
}

export default App;
