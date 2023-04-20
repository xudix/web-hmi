import { Input, Textarea } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import DraggableItem from '../base/DraggableItem';
import { ComponentConfig } from '../base/Types';

interface Props extends ComponentConfig {}

export function TextInput({ id, style, x, y, ...props }: Props) {
  const draggableStyle: CSSProperties = {
    ...style,
    resize: 'horizontal',
  };
  const inputStyle: CSSProperties = {
    resize: 'horizontal',
    height: 'fit-content',
    fontSize: '10px',
    width: '50px',
    padding: '2px',
    textAlign: 'center',
  };

  return (
    <DraggableItem id={id} left={x} top={y} style={draggableStyle}>
      {/* <Input size='xs' htmlSize={1} width='auto' style={inputStyle}>
      </Input> */}
      <Textarea style={inputStyle} rows={1}></Textarea>
      {/* <input type="text" style={inputStyle} width={1}></input> */}
    </DraggableItem>
  );
}

export default TextInput;
