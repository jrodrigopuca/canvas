// Ellipse element component (also used for Circle and Oval)

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';

export interface EllipseProps extends ElementRenderProps {}

const EllipseRender: React.FC<EllipseProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style } = element;

  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2;
  const ry = height / 2;

  return React.createElement('ellipse', {
    cx,
    cy,
    rx,
    ry,
    fill: style?.fill ?? theme.colors.element.fill,
    stroke: style?.stroke ?? theme.colors.element.stroke,
    strokeWidth: style?.strokeWidth ?? theme.strokeWidth.normal,
    opacity: style?.opacity ?? 1,
  });
};

export const Ellipse = withElementBehavior(EllipseRender);

Ellipse.displayName = 'Ellipse';

/**
 * Circle is an Ellipse with equal width and height
 * Use at component level: <Ellipse element={{ ...element, width: size, height: size }} />
 */
export const Circle = Ellipse;
Circle.displayName = 'Circle';

/**
 * Oval is an alias for Ellipse
 */
export const Oval = Ellipse;
Oval.displayName = 'Oval';

export default Ellipse;
