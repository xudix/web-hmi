import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
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

import { DragEndEvent } from '@dnd-kit/core/dist/types';

import { HMIConfig, ComponentConfig } from './Types';
import DroppableCanvas from './DroppableCanvas';
import { createElement } from 'react';
import HMIComponents from '../user-controls/index';
import { useHMIConfigs, useUpdateHMIConfigs, actionType } from './HMIContext';
import Droppable from './Droppable';

interface HMIPageProps {
  configs: HMIConfig[];
}

export default function HMIPage() {
  const hmiConfigs = useHMIConfigs();
  const updateHMIConfigs = useUpdateHMIConfigs();

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
    let action: actionType;
    for (let page of hmiConfigs) {
      for (let component of page.components) {
        if (component.id === event.active.id) {
          // component.x += event.delta.x;
          // component.y += event.delta.y;
          action = {
            type: 'modified',
            component: { ...component },
          };
          action.component.x += event.delta.x;
          action.component.y += event.delta.y;
          updateHMIConfigs(action);
          return;
        }
      }
    }
  }

  const draggableMarkup = (
    <Tabs>
      <TabList>
        {hmiConfigs.map((hmiConfig) => {
          return <Tab key={hmiConfig.id}>{hmiConfig.name}</Tab>;
        })}
      </TabList>
      <TabPanels>
        {hmiConfigs.map((hmiConfig) => HMITabPanel({ config: hmiConfig }))}
      </TabPanels>
    </Tabs>
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Droppable id="myDroppable">{draggableMarkup}</Droppable>
    </DndContext>
  );
}

interface HMIPanelProps {
  config: HMIConfig;
}

function HMITabPanel(props: HMIPanelProps): React.ReactNode {
  return (
    <TabPanel key={props.config.id}>
      <DroppableCanvas id={props.config.id}>
        {props.config.components.map((componentConfig) => {
          return createElement(HMIComponents[componentConfig.type], {
            ...componentConfig,
            key: componentConfig.id,
          });
          // return (
          //   <ComponentType {...componentConfig}/>
          // )
        })}
      </DroppableCanvas>
    </TabPanel>
  );
}
