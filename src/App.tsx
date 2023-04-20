import { motion } from 'framer-motion';
import { useState } from 'react';

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from '@dnd-kit/core';

import logo from './logo.svg';

import { HMIConfig, ComponentConfig } from './components/base/Types';
import Droppable from './components/base/Droppable';
import DraggableItem from './components/base/DraggableItem';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import DroppableCanvas from './components/base/DroppableCanvas';
import HMIPage from './components/base/HMIPage';

const textFontSizes = [16, 18, 24, 30];

function App(): JSX.Element {
  // just a test data
  const [userControls, setUserControls] = useState<HMIConfig[]>([
    {
      id: 101,
      name: 'Page 1',
      components: [
        {
          id: 'Input 1',
          type: 'TextInput',
          x: 100,
          y: 100,
        },
        {
          id: 'Input 2',
          type: 'TextInput',
          x: 200,
          y: 300,
        },
      ],
    },
    {
      id: 102,
      name: 'Page 2',
      components: [
        {
          id: 'Input 3',
          type: 'TextInput',
          x: 500,
          y: 500,
        },
        {
          id: 'Input 4',
          type: 'TextInput',
          x: 200,
          y: 700,
        },
      ],
    },
  ]);

  const activationConstraint = {
    delay: 1000,
    tolerance: 5,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  function handleDragEnd(event: DragEndEvent) {
    const newUserControls = userControls.slice();
    let found = false;
    for (let page of newUserControls) {
      for (let component of page.components) {
        if (component.id === event.active.id) {
          component.x += event.delta.x;
          component.y += event.delta.y;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    setUserControls(newUserControls);
  }

  const draggableMarkup = (
    // <DroppableCanvas id="canvas">
    //   {userControls[0].components.map((userControl) => (
    //     <DraggableItem
    //       key={userControl.id}
    //       id={userControl.id}
    //       top={userControl.y}
    //       left={userControl.x}
    //     >
    //       <Image src={logo} alt="" h="40vmin" />
    //     </DraggableItem>
    //   ))}
    // </DroppableCanvas>
    <HMIPage configs={userControls} />
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
