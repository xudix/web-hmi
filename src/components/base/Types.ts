export interface HMIConfig {
  id: string | number;
  name: string;
  style?: React.CSSProperties;
  components: ComponentConfig[];
}

export interface ComponentConfig {
  id: string | number;
  type: string;
  x: number;
  y: number;
  style?: React.CSSProperties;
  symbol?: {
    controllerName: string;
    symbolName: string;
  };
  value?: any;
}

/**
 * Data object received from the controller for data transmission. The structure is {controllerName: {symbolName: value}}.
 */
export type SymbolValuesType = Record<string, Record<string, any>>;
