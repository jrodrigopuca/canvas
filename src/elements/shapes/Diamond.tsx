// Diamond element component

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';

export interface DiamondProps extends ElementRenderProps {}

const DiamondRender: React.FC<DiamondProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style } = element;

  // Diamond points: top, right, bottom, left
  const points = [
    `${width / 2},0`,
    `${width},${height / 2}`,
    `${width / 2},${height}`,
    `0,${height / 2}`,
  ].join(' ');

  return React.createElement('polygon', {
    points,
    fill: style?.fill ?? theme.colors.element.fill,
    stroke: style?.stroke ?? theme.colors.element.stroke,
    strokeWidth: style?.strokeWidth ?? theme.strokeWidth.normal,
    opacity: style?.opacity ?? 1,
  });
};

export const Diamond = withElementBehavior(DiamondRender);

Diamond.displayName = 'Diamond';

export default Diamond;
