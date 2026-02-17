// ElementBase component
// Base wrapper for all canvas elements with common functionality

import React, { forwardRef, useCallback, useMemo } from 'react';
import type { CanvasElement } from '@/types/elements';
import { useSelectable, useDraggable, useResizable, useRotatable } from '@/core/hooks';
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
  enableRotation?: boolean;
  onSelect?: (selected: boolean) => void;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  onResizeStart?: () => void;
  onResize?: (width: number, height: number, x: number, y: number) => void;
  onResizeEnd?: (width: number, height: number, x: number, y: number) => void;
  onRotateStart?: () => void;
  onRotate?: (rotation: number) => void;
  onRotateEnd?: (rotation: number) => void;
}

const HANDLE_SIZE = 8;
const ROTATION_HANDLE_OFFSET = 25; // Distance above the element

export const ElementBase = forwardRef<SVGGElement, ElementBaseProps>(
  (
    {
      element,
      children,
      className,
      style,
      disabled = false,
      showHandles = true,
      enableRotation = true,
      onSelect,
      onDragStart,
      onDrag,
      onDragEnd,
      onResizeStart,
      onResize,
      onResizeEnd,
      onRotateStart,
      onRotate,
      onRotateEnd,
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
    const { isDragging, dragState, handlers: dragHandlers } = useDraggable({
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
    const { isResizing, resizeState, startResize } = useResizable({
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

    // Rotation
    const { isRotating, rotateState, startRotate } = useRotatable({
      disabled: isReadonly || !isSelected || !enableRotation,
      snapAngle: 15,
      onRotateStart: () => {
        onRotateStart?.();
      },
      onRotate: (angle) => {
        onRotate?.(angle);
      },
      onRotateEnd: (angle) => {
        updateElement(element.id, { rotation: angle });
        onRotateEnd?.(angle);
      },
    });

    // Current rotation (accounting for live rotation)
    const displayRotation = useMemo(() => {
      if (isRotating && rotateState.currentAngle !== null) {
        return rotateState.currentAngle;
      }
      return element.rotation ?? 0;
    }, [isRotating, rotateState.currentAngle, element.rotation]);

    // Calculate display bounds (accounting for drag and resize)
    const displayBounds = useMemo(() => {
      if (isResizing && resizeState.currentBounds) {
        return resizeState.currentBounds;
      }
      if (isDragging) {
        return {
          x: element.x + dragState.delta.x,
          y: element.y + dragState.delta.y,
          width: element.width,
          height: element.height,
        };
      }
      return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      };
    }, [isResizing, resizeState.currentBounds, isDragging, dragState.delta, element.x, element.y, element.width, element.height]);

    // Calculate scale for resize preview
    const resizeScale = useMemo(() => {
      if (!isResizing || !resizeState.currentBounds) return { x: 1, y: 1 };
      return {
        x: resizeState.currentBounds.width / element.width,
        y: resizeState.currentBounds.height / element.height,
      };
    }, [isResizing, resizeState.currentBounds, element.width, element.height]);

    // Resize handles - use display bounds for correct positioning during resize
    const handles = useMemo(() => {
      if (!isSelected || !showHandles || isReadonly) return [];
      return getResizeHandles(
        { x: 0, y: 0, width: displayBounds.width, height: displayBounds.height },
        HANDLE_SIZE
      );
    }, [isSelected, showHandles, isReadonly, displayBounds.width, displayBounds.height]);

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

    // Handle rotation start
    const handleRotateStart = useCallback(
      (e: React.MouseEvent) => {
        // Center point for rotation (in canvas coordinates)
        const centerX = displayBounds.x + displayBounds.width / 2;
        const centerY = displayBounds.y + displayBounds.height / 2;
        startRotate(
          { x: centerX, y: centerY },
          element.rotation ?? 0,
          e
        );
      },
      [startRotate, displayBounds, element.rotation]
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
          'canvas-element--rotating': isRotating,
          'canvas-element--locked': element.locked,
        }),
        transform: `translate(${displayBounds.x}, ${displayBounds.y})${
          displayRotation ? ` rotate(${displayRotation}, ${displayBounds.width / 2}, ${displayBounds.height / 2})` : ''
        }`,
        style: groupStyle,
        onMouseDown: handleMouseDown,
        onTouchStart: dragHandlers.onTouchStart,
        'data-element-id': element.id,
        'data-element-type': element.type,
      },
      // Element content - scale during resize for visual feedback
      isResizing
        ? React.createElement(
            'g',
            { transform: `scale(${resizeScale.x}, ${resizeScale.y})` },
            children
          )
        : children,

      // Selection outline - use display bounds for accurate sizing
      isSelected &&
        React.createElement('rect', {
          className: 'canvas-element__selection',
          x: -2,
          y: -2,
          width: displayBounds.width + 4,
          height: displayBounds.height + 4,
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
      ),

      // Rotation handle (circular, above the element)
      isSelected && showHandles && enableRotation && !isReadonly &&
        React.createElement('g', {
          key: 'rotation-handle',
          className: 'canvas-element__rotation-handle',
        },
          // Line connecting to element
          React.createElement('line', {
            x1: displayBounds.width / 2,
            y1: 0,
            x2: displayBounds.width / 2,
            y2: -ROTATION_HANDLE_OFFSET,
            stroke: theme.colors.selection.stroke,
            strokeWidth: 1,
            pointerEvents: 'none',
          }),
          // Rotation handle circle
          React.createElement('circle', {
            cx: displayBounds.width / 2,
            cy: -ROTATION_HANDLE_OFFSET,
            r: HANDLE_SIZE / 2 + 2,
            fill: theme.colors.handle.fill,
            stroke: theme.colors.handle.stroke,
            strokeWidth: 1,
            cursor: 'grab',
            onMouseDown: handleRotateStart,
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
