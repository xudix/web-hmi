import React, { forwardRef, ReactNode } from 'react';
//import classNames from 'classnames';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import classNames from 'classnames';
import styles from './Draggable.module.css';

interface DraggableItemProps {
  id: string | number;
  style?: React.CSSProperties;
  top: number;
  left: number;
  children?: ReactNode;
}

export default function DraggableItem({
  id,
  style,
  top,
  left,
  ...props
}: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      listeners={listeners}
      style={{ ...style, top, left }}
      transform={transform}
      {...attributes}
    >
      {props.children}
    </Draggable>
  );
}

interface Props {
  dragging?: boolean;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  transform?: Transform | null;
  children?: ReactNode;
}

const Draggable = forwardRef<HTMLDivElement, Props>(function Draggable(
  { dragging, listeners, transform, style, ...props }: Props,
  ref
) {
  if (transform) {
    style = {
      ...style,
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    };
  }
  return (
    <div
      ref={ref}
      className={classNames(styles.Draggable)}
      style={style}
      {...listeners}
    >
      {props.children}
    </div>
  );
});
