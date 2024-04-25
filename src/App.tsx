// App.tsx
import { Flex } from '@chakra-ui/react';
import { FreeMint } from './components/FreeMint/FreeMint';

function App() {
  return (
    <Flex 
      flex={1} 
      w="100%" 
      //bgColor={}
      //bgImage={}
      //bgPosition={}
      // add background image here
      >
      <Flex w={"100%"} flexDir={"row"} justifyContent={"center"} alignItems={"center"}>
        <FreeMint />
      </Flex>
    </Flex>
  );
}

export default App;
