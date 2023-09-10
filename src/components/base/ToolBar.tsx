import { Button } from '@chakra-ui/react';
import { useHMIConfigs, useSocketConnection } from './HMIContext';

export default function ToolBar() {
  const hmiConfigs = useHMIConfigs();
  const socket = useSocketConnection();

  function handleSaveConfig() {
    socket?.emit('writeLoggingConfig', hmiConfigs);
  }

  return (
    <div>
      <Button onClick={handleSaveConfig}>Save Config</Button>
    </div>
  );
}
