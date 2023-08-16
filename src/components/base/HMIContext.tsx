import { loadPartialConfig } from '@babel/core';
import {
  Component,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import { act } from 'react-dom/test-utils';

import { HMIConfig, ComponentConfig } from './Types';

const HMIConfigsContext: React.Context<HMIConfig[]> = createContext<
  HMIConfig[]
>([]); //
const HMIConfigsDispatchContext: React.Context<React.Dispatch<actionType>> =
  createContext<React.Dispatch<actionType>>(() => {});

export function useHMIConfigs() {
  return useContext(HMIConfigsContext);
}

export function useUpdateHMIConfigs() {
  return useContext(HMIConfigsDispatchContext);
}

export function HMIProvider({ children }) {
  const [hmiConfigs, hmiConfigsDispatch] = useReducer(
    hmiConfigsReducer,
    testHMIConfigs
  );
  return (
    <HMIConfigsContext.Provider value={hmiConfigs}>
      <HMIConfigsDispatchContext.Provider value={hmiConfigsDispatch}>
        {children}
      </HMIConfigsDispatchContext.Provider>
    </HMIConfigsContext.Provider>
  );
}

// interface HMIConfigsProviderProps {
//     children? : ReactNode
// }
// export function HMIConfigsProvider(props: HMIConfigsProviderProps) {
//     const [configs, dispatch] = useReducer(hmiConfigsReducer, testHMIConfigs)

//     return (
//       <HMIConfigsContext.Provider value={configs}>
//         <HMIConfigsDispatchContext.Provider value={dispatch}>
//           {props.children}
//         </HMIConfigsDispatchContext.Provider>
//       </HMIConfigsContext.Provider>
//     );
// }

export interface actionType {
  type: string;
  component?: ComponentConfig;
  newConfigs?: HMIConfig[]; // If type='reloaded', then this will be returned
}
function hmiConfigsReducer(
  configs: HMIConfig[],
  action: actionType
): HMIConfig[] {
  let newConfigs = [...configs]; // have to return a new object in order to trigger a redraw
  console.log(`Action dispatched: ${action.type}.`);
  switch (action.type) {
    case 'added': {
      throw new Error('Not Implemented');
    }
    case 'deleted': {
      throw new Error('Not Implemented');
    }
    case 'modified': {
      if (action.component) {
        for (let page of newConfigs) {
          page.components = page.components.map((component) => {
            if (component.id === action.component?.id) {
              return action.component;
            } else return component;
          });
        }
        return newConfigs;
      }
      return configs;
    }
    case 'reloaded': {
      return action.newConfigs || configs;
    }
  }
  return configs;
}

const testHMIConfigs: HMIConfig[] = [
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
];
