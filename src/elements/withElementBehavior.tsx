// withElementBehavior HOC
// Wraps SVG elements with canvas behavior (selection, drag, resize)

import React, { ComponentType, forwardRef } from 'react';
import type { CanvasElement } from '@/types/elements';
import { ElementBase } from './ElementBase';

/**
 * Props that the wrapped component receives
 */
export interface ElementRenderProps {
  element: CanvasElement;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
}

/**
 * Props for the wrapped component with element behavior
 */
export interface WithElementBehaviorProps {
  element: CanvasElement;
  disabled?: boolean;
  showHandles?: boolean;
  onSelect?: (selected: boolean) => void;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  onResizeStart?: () => void;
  onResize?: (width: number, height: number, x: number, y: number) => void;
  onResizeEnd?: (width: number, height: number, x: number, y: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * HOC that wraps a render function with element behavior
 * 
 * @example
 * const MyElement = withElementBehavior(({ element }) => (
 *   <rect
 *     width={element.width}
 *     height={element.height}
 *     fill={element.style?.fill ?? '#fff'}
 *   />
 * ));
 */
export function withElementBehavior<P extends ElementRenderProps>(
  RenderComponent: ComponentType<P>
) {
  type WrapperProps = WithElementBehaviorProps & Omit<P, keyof ElementRenderProps>;
  
  const WrappedComponent = forwardRef<SVGGElement, WrapperProps>((allProps, ref) => {
    // Destructure with explicit casting to avoid TypeScript inference issues
    const typedProps = allProps as WrapperProps;
    const element = typedProps.element;
    const disabled = typedProps.disabled;
    const showHandles = typedProps.showHandles;
    const onSelect = typedProps.onSelect;
    const onDragStart = typedProps.onDragStart;
    const onDrag = typedProps.onDrag;
    const onDragEnd = typedProps.onDragEnd;
    const onResizeStart = typedProps.onResizeStart;
    const onResize = typedProps.onResize;
    const onResizeEnd = typedProps.onResizeEnd;
    const className = typedProps.className;
    const style = typedProps.style;
    
    // Remove WithElementBehaviorProps keys to get remaining props for RenderComponent
    const {
      element: _e, disabled: _d, showHandles: _sh, onSelect: _os,
      onDragStart: _ods, onDrag: _od, onDragEnd: _ode,
      onResizeStart: _ors, onResize: _or, onResizeEnd: _ore,
      className: _c, style: _s,
      ...rest
    } = typedProps;

    // Track interaction states via ElementBase
    const [interactionState, setInteractionState] = React.useState({
      isSelected: false,
      isDragging: false,
      isResizing: false,
    });

    const handleSelect = React.useCallback((selected: boolean) => {
      setInteractionState((prev) => ({ ...prev, isSelected: selected }));
      onSelect?.(selected);
    }, [onSelect]);

    const handleDragStart = React.useCallback(() => {
      setInteractionState((prev) => ({ ...prev, isDragging: true }));
      onDragStart?.();
    }, [onDragStart]);

    const handleDragEnd = React.useCallback((x: number, y: number) => {
      setInteractionState((prev) => ({ ...prev, isDragging: false }));
      onDragEnd?.(x, y);
    }, [onDragEnd]);

    const handleResizeStart = React.useCallback(() => {
      setInteractionState((prev) => ({ ...prev, isResizing: true }));
      onResizeStart?.();
    }, [onResizeStart]);

    const handleResizeEnd = React.useCallback((w: number, h: number, x: number, y: number) => {
      setInteractionState((prev) => ({ ...prev, isResizing: false }));
      onResizeEnd?.(w, h, x, y);
    }, [onResizeEnd]);

    const renderProps = {
      element,
      ...interactionState,
    };

    return (
      <ElementBase
        ref={ref}
        element={element}
        disabled={disabled}
        showHandles={showHandles}
        className={className}
        style={style}
        onSelect={handleSelect}
        onDragStart={handleDragStart}
        onDrag={onDrag}
        onDragEnd={handleDragEnd}
        onResizeStart={handleResizeStart}
        onResize={onResize}
        onResizeEnd={handleResizeEnd}
      >
        <RenderComponent {...renderProps as P} {...rest} />
      </ElementBase>
    );
  });

  WrappedComponent.displayName = `withElementBehavior(${
    RenderComponent.displayName || RenderComponent.name || 'Component'
  })`;

  return WrappedComponent;
}

export default withElementBehavior;
