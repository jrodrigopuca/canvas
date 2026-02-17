// LineBase component
// Specialized base wrapper for line elements with endpoint handles

import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import type { LineElement, Point } from '@/types/elements';
import { useSelectable, useDraggable, useRotatable } from '@/core/hooks';
import { useCanvas, useTheme, useViewport } from '@/core/context';
import { cx } from '@/core/utils';

export interface LineBaseProps {
  element: LineElement;
  children?: React.ReactNode;
  /** Callback to render with current points during endpoint drag */
  renderLine: (points: Point[], isEndpointDragging: boolean) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
}

const HANDLE_SIZE = 8;
const ROTATION_HANDLE_OFFSET = 25;

interface EndpointDragState {
  isDragging: boolean;
  endpointIndex: number | null;
  startPosition: Point | null;
  currentPoints: Point[] | null;
}

export const LineBase = forwardRef<SVGGElement, LineBaseProps>(
  (
    {
      element,
      children,
      renderLine,
      className,
      style,
      disabled = false,
      showHandles = true,
      enableRotation = true,
      onSelect,
      onDragStart,
      onDrag,
      onDragEnd,
      onPointsChange,
      onRotateStart,
      onRotate,
      onRotateEnd,
    },
    ref
  ) => {
    const { updateElement } = useCanvas();
    const { theme } = useTheme();
    const { screenToCanvas } = useViewport();
    const isReadonly = element.locked || disabled;

    // Endpoint dragging state
    const [endpointDrag, setEndpointDrag] = useState<EndpointDragState>({
      isDragging: false,
      endpointIndex: null,
      startPosition: null,
      currentPoints: null,
    });

    const endpointDragRef = useRef<{
      endpointIndex: number;
      startMousePos: Point;
      originalPoints: Point[];
    } | null>(null);

    // Get current points
    const basePoints = useMemo(() => {
      return element.points ?? [
        { x: 0, y: element.height / 2 },
        { x: element.width, y: element.height / 2 },
      ];
    }, [element.points, element.width, element.height]);

    // Selection
    const { isSelected, handlers: selectionHandlers } = useSelectable({
      id: element.id,
      disabled: isReadonly,
      onSelect,
    });

    // Dragging (whole line)
    const { isDragging, dragState, handlers: dragHandlers } = useDraggable({
      disabled: isReadonly || !isSelected || endpointDrag.isDragging,
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

    // Current display values
    const displayRotation = useMemo(() => {
      if (isRotating && rotateState.currentAngle !== null) {
        return rotateState.currentAngle;
      }
      return element.rotation ?? 0;
    }, [isRotating, rotateState.currentAngle, element.rotation]);

    const displayBounds = useMemo(() => {
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
    }, [isDragging, dragState.delta, element.x, element.y, element.width, element.height]);

    // Current points to display (accounting for endpoint drag)
    const displayPoints = useMemo(() => {
      if (endpointDrag.isDragging && endpointDrag.currentPoints) {
        return endpointDrag.currentPoints;
      }
      return basePoints;
    }, [endpointDrag.isDragging, endpointDrag.currentPoints, basePoints]);

    // Endpoint drag handlers
    const handleEndpointMouseDown = useCallback(
      (endpointIndex: number, e: React.MouseEvent) => {
        if (isReadonly || !isSelected) return;
        
        e.stopPropagation();
        e.preventDefault();

        const startPos = screenToCanvas({ x: e.clientX, y: e.clientY });
        
        endpointDragRef.current = {
          endpointIndex,
          startMousePos: startPos,
          originalPoints: [...basePoints],
        };

        setEndpointDrag({
          isDragging: true,
          endpointIndex,
          startPosition: startPos,
          currentPoints: [...basePoints],
        });

        // Add global listeners
        const handleMouseMove = (moveEvent: MouseEvent) => {
          if (!endpointDragRef.current) return;

          const currentPos = screenToCanvas({ x: moveEvent.clientX, y: moveEvent.clientY });
          const { endpointIndex: idx, startMousePos, originalPoints } = endpointDragRef.current;

          const deltaX = currentPos.x - startMousePos.x;
          const deltaY = currentPos.y - startMousePos.y;

          // Create new points array with updated endpoint
          const newPoints = originalPoints.map((p, i) => {
            if (i === idx) {
              return { x: p.x + deltaX, y: p.y + deltaY };
            }
            return { ...p };
          });

          setEndpointDrag(prev => ({
            ...prev,
            currentPoints: newPoints,
          }));
        };

        const handleMouseUp = () => {
          if (!endpointDragRef.current) return;

          const currentState = endpointDragRef.current;
          
          // Get the final points from state
          setEndpointDrag(prev => {
            if (prev.currentPoints) {
              // Calculate new bounding box from points
              const points = prev.currentPoints;
              const xs = points.map(p => p.x);
              const ys = points.map(p => p.y);
              const minX = Math.min(...xs);
              const minY = Math.min(...ys);
              const maxX = Math.max(...xs);
              const maxY = Math.max(...ys);
              
              // Normalize points relative to new bounding box
              const normalizedPoints = points.map(p => ({
                x: p.x - minX,
                y: p.y - minY,
              }));

              const newWidth = Math.max(maxX - minX, 1);
              const newHeight = Math.max(maxY - minY, 1);

              // Update element with new position, size, and normalized points
              // Cast to any because updateElement expects Partial<CanvasElement> 
              // but points is specific to LineElement
              updateElement(element.id, {
                x: element.x + minX,
                y: element.y + minY,
                width: newWidth,
                height: newHeight,
                points: normalizedPoints,
              } as Partial<LineElement>);

              onPointsChange?.(normalizedPoints);
            }

            return {
              isDragging: false,
              endpointIndex: null,
              startPosition: null,
              currentPoints: null,
            };
          });

          endpointDragRef.current = null;
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      },
      [isReadonly, isSelected, basePoints, screenToCanvas, updateElement, element.id, element.x, element.y, onPointsChange]
    );

    // Handle rotation start - use line center (midpoint between endpoints)
    const handleRotateStart = useCallback(
      (e: React.MouseEvent) => {
        // Calculate true center of the line
        const p1 = displayPoints[0];
        const p2 = displayPoints[displayPoints.length - 1];
        const lineCenterX = (p1.x + p2.x) / 2;
        const lineCenterY = (p1.y + p2.y) / 2;
        
        // Convert to canvas coordinates
        const centerX = displayBounds.x + lineCenterX;
        const centerY = displayBounds.y + lineCenterY;
        
        startRotate(
          { x: centerX, y: centerY },
          element.rotation ?? 0,
          e
        );
      },
      [startRotate, displayBounds, displayPoints, element.rotation]
    );

    // Combined mouse handlers
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        selectionHandlers.onClick(e);
        if (isSelected && !endpointDrag.isDragging) {
          dragHandlers.onMouseDown(e);
        }
      },
      [selectionHandlers, dragHandlers, isSelected, endpointDrag.isDragging]
    );

    // Styles
    const groupStyle: React.CSSProperties = {
      cursor: isDragging ? 'grabbing' : isSelected ? 'grab' : 'pointer',
      opacity: element.visible === false ? 0.5 : 1,
      ...style,
    };

    // Calculate endpoint handle positions in local coordinates
    const handlePositions = useMemo(() => {
      return displayPoints.map(p => ({ x: p.x, y: p.y }));
    }, [displayPoints]);

    // Calculate rotation handle position (perpendicular to line direction)
    const rotationHandlePos = useMemo(() => {
      if (displayPoints.length < 2) return { cx: 0, cy: 0, x1: 0, y1: 0, x2: 0, y2: 0 };
      
      const p1 = displayPoints[0];
      const p2 = displayPoints[displayPoints.length - 1];
      
      // Line center
      const centerX = (p1.x + p2.x) / 2;
      const centerY = (p1.y + p2.y) / 2;
      
      // Line direction vector
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Perpendicular unit vector (rotate 90 degrees counterclockwise)
      // This points "above" the line in standard orientation
      const perpX = -dy / length;
      const perpY = dx / length;
      
      // Handle position offset from center
      const handleX = centerX + perpX * ROTATION_HANDLE_OFFSET;
      const handleY = centerY + perpY * ROTATION_HANDLE_OFFSET;
      
      return {
        cx: handleX,
        cy: handleY,
        x1: centerX,
        y1: centerY,
        x2: handleX,
        y2: handleY,
      };
    }, [displayPoints]);

    return React.createElement(
      'g',
      {
        ref,
        className: cx('canvas-element canvas-line', className, {
          'canvas-element--selected': isSelected,
          'canvas-element--dragging': isDragging,
          'canvas-element--endpoint-dragging': endpointDrag.isDragging,
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
      // Render line with current points
      renderLine(displayPoints, endpointDrag.isDragging),

      // Endpoint handles (only when selected)
      isSelected && showHandles && !isReadonly &&
        handlePositions.map((pos, index) =>
          React.createElement('circle', {
            key: `endpoint-handle-${index}`,
            className: 'canvas-line__endpoint-handle',
            cx: pos.x,
            cy: pos.y,
            r: HANDLE_SIZE / 2 + 2,
            fill: theme.colors.handle.fill,
            stroke: theme.colors.handle.stroke,
            strokeWidth: 1.5,
            cursor: 'move',
            onMouseDown: (e: React.MouseEvent) => handleEndpointMouseDown(index, e),
          })
        ),

      // Rotation handle (perpendicular to line direction)
      isSelected && showHandles && enableRotation && !isReadonly &&
        React.createElement('g', {
          key: 'rotation-handle',
          className: 'canvas-line__rotation-handle',
        },
          // Line connecting to element center
          React.createElement('line', {
            x1: rotationHandlePos.x1,
            y1: rotationHandlePos.y1,
            x2: rotationHandlePos.x2,
            y2: rotationHandlePos.y2,
            stroke: theme.colors.selection.stroke,
            strokeWidth: 1,
            pointerEvents: 'none',
          }),
          // Rotation handle circle
          React.createElement('circle', {
            cx: rotationHandlePos.cx,
            cy: rotationHandlePos.cy,
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

LineBase.displayName = 'LineBase';

export default LineBase;
