// Message element component (UML sequence diagram arrow) with inline label editing

import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { ElementBase } from '../ElementBase';
import { useTheme, useCanvas } from '@/core/context';
import type { MessageElement as MessageElementType } from '@/types/elements';

export interface MessageProps {
  element: MessageElementType;
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
  onLabelChange?: (label: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Message = forwardRef<SVGGElement, MessageProps>(
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
      onResizeStart,
      onResize,
      onResizeEnd,
      onRotateStart,
      onRotate,
      onRotateEnd,
      onLabelChange,
      className,
      style: propStyle,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { updateElement } = useCanvas();
    const [isEditing, setIsEditing] = useState(false);
    const [editLabel, setEditLabel] = useState(element.label ?? '');
    const inputRef = useRef<HTMLInputElement>(null);

    const { width, height, style, label, messageType = 'sync' } = element;

    const strokeColor = style?.stroke ?? theme.colors.connection.line;
    const strokeWidth = style?.strokeWidth ?? theme.strokeWidth.normal;
    const arrowSize = 10;

    // Line from left to right
    const y = height / 2;

    // Handle double click to start editing
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
      if (element.locked || disabled) return;
      e.stopPropagation();
      e.preventDefault();
      setEditLabel(label ?? '');
      setIsEditing(true);
    }, [element.locked, disabled, label]);

    // Save and exit editing
    const saveAndExit = useCallback(() => {
      const trimmedLabel = editLabel.trim();
      if (trimmedLabel !== label) {
        updateElement(element.id, { label: trimmedLabel } as Partial<MessageElementType>);
        onLabelChange?.(trimmedLabel);
      }
      setIsEditing(false);
    }, [editLabel, label, updateElement, element.id, onLabelChange]);

    // Cancel editing
    const cancelEdit = useCallback(() => {
      setEditLabel(label ?? '');
      setIsEditing(false);
    }, [label]);

    // Handle key events
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        saveAndExit();
      }
      e.stopPropagation();
    }, [cancelEdit, saveAndExit]);

    // Focus input when editing
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    // Get stroke style based on message type
    const getStrokeDasharray = (): string | undefined => {
      switch (messageType) {
        case 'return':
          return '8 4';
        case 'create':
          return '4 2';
        default:
          return undefined;
      }
    };

    // Get arrow marker
    const renderArrow = () => {
      if (messageType === 'async') {
        // Open arrow
        return React.createElement('polyline', {
          points: `${width - arrowSize},${y - arrowSize / 2} ${width},${y} ${width - arrowSize},${y + arrowSize / 2}`,
          fill: 'none',
          stroke: strokeColor,
          strokeWidth,
        });
      }

      // Filled arrow for sync and others
      return React.createElement('polygon', {
        points: `${width},${y} ${width - arrowSize},${y - arrowSize / 2} ${width - arrowSize},${y + arrowSize / 2}`,
        fill: strokeColor,
        stroke: strokeColor,
        strokeWidth: 1,
      });
    };

    const renderContent = () => {
      return React.createElement(
        'g',
        { onDoubleClick: handleDoubleClick },
        // Invisible background for selection
        React.createElement('rect', {
          width,
          height,
          fill: 'transparent',
        }),

        // Main line
        React.createElement('line', {
          x1: 0,
          y1: y,
          x2: width - (messageType === 'async' ? 0 : arrowSize / 2),
          y2: y,
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: getStrokeDasharray(),
        }),

        // Arrow head
        renderArrow(),

        // Label - either input or text
        isEditing
          ? React.createElement(
              'foreignObject',
              {
                x: width / 4,
                y: y - 24,
                width: width / 2,
                height: 20,
              },
              React.createElement('input', {
                ref: inputRef,
                type: 'text',
                value: editLabel,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditLabel(e.target.value),
                onBlur: saveAndExit,
                onKeyDown: handleKeyDown,
                style: {
                  width: '100%',
                  height: '100%',
                  padding: '2px 4px',
                  border: `2px solid ${theme.colors.selection.stroke}`,
                  borderRadius: '2px',
                  outline: 'none',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSize.sm,
                  fontFamily: 'sans-serif',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                },
              })
            )
          : label &&
            React.createElement(
              'text',
              {
                x: width / 2,
                y: y - 8,
                textAnchor: 'middle',
                dominantBaseline: 'text-bottom',
                fill: theme.colors.text.primary,
                fontSize: theme.fontSize.sm,
                fontFamily: 'sans-serif',
                style: { pointerEvents: 'none' },
              },
              label
            )
      );
    };

    return React.createElement(
      ElementBase,
      {
        ref,
        element,
        children: renderContent(),
        disabled: disabled || isEditing,
        showHandles: showHandles && !isEditing,
        enableRotation,
        className,
        style: propStyle,
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
      }
    );
  }
);

Message.displayName = 'Message';

export default Message;
