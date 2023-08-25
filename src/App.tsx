import { motion } from 'framer-motion';

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react';

//import socket from './socket.js';

// import { HMIConfig, ComponentConfig } from './components/base/Types';
// import Droppable from './components/base/Droppable';
// import DraggableItem from './components/base/DraggableItem';
// import DroppableCanvas from './components/base/DroppableCanvas';
import HMIPage from './components/base/HMIPage';
import { HMIProvider } from './components/base/HMIContext';

const textFontSizes = [16, 18, 24, 30];

function App(): JSX.Element {
  return (
    <HMIProvider>
      <HMIPage />
    </HMIProvider>

    /* <Box>
          <Flex
            as="header"
            direction="column"
            alignItems="center"
            justifyContent="center"
            h="100vh"
            fontSize="3xl"
          >
            <Text fontSize={textFontSizes}>
              Hello Vite + React + Typescript + Chakra UI!
            </Text>
            <Button
              colorScheme="blue"
              fontSize={textFontSizes}
              onClick={() => setCount((c) => c + 1)}
              marginTop="2"
            >
              count is: {count}
            </Button>
            <Text fontSize={textFontSizes}>
              Edit <code>App.tsx</code> and save to test HMR updates.
            </Text>
            <Text fontSize={textFontSizes}>
              <Link href="https://reactjs.org" isExternal color="#61dafb">
                Learn React
              </Link>
              {' | '}
              <Link
                href="https://vitejs.dev/guide/features.html"
                isExternal
                color="#61dafb"
              >
                Vite Docs
              </Link>
              {' | '}
              <Link
                href="https://www.typescriptlang.org/"
                isExternal
                color="#61dafb"
              >
                Typescript
              </Link>
              {' | '}
              <Link href="https://chakra-ui.com" isExternal color="#61dafb">
                Chakra UI
              </Link>
            </Text>
          </Flex>
          <ThemeToggleButton pos="fixed" bottom="2" right="2" />
        </Box> */
  );
}

export default App;
