import React from 'react';
import classNames from 'classnames';

import styles from './Draggable.module.css';

interface Props {
  children: React.ReactNode;
  center?: boolean;
  style?: React.CSSProperties;
}

export default function Canvas({ children, center, style }: Props) {
  return (
    <div
      className={classNames(styles.Canvas, center && styles.center)}
      style={style}
    >
      {children}
    </div>
  );
}
