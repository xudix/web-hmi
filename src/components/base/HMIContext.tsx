import { loadPartialConfig } from '@babel/core';
import {
  Component,
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from 'react';
import { act } from 'react-dom/test-utils';
import { io, Socket } from 'socket.io-client';

//import socket from "./socket.js"

import { HMIConfig, ComponentConfig, SymbolValuesType } from './Types';

const HMIConfigsContext: React.Context<HMIConfig[]> = createContext<
  HMIConfig[]
>([]); //

const HMIConfigsDispatchContext: React.Context<React.Dispatch<actionType>> =
  createContext<React.Dispatch<actionType>>(() => {});

const SocketIOContext: React.Context<Socket | undefined> = createContext<
  Socket | undefined
>(undefined);

const SymbolValuesContext: React.Context<SymbolValuesType> =
  createContext<SymbolValuesType>({});

/**
 * ms, Time after which the data received from the server expires
 */
const dataExpirationTime = 2000;

const commLostText = '???';

/**
 * Use this hook if a component need to read the HMI Configurations object
 * @returns The current HMI Configurations
 */
export function useHMIConfigs() {
  return useContext(HMIConfigsContext);
}

/**
 * Use this hook if a component need to update the HMI Configurations object
 * @returns A function that updates the HMI Configurations based on the provided action object
 */
export function useUpdateHMIConfigs() {
  return useContext(HMIConfigsDispatchContext);
}

/**
 * Use this hook if a component needs to communicate with the server over SocketIO
 * @returns
 */
export function useSocketConnection() {
  return useContext(SocketIOContext);
}

export function useSymbolValues() {
  return useContext(SymbolValuesContext);
}

export function HMIProvider({ children }) {
  const [hmiConfigs, hmiConfigsDispatch] = useReducer(hmiConfigsReducer, []);

  const socketRef = useRef<Socket | undefined>(undefined);
  const [symbolValues, setSymbolValues] = useState<SymbolValuesType>({});
  const dataExpireTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    //const socketURL: string | undefined = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:2333';
    const socketURL = 'http://localhost:2333';
    socketRef.current = io(socketURL);

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current?.emit('createHMIClient');
    });

    socketRef.current.on('hmiConfigUpdated', (newConfigs: HMIConfig[]) => {
      console.log('hmi Config Updated');
      // initialize the symbolValuesRef, which contains symbol values received from all the server
      let symbolValuesInit: SymbolValuesType = {};
      newConfigs.forEach((pageConfig) => {
        pageConfig.components.forEach((component) => {
          if (
            component.symbol &&
            component.symbol.controllerName &&
            component.symbol.symbolName
          ) {
            if (!symbolValuesInit[component.symbol.controllerName])
              symbolValuesInit[component.symbol.controllerName] = {};
            symbolValuesInit[component.symbol.controllerName][
              component.symbol.symbolName
            ] = commLostText;
          }
        });
      });

      //console.log(symbolValuesInit);

      setSymbolValues(symbolValuesInit);

      hmiConfigsDispatch({
        type: 'reloaded',
        newConfigs: newConfigs,
      });
    });

    socketRef.current.on('subscribedData', (data: SymbolValuesType) => {
      setSymbolValues((previousValue: SymbolValuesType) => {
        let newSymbolValues = { ...previousValue };
        for (let controllerName in data) {
          for (let symbolName in data[controllerName]) {
            if (dataExpireTimers.current[controllerName + symbolName])
              clearTimeout(
                dataExpireTimers.current[controllerName + symbolName]
              );

            if (newSymbolValues[controllerName]) {
              newSymbolValues[controllerName][symbolName] =
                data[controllerName][symbolName];
              // data expires after a preset time
              dataExpireTimers.current[controllerName + symbolName] =
                setTimeout(() => {
                  setSymbolValues((previous: SymbolValuesType) => {
                    let newValue = { ...previous };
                    newValue[controllerName][symbolName] = commLostText;
                    //console.log(newValue);
                    return newValue;
                  });
                }, dataExpirationTime);
            }
          }
        }
        return newSymbolValues;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
      }
    };
  }, []);

  // useEffect(() => {
  //   if (socketRef.current) {
  //     socketRef.current.on('hmiConfigUpdated', (newConfigs: HMIConfig[]) => {
  //       console.log('hmi Config Updated');
  //       // initialize the symbolValuesRef, which contains symbol values received from all the server
  //       let symbolValuesInit: SymbolValuesType = {};
  //       newConfigs.forEach((pageConfig) => {
  //         pageConfig.components.forEach((component) => {
  //           if (
  //             component.symbol &&
  //             component.symbol.controllerName &&
  //             component.symbol.symbolName
  //           ) {
  //             if (!symbolValuesInit[component.symbol.controllerName])
  //               symbolValuesInit[component.symbol.controllerName] = {};
  //             symbolValuesInit[component.symbol.controllerName][
  //               component.symbol.symbolName
  //             ] = null;
  //           }
  //         });
  //       });

  //       console.log(symbolValuesInit);

  //       setSymbolValues(symbolValuesInit);

  //       hmiConfigsDispatch({
  //         type: 'reloaded',
  //         newConfigs: newConfigs,
  //       });
  //     });

  //     socketRef.current.on('subscribedData', (data: SymbolValuesType) => {
  //       let newSymbolValues = { ...symbolValues };

  //       for (let controllerName in data) {
  //         for (let symbolName in data[controllerName]) {
  //           //if(dataExpireTimers.current[controllerName+symbolName]) clearTimeout(dataExpireTimers.current[controllerName+symbolName])

  //           if (newSymbolValues[controllerName]) {
  //             newSymbolValues[controllerName][symbolName] =
  //               data[controllerName][symbolName];
  //             // data expires after a preset time
  //             dataExpireTimers.current[controllerName + symbolName] =
  //               setTimeout(() => {
  //                 //symbolValuesRef.current[controllerName][symbolName] = null;
  //               }, dataExpirationTime);
  //           }
  //         }
  //       }
  //       setSymbolValues(newSymbolValues);
  //     });

  //     return () => {
  //       if (socketRef.current) {
  //         socketRef.current.off('hmiConfigUpdated');
  //         socketRef.current.off('subscribedData');
  //       }
  //     };
  //   }
  // }, [symbolValues]);

  return (
    <SocketIOContext.Provider value={socketRef.current}>
      <HMIConfigsContext.Provider value={hmiConfigs}>
        <HMIConfigsDispatchContext.Provider value={hmiConfigsDispatch}>
          <SymbolValuesContext.Provider value={symbolValues}>
            {children}
          </SymbolValuesContext.Provider>
        </HMIConfigsDispatchContext.Provider>
      </HMIConfigsContext.Provider>
    </SocketIOContext.Provider>
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
  type: 'added' | 'deleted' | 'modified' | 'reloaded';
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

// const testHMIConfigs: HMIConfig[] = [
//   {
//     id: 101,
//     name: 'Page 1',
//     components: [
//       {
//         id: 'Input 1',
//         type: 'TextInput',
//         x: 100,
//         y: 100
//       },
//       {
//         id: 'Input 2',
//         type: 'TextInput',
//         x: 200,
//         y: 300
//       },
//     ],
//   },
//   {
//     id: 102,
//     name: 'Page 2',
//     components: [
//       {
//         id: 'Input 3',
//         type: 'TextInput',
//         x: 500,
//         y: 500
//       },
//       {
//         id: 'Input 4',
//         type: 'TextInput',
//         x: 200,
//         y: 700
//       },
//     ],
//   },
// ];
