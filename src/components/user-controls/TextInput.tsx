import { Input, Textarea, useStatStyles } from '@chakra-ui/react';
import { useRef, useEffect, CSSProperties, useState, ChangeEvent } from 'react';
import DraggableItem from '../base/DraggableItem';
import { ComponentConfig } from '../base/Types';
import {
  actionType,
  useUpdateHMIConfigs,
  useSymbolValues,
  useSocketConnection,
} from '../base/HMIContext';

interface Props extends ComponentConfig {}

export function TextInput({ id, style, x, y, ...props }: Props): JSX.Element {
  const updateHMIConfigs = useUpdateHMIConfigs();
  const symbolValues = useSymbolValues();
  const socket = useSocketConnection();
  let [focused, setFocused] = useState<boolean>(false);
  let [inputValue, setInputValue] = useState<string>('');

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

  function handleValueChange(e: ChangeEvent) {
    setInputValue(e.target?.value);
  }

  function handleLoseFocus() {
    setFocused(false);
    if (props.symbol && props.symbol.controllerName) {
      let newValueObj: Record<string, Record<string, any>> = {};
      newValueObj[props.symbol.controllerName] = {};
      newValueObj[props.symbol.controllerName][props.symbol.symbolName] =
        inputValue;
      socket?.emit('writeNewValues', newValueObj);
    }
  }

  function handleFocus() {
    setFocused(true);
    if (props.symbol && symbolValues[props.symbol.controllerName])
      setInputValue(
        symbolValues[props.symbol.controllerName][
          props.symbol?.symbolName
        ]?.toString()
      );
  }

  const draggableStyle: CSSProperties = {
    resize: 'horizontal',
    ...style,
  };
  // default style for TextInput
  let inputStyle: CSSProperties = {
    resize: 'horizontal',
    height: 'fit-content',
    fontSize: '10px',
    width: '50px',
    padding: '2px',
    textAlign: 'center',
  };

  inputStyle = { ...inputStyle, ...style };
  let displayValue = inputValue;
  if (!focused && props.symbol && symbolValues[props.symbol.controllerName])
    displayValue =
      symbolValues[props.symbol.controllerName][props.symbol.symbolName];

  if (displayValue == undefined || displayValue == null) {
    displayValue = '';
  }

  return (
    <DraggableItem id={id} left={x} top={y} style={draggableStyle}>
      {/* <Input size='xs' htmlSize={1} width='auto' style={inputStyle}>
      </Input> */}
      <Textarea
        style={inputStyle}
        rows={1}
        ref={textAreaRef}
        value={displayValue}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleLoseFocus}
      />
    </DraggableItem>
  );
}

export default TextInput;
