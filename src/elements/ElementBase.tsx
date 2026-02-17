// ElementBase component
// Base wrapper for all canvas elements with common functionality

import React, { forwardRef, useCallback, useMemo } from 'react';
import type { CanvasElement } from '@/types/elements';
import { useSelectable, useDraggable, useResizable } from '@/core/hooks';
import { useCanvas, useTheme } from '@/core/context';
import { cx, getResizeHandles } from '@/core/utils';
import type { ResizeHandle } from '@/core/utils/geometry';

export interface ElementBaseProps {
  element: CanvasElement;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  showHandles?: boolean;
  onSelect?: (selected: boolean) => void;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  onResizeStart?: () => void;
  onResize?: (width: number, height: number, x: number, y: number) => void;
  onResizeEnd?: (width: number, height: number, x: number, y: number) => void;
}

const HANDLE_SIZE = 8;

export const ElementBase = forwardRef<SVGGElement, ElementBaseProps>(
  (
    {
      element,
      children,
      className,
      style,
      disabled = false,
      showHandles = true,
      onSelect,
      onDragStart,
      onDrag,
      onDragEnd,
      onResizeStart,
      onResize,
      onResizeEnd,
    },
    ref
  ) => {
    const { updateElement } = useCanvas();
    const { theme } = useTheme();
    const isReadonly = element.locked || disabled;

    // Selection
    const { isSelected, handlers: selectionHandlers } = useSelectable({
      id: element.id,
      disabled: isReadonly,
      onSelect,
    });

    // Dragging
    const { isDragging, handlers: dragHandlers } = useDraggable({
      disabled: isReadonly || !isSelected,
      onDragStart: () => {
        onDragStart?.();
      },
      onDrag: (pos, delta) => {
        const newX = element.x + delta.x;
        const newY = element.y + delta.y;
        onDrag?.(newX, newY);
      },
      onDragEnd: (pos, delta) => {
        const newX = element.x + delta.x;
        const newY = element.y + delta.y;
        updateElement(element.id, { x: newX, y: newY });
        onDragEnd?.(newX, newY);
      },
    });

    // Resizing
    const { isResizing, startResize } = useResizable({
      disabled: isReadonly || !isSelected,
      minWidth: element.minWidth ?? 20,
      minHeight: element.minHeight ?? 20,
      maxWidth: element.maxWidth,
      maxHeight: element.maxHeight,
      onResizeStart: () => {
        onResizeStart?.();
      },
      onResize: (bounds) => {
        onResize?.(bounds.width, bounds.height, bounds.x, bounds.y);
      },
      onResizeEnd: (bounds) => {
        updateElement(element.id, {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        });
        onResizeEnd?.(bounds.width, bounds.height, bounds.x, bounds.y);
      },
    });

    // Resize handles
    const handles = useMemo(() => {
      if (!isSelected || !showHandles || isReadonly) return [];
      return getResizeHandles(
        { x: 0, y: 0, width: element.width, height: element.height },
        HANDLE_SIZE
      );
    }, [isSelected, showHandles, isReadonly, element.width, element.height]);

    // Handle resize start
    const handleResizeStart = useCallback(
      (handle: ResizeHandle, e: React.MouseEvent) => {
        startResize(
          handle,
          { x: element.x, y: element.y, width: element.width, height: element.height },
          e
        );
      },
      [startResize, element]
    );

    // Combined mouse handlers
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        selectionHandlers.onClick(e);
        if (isSelected) {
          dragHandlers.onMouseDown(e);
        }
      },
      [selectionHandlers, dragHandlers, isSelected]
    );

    // Styles
    const groupStyle: React.CSSProperties = {
      cursor: isDragging ? 'grabbing' : isSelected ? 'grab' : 'pointer',
      opacity: element.visible === false ? 0.5 : 1,
      ...style,
    };

    return React.createElement(
      'g',
      {
        ref,
        className: cx('canvas-element', className, {
          'canvas-element--selected': isSelected,
          'canvas-element--dragging': isDragging,
          'canvas-element--resizing': isResizing,
          'canvas-element--locked': element.locked,
        }),
        transform: `translate(${element.x}, ${element.y})${
          element.rotation ? ` rotate(${element.rotation}, ${element.width / 2}, ${element.height / 2})` : ''
        }`,
        style: groupStyle,
        onMouseDown: handleMouseDown,
        onTouchStart: dragHandlers.onTouchStart,
        'data-element-id': element.id,
        'data-element-type': element.type,
      },
      // Element content
      children,

      // Selection outline
      isSelected &&
        React.createElement('rect', {
          className: 'canvas-element__selection',
          x: -2,
          y: -2,
          width: element.width + 4,
          height: element.height + 4,
          fill: 'none',
          stroke: theme.colors.selection.stroke,
          strokeWidth: 1,
          strokeDasharray: '4 2',
          pointerEvents: 'none',
        }),

      // Resize handles
      handles.map((handle) =>
        React.createElement('rect', {
          key: handle.position,
          className: `canvas-element__handle canvas-element__handle--${handle.position}`,
          x: handle.x,
          y: handle.y,
          width: HANDLE_SIZE,
          height: HANDLE_SIZE,
          fill: theme.colors.handle.fill,
          stroke: theme.colors.handle.stroke,
          strokeWidth: 1,
          cursor: getCursorForHandle(handle.position),
          onMouseDown: (e: React.MouseEvent) => handleResizeStart(handle.position, e),
        })
      )
    );
  }
);

ElementBase.displayName = 'ElementBase';

// Helper to get cursor for resize handle
function getCursorForHandle(position: ResizeHandle): string {
  const cursors: Record<ResizeHandle, string> = {
    nw: 'nwse-resize',
    n: 'ns-resize',
    ne: 'nesw-resize',
    e: 'ew-resize',
    se: 'nwse-resize',
    s: 'ns-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
  };
  return cursors[position];
}

export default ElementBase;
