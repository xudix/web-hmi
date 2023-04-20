import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { HMIConfig, ComponentConfig } from './Types';
import DroppableCanvas from './DroppableCanvas';
import { createElement } from 'react';
import HMIComponents from '../user-controls/index';

interface HMIPageProps {
  configs: HMIConfig[];
}

export default function HMIPage(props: HMIPageProps) {
  return (
    <Tabs>
      <TabList>
        {props.configs.map((hmiConfig) => {
          return <Tab key={hmiConfig.id}>{hmiConfig.name}</Tab>;
        })}
      </TabList>
      <TabPanels>
        {props.configs.map((hmiConfig) => HMITabPanel({ config: hmiConfig }))}
      </TabPanels>
    </Tabs>
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
