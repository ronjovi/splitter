import React from 'react';

export const isTouchEvent = (
  e: React.MouseEvent | React.TouchEvent,
): e is React.TouchEvent => {
  return 'changedTouches' in e;
};
