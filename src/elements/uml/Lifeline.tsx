// Lifeline element component (UML sequence diagram) with inline label editing

import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { ElementBase } from '../ElementBase';
import { useTheme, useCanvas } from '@/core/context';
import type { LifelineElement as LifelineElementType } from '@/types/elements';

export interface LifelineProps {
  element: LifelineElementType;
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

export const Lifeline = forwardRef<SVGGElement, LifelineProps>(
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

    const { width, height, style, label } = element;

    const centerX = width / 2;
    const headerHeight = 40;
    const strokeColor = style?.stroke ?? theme.colors.element.stroke;
    const strokeWidth = style?.strokeWidth ?? theme.strokeWidth.normal;

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
        updateElement(element.id, { label: trimmedLabel } as Partial<LifelineElementType>);
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

    const renderContent = () => {
      return React.createElement(
        'g',
        { onDoubleClick: handleDoubleClick },
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

        // Label - either input or text
        isEditing
          ? React.createElement(
              'foreignObject',
              {
                x: 4,
                y: (headerHeight - 24) / 2,
                width: width - 8,
                height: 24,
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
                x: centerX,
                y: headerHeight / 2,
                textAnchor: 'middle',
                dominantBaseline: 'central',
                fill: theme.colors.text.primary,
                fontSize: theme.fontSize.sm,
                fontFamily: 'sans-serif',
                style: { pointerEvents: 'none' },
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

Lifeline.displayName = 'Lifeline';

export default Lifeline;
