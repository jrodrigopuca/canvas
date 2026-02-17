// Line element component
// Uses LineBase for specialized endpoint-based resizing instead of standard 8-handle resize

import React, { forwardRef, useCallback } from 'react';
import { LineBase } from '../LineBase';
import { useTheme } from '@/core/context';
import type { LineElement as LineElementType, Point } from '@/types/elements';

export interface LineProps {
  element: LineElementType;
  disabled?: boolean;
  showHandles?: boolean;
  enableRotation?: boolean;
  onSelect?: (selected: boolean) => void;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  onPointsChange?: (points: Point[]) => void;
  onRotateStart?: () => void;
  onRotate?: (rotation: number) => void;
  onRotateEnd?: (rotation: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Line = forwardRef<SVGGElement, LineProps>(
  (
    {
      element,
      disabled,
      showHandles,
      enableRotation,
      onSelect,
      onDragStart,
      onDrag,
      onDragEnd,
      onPointsChange,
      onRotateStart,
      onRotate,
      onRotateEnd,
      className,
      style,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { style: elementStyle, lineType = 'solid' } = element;

    // Get stroke dasharray based on line type
    const getStrokeDasharray = useCallback((): string | undefined => {
      switch (lineType) {
        case 'dashed':
          return '8 4';
        case 'dotted':
          return '2 2';
        default:
          return undefined;
      }
    }, [lineType]);

    const strokeColor = elementStyle?.stroke ?? theme.colors.element.stroke;
    const strokeWidth = elementStyle?.strokeWidth ?? theme.strokeWidth.normal;

    // Render function for the line itself
    const renderLine = useCallback((points: Point[], isEndpointDragging: boolean) => {
      // Build path from points
      const pathData = points
        .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
        .join(' ');

      return React.createElement(
        'g',
        null,
        // Invisible wider path for easier selection (follows the line shape)
        React.createElement('path', {
          d: pathData,
          fill: 'none',
          stroke: 'transparent',
          strokeWidth: 20, // Wide hit area
          strokeLinecap: 'round',
        }),
        // Visible line
        React.createElement('path', {
          d: pathData,
          fill: 'none',
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDasharray: getStrokeDasharray(),
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          opacity: elementStyle?.opacity ?? 1,
        })
      );
    }, [strokeColor, strokeWidth, getStrokeDasharray, elementStyle?.opacity]);

    return React.createElement(LineBase, {
      ref,
      element,
      disabled,
      showHandles,
      enableRotation,
      className,
      style,
      onSelect,
      onDragStart,
      onDrag,
      onDragEnd,
      onPointsChange,
      onRotateStart,
      onRotate,
      onRotateEnd,
      renderLine,
    });
  }
);

Line.displayName = 'Line';

export default Line;
