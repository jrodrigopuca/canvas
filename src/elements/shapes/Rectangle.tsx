// Rectangle element component

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';

export interface RectangleProps extends ElementRenderProps {}

const RectangleRender: React.FC<RectangleProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style } = element;

  return React.createElement('rect', {
    width,
    height,
    fill: style?.fill ?? theme.colors.element.fill,
    stroke: style?.stroke ?? theme.colors.element.stroke,
    strokeWidth: style?.strokeWidth ?? theme.strokeWidth.normal,
    rx: style?.cornerRadius ?? 0,
    ry: style?.cornerRadius ?? 0,
    opacity: style?.opacity ?? 1,
  });
};

export const Rectangle = withElementBehavior(RectangleRender);

Rectangle.displayName = 'Rectangle';

export default Rectangle;
