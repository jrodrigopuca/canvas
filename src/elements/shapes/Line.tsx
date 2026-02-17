// Line element component

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';
import type { LineElement as LineElementType } from '@/types/elements';

export interface LineProps extends ElementRenderProps {
  element: LineElementType;
}

const LineRender: React.FC<LineProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style, points, lineType = 'solid' } = element;

  // If specific points provided, use them; otherwise draw diagonal
  const linePoints = points ?? [
    { x: 0, y: 0 },
    { x: width, y: height },
  ];

  // Build path from points
  const pathData = linePoints
    .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
    .join(' ');

  // Get stroke dasharray based on line type
  const getStrokeDasharray = (): string | undefined => {
    switch (lineType) {
      case 'dashed':
        return '8 4';
      case 'dotted':
        return '2 2';
      default:
        return undefined;
    }
  };

  return React.createElement(
    'g',
    null,
    // Invisible wider path for easier selection
    React.createElement('path', {
      d: pathData,
      fill: 'none',
      stroke: 'transparent',
      strokeWidth: 10,
    }),
    // Visible line
    React.createElement('path', {
      d: pathData,
      fill: 'none',
      stroke: style?.stroke ?? theme.colors.element.stroke,
      strokeWidth: style?.strokeWidth ?? theme.strokeWidth.normal,
      strokeDasharray: getStrokeDasharray(),
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      opacity: style?.opacity ?? 1,
    })
  );
};

export const Line = withElementBehavior(LineRender);

Line.displayName = 'Line';

export default Line;
