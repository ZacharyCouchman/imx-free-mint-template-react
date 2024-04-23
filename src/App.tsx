// App.tsx
import { Flex, theme } from '@chakra-ui/react';

function App() {
  return (
    <Flex 
      flex={1} 
      w="100%" 
      bg={theme.colors.blackAlpha[100]}
      bgPosition={"center"}
      >
      {/* add background image here ^^ */}
      <Flex w={"100%"} flexDir={"row"} justifyContent={"center"} alignItems={"center"}>
      </Flex>
    </Flex>
  );
}

export default App;
