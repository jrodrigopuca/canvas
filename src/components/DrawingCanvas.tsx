// DrawingCanvas component
// SVG container that renders all canvas elements

import React, { forwardRef, useCallback, useMemo } from 'react';
import type { CanvasElement, ElementType } from '@/types/elements';
import { useCanvas, useSelection, useViewport, useTheme } from '@/core/context';
import { cx, sortByZIndex } from '@/core/utils';

// Element components map
import { Rectangle, Ellipse, Diamond, TextElement, Line } from '@/elements/shapes';
import { Actor, Lifeline, Message, ActivationBar } from '@/elements/uml';

export interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  showGrid?: boolean;
  gridSize?: number;
  onCanvasClick?: (e: React.MouseEvent) => void;
  onCanvasDoubleClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

// Map element types to components
const elementComponents: Record<ElementType, React.ComponentType<any>> = {
  rectangle: Rectangle,
  ellipse: Ellipse,
  circle: Ellipse,
  diamond: Diamond,
  text: TextElement,
  line: Line,
  actor: Actor,
  lifeline: Lifeline,
  message: Message,
  activationBar: ActivationBar,
  // Default fallback for custom types
  custom: Rectangle,
};

export const DrawingCanvas = forwardRef<SVGSVGElement, DrawingCanvasProps>(
  (
    {
      width: propWidth,
      height: propHeight,
      className,
      style,
      showGrid: propShowGrid,
      gridSize: propGridSize,
      onCanvasClick,
      onCanvasDoubleClick,
      children,
    },
    ref
  ) => {
    const { elements, config } = useCanvas();
    const { clearSelection } = useSelection();
    const { viewport } = useViewport();
    const { theme } = useTheme();

    const width = propWidth ?? config.width;
    const height = propHeight ?? config.height;
    const showGrid = propShowGrid ?? config.grid?.visible;
    const gridSize = propGridSize ?? config.grid?.size ?? 20;

    // Sort elements by z-index
    const sortedElements = useMemo(() => sortByZIndex(elements), [elements]);

    // Handle click on canvas background (deselect)
    const handleBackgroundClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          clearSelection();
          onCanvasClick?.(e);
        }
      },
      [clearSelection, onCanvasClick]
    );

    // Render grid pattern
    const renderGrid = () => {
      if (!showGrid) return null;

      const patternId = 'canvas-grid-pattern';

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'defs',
          null,
          React.createElement(
            'pattern',
            {
              id: patternId,
              width: gridSize,
              height: gridSize,
              patternUnits: 'userSpaceOnUse',
            },
            React.createElement('path', {
              d: `M ${gridSize} 0 L 0 0 0 ${gridSize}`,
              fill: 'none',
              stroke: theme.colors.grid.line,
              strokeWidth: 0.5,
            })
          )
        ),
        React.createElement('rect', {
          width: '100%',
          height: '100%',
          fill: `url(#${patternId})`,
        })
      );
    };

    // Render a single element
    const renderElement = (element: CanvasElement) => {
      const Component = elementComponents[element.type] ?? elementComponents.custom;

      return React.createElement(Component, {
        key: element.id,
        element,
      });
    };

    return React.createElement(
      'svg',
      {
        ref,
        className: cx('canvas-drawing', className),
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
        style: {
          backgroundColor: theme.colors.background,
          cursor: 'default',
          userSelect: 'none',
          ...style,
        },
        onClick: handleBackgroundClick,
        onDoubleClick: onCanvasDoubleClick,
      },
      // Transform group for zoom and pan
      React.createElement(
        'g',
        {
          transform: `translate(${viewport.pan.x}, ${viewport.pan.y}) scale(${viewport.zoom})`,
        },
        // Grid
        renderGrid(),

        // Elements
        sortedElements.map(renderElement),

        // Additional children (e.g., selection boxes, connection handles)
        children
      )
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
