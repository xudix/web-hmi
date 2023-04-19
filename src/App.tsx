import { motion } from 'framer-motion';
import { useState } from 'react';

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import { DndContext } from '@dnd-kit/core';

import ThemeToggleButton from './components/ThemeToggleButton';
import logo from './logo.svg';

import Droppable from './components/Droppable';
import DraggableItem from './components/Draggable';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import Canvas from './components/Canvas';

const textFontSizes = [16, 18, 24, 30];

function App(): JSX.Element {
  const [userControls, setUserControls] = useState([
    {
      id: 1,
      x: 0,
      y: 0,
    },
    {
      id: 2,
      x: 50,
      y: 50,
    },
  ]);

  function handleDragEnd(event: DragEndEvent) {
    const newUserControls = userControls.slice();
    for (let control of newUserControls) {
      if (control.id === event.active.id) {
        control.x += event.delta.x;
        control.y += event.delta.y;
        break;
      }
    }
    setUserControls(newUserControls);
  }

  const draggableMarkup = (
    <Canvas>
      {userControls.map((userControl) => (
        <DraggableItem
          key={userControl.id}
          id={userControl.id}
          top={userControl.y}
          left={userControl.x}
        >
          <Image src={logo} alt="" h="40vmin" />
        </DraggableItem>
      ))}
    </Canvas>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {draggableMarkup}
      <Droppable id="myDroppable">
        {/* <Box>
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
        </Box> */}
      </Droppable>
    </DndContext>
  );
}

export default App;
