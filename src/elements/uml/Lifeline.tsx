// Lifeline element component (UML sequence diagram)

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';
import type { LifelineElement as LifelineElementType } from '@/types/elements';

export interface LifelineProps extends ElementRenderProps {
  element: LifelineElementType;
}

const LifelineRender: React.FC<LifelineProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style, label } = element;

  const centerX = width / 2;
  const headerHeight = 40;
  const strokeColor = style?.stroke ?? theme.colors.element.stroke;
  const strokeWidth = style?.strokeWidth ?? theme.strokeWidth.normal;

  return React.createElement(
    'g',
    null,
    // Header box
    React.createElement('rect', {
      x: 0,
      y: 0,
      width,
      height: headerHeight,
      fill: style?.fill ?? theme.colors.element.fill,
      stroke: strokeColor,
      strokeWidth,
    }),

    // Label in header
    label &&
      React.createElement(
        'text',
        {
          x: centerX,
          y: headerHeight / 2,
          textAnchor: 'middle',
          dominantBaseline: 'central',
          fill: theme.colors.text.primary,
          fontSize: theme.fontSize.sm,
          fontFamily: 'sans-serif',
        },
        label
      ),

    // Dashed lifeline
    React.createElement('line', {
      x1: centerX,
      y1: headerHeight,
      x2: centerX,
      y2: height,
      stroke: strokeColor,
      strokeWidth,
      strokeDasharray: '8 4',
    })
  );
};

export const Lifeline = withElementBehavior(LifelineRender);

Lifeline.displayName = 'Lifeline';

export default Lifeline;
