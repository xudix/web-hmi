import { Input, Textarea } from '@chakra-ui/react';
import { useRef, CSSProperties } from 'react';
import DraggableItem from '../base/DraggableItem';
import { ComponentConfig } from '../base/Types';
import { useUpdateHMIConfigs } from '../base/HMIContext';

interface Props extends ComponentConfig {}

export function TextInput({ id, style, x, y, ...props }: Props): JSX.Element {
  const hmiConfigsDispatch = useUpdateHMIConfigs();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const draggableStyle: CSSProperties = {
    ...style,
    resize: 'horizontal',
  };
  let inputStyle: CSSProperties = {
    resize: 'horizontal',
    height: 'fit-content',
    fontSize: '10px',
    width: '50px',
    padding: '2px',
    textAlign: 'center',
  };

  inputStyle = { ...inputStyle, ...style };

  function handleResize() {
    console.log(`Textarea ${id} resized`);
    observer.disconnect();
  }

  let observer = new ResizeObserver(handleResize);
  if (textAreaRef.current) observer.observe(textAreaRef.current);

  return (
    <DraggableItem id={id} left={x} top={y} style={draggableStyle}>
      {/* <Input size='xs' htmlSize={1} width='auto' style={inputStyle}>
      </Input> */}
      <Textarea style={inputStyle} rows={1} ref={textAreaRef}></Textarea>
      {/* <input type="text" style={inputStyle} width={1}></input> */}
    </DraggableItem>
  );
}

export default TextInput;
