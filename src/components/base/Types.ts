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
}
