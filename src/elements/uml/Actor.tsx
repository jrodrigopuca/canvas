// Actor element component (UML stick figure)

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';
import type { ActorElement as ActorElementType } from '@/types/elements';

export interface ActorProps extends ElementRenderProps {
  element: ActorElementType;
}

const ActorRender: React.FC<ActorProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style, label } = element;

  // Actor proportions
  const headRadius = Math.min(width, height) * 0.15;
  const centerX = width / 2;
  const bodyTop = headRadius * 2 + 4;
  const bodyBottom = height * 0.6;
  const armY = bodyTop + (bodyBottom - bodyTop) * 0.3;
  const armSpan = width * 0.4;
  const legSpan = width * 0.35;
  const labelY = height - 4;

  const strokeColor = style?.stroke ?? theme.colors.element.stroke;
  const strokeWidth = style?.strokeWidth ?? theme.strokeWidth.normal;

  return React.createElement(
    'g',
    null,
    // Invisible background for selection
    React.createElement('rect', {
      width,
      height,
      fill: 'transparent',
    }),

    // Head (circle)
    React.createElement('circle', {
      cx: centerX,
      cy: headRadius + 2,
      r: headRadius,
      fill: style?.fill ?? 'none',
      stroke: strokeColor,
      strokeWidth,
    }),

    // Body (vertical line)
    React.createElement('line', {
      x1: centerX,
      y1: bodyTop,
      x2: centerX,
      y2: bodyBottom,
      stroke: strokeColor,
      strokeWidth,
    }),

    // Arms (horizontal line)
    React.createElement('line', {
      x1: centerX - armSpan,
      y1: armY,
      x2: centerX + armSpan,
      y2: armY,
      stroke: strokeColor,
      strokeWidth,
    }),

    // Left leg
    React.createElement('line', {
      x1: centerX,
      y1: bodyBottom,
      x2: centerX - legSpan,
      y2: height * 0.85,
      stroke: strokeColor,
      strokeWidth,
    }),

    // Right leg
    React.createElement('line', {
      x1: centerX,
      y1: bodyBottom,
      x2: centerX + legSpan,
      y2: height * 0.85,
      stroke: strokeColor,
      strokeWidth,
    }),

    // Label
    label &&
      React.createElement(
        'text',
        {
          x: centerX,
          y: labelY,
          textAnchor: 'middle',
          dominantBaseline: 'text-bottom',
          fill: style?.fill ?? theme.colors.text.primary,
          fontSize: theme.fontSize.sm,
          fontFamily: 'sans-serif',
        },
        label
      )
  );
};

export const Actor = withElementBehavior(ActorRender);

Actor.displayName = 'Actor';

export default Actor;
