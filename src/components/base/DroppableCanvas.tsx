import React from 'react';
import classNames from 'classnames';

import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

import styles from './Draggable.module.scss';

interface Props {
  id: UniqueIdentifier;
  children?: React.ReactNode;
  center?: boolean;
  style?: React.CSSProperties;
}

export default function DroppableCanvas(props: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  return (
    <div
      className={classNames(styles.Canvas, props.center && styles.center)}
      style={props.style}
      ref={setNodeRef}
    >
      {props.children}
    </div>
  );
}
