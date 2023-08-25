import { Input, Textarea } from '@chakra-ui/react';
import { useRef, useEffect, CSSProperties } from 'react';
import DraggableItem from '../base/DraggableItem';
import { ComponentConfig } from '../base/Types';
import {
  actionType,
  useUpdateHMIConfigs,
  useSymbolValues,
} from '../base/HMIContext';

interface Props extends ComponentConfig {}

export function TextInput({ id, style, x, y, ...props }: Props): JSX.Element {
  const updateHMIConfigs = useUpdateHMIConfigs();
  const symbolValues = useSymbolValues();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // use effect to monitor width change on text box
  const resizeDelayTimeout = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    //console.log(`Effect ran for ${id}`);

    const observer = new ResizeObserver(handleResize);
    if (textAreaRef.current) observer.observe(textAreaRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleResize() {
    if (resizeDelayTimeout.current) clearTimeout(resizeDelayTimeout.current);
    resizeDelayTimeout.current = setTimeout(() => {
      const newWidth = textAreaRef.current?.style.width;
      if (newWidth != style?.width) {
        // console.log(`${id} width change from ${style?.width} to ${newWidth}`);

        const updateAction: actionType = {
          type: 'modified',
          component: {
            ...props,
            id: id,
            type: 'TextInput',
            x: x,
            y: y,
            style: { ...style, width: newWidth },
          },
        };
        updateHMIConfigs(updateAction);
      }
    }, 1000);
  }

  const draggableStyle: CSSProperties = {
    resize: 'horizontal',
    ...style,
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

  return (
    <DraggableItem id={id} left={x} top={y} style={draggableStyle}>
      {/* <Input size='xs' htmlSize={1} width='auto' style={inputStyle}>
      </Input> */}
      <Textarea
        style={inputStyle}
        rows={1}
        ref={textAreaRef}
        value={symbolValues[props.symbol?.controllerName][
          props.symbol?.symbolName
        ]?.toString()}
      />
      {/* <input type="text" style={inputStyle} width={1}></input> */}
    </DraggableItem>
  );
}

export default TextInput;
