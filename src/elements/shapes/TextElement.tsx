// Text element component with inline editing support

import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { ElementBase } from '../ElementBase';
import { useTheme, useCanvas } from '@/core/context';
import type { TextElement as TextElementType } from '@/types/elements';

export interface TextProps {
  element: TextElementType;
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
  onTextChange?: (text: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TextElement = forwardRef<SVGGElement, TextProps>(
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
      onTextChange,
      className,
      style,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { updateElement } = useCanvas();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(element.text ?? '');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { width, height, style: elementStyle, text = '', fontSize, fontFamily, fontWeight, textAlign } = element;

    // Measure text dimensions using SVG text element
    const measureText = useCallback((textContent: string): { width: number; height: number } => {
      // Create temporary SVG to measure text
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.position = 'absolute';
      svg.style.visibility = 'hidden';
      svg.style.pointerEvents = 'none';
      document.body.appendChild(svg);

      const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('font-size', String(fontSize ?? theme.fontSize.md));
      textEl.setAttribute('font-family', fontFamily ?? 'sans-serif');
      textEl.setAttribute('font-weight', fontWeight ?? 'normal');
      
      // Handle multi-line text
      const lines = textContent.split('\n');
      const lineHeight = (fontSize ?? theme.fontSize.md) * 1.2;
      
      let maxWidth = 0;
      lines.forEach((line, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = line || ' '; // Use space for empty lines
        tspan.setAttribute('x', '0');
        tspan.setAttribute('dy', index === 0 ? '0' : String(lineHeight));
        textEl.appendChild(tspan);
      });
      
      svg.appendChild(textEl);
      
      const bbox = textEl.getBBox();
      maxWidth = bbox.width;
      const totalHeight = lines.length * lineHeight;
      
      document.body.removeChild(svg);
      
      // Add padding
      const padding = 16;
      return {
        width: Math.max(maxWidth + padding, 40), // Minimum width
        height: Math.max(totalHeight + padding, 24), // Minimum height
      };
    }, [fontSize, fontFamily, fontWeight, theme.fontSize.md]);

    // Calculate text anchor based on alignment
    const getTextAnchor = useCallback((): 'start' | 'middle' | 'end' => {
      switch (textAlign) {
        case 'right':
          return 'end';
        case 'center':
          return 'middle';
        default:
          return 'start';
      }
    }, [textAlign]);

    // Calculate x position based on alignment
    const getXPosition = useCallback((): number => {
      switch (textAlign) {
        case 'right':
          return width;
        case 'center':
          return width / 2;
        default:
          return 0;
      }
    }, [textAlign, width]);

    // Handle double click to start editing
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
      if (element.locked || disabled) return;
      e.stopPropagation();
      e.preventDefault();
      setEditText(text);
      setIsEditing(true);
    }, [element.locked, disabled, text]);

    // Save text and exit editing mode, auto-resize to fit text
    const saveAndExit = useCallback(() => {
      const trimmedText = editText.trim();
      if (trimmedText !== text || trimmedText !== '') {
        // Measure the new text dimensions
        const newSize = measureText(trimmedText);
        
        // Update element with new text and dimensions
        updateElement(element.id, { 
          text: trimmedText,
          width: newSize.width,
          height: newSize.height,
        } as Partial<TextElementType>);
        
        onTextChange?.(trimmedText);
      }
      setIsEditing(false);
    }, [editText, text, measureText, updateElement, element.id, onTextChange]);

    // Cancel editing
    const cancelEdit = useCallback(() => {
      setEditText(text);
      setIsEditing(false);
    }, [text]);

    // Handle key events in textarea
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveAndExit();
      }
      // Shift+Enter allows multi-line
      e.stopPropagation();
    }, [cancelEdit, saveAndExit]);

    // Focus input when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    // Render text content
    const renderContent = () => {
      if (isEditing) {
        // Use foreignObject to embed HTML input for editing
        return React.createElement(
          'foreignObject',
          {
            x: 0,
            y: 0,
            width: width,
            height: height,
          },
          React.createElement(
            'div',
            {
              xmlns: 'http://www.w3.org/1999/xhtml',
              style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
              },
            },
            React.createElement('textarea', {
              ref: inputRef,
              value: editText,
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value),
              onBlur: saveAndExit,
              onKeyDown: handleKeyDown,
              style: {
                width: '100%',
                height: '100%',
                padding: '4px',
                border: `2px solid ${theme.colors.selection.stroke}`,
                borderRadius: '2px',
                outline: 'none',
                resize: 'none',
                backgroundColor: theme.colors.background,
                color: elementStyle?.fill ?? theme.colors.text.primary,
                fontSize: fontSize ?? theme.fontSize.md,
                fontFamily: fontFamily ?? 'sans-serif',
                fontWeight: fontWeight ?? 'normal',
                textAlign: textAlign ?? 'left',
                boxSizing: 'border-box',
              },
            })
          )
        );
      }

      // Normal text display
      return React.createElement(
        'g',
        { onDoubleClick: handleDoubleClick },
        // Background (for selection area)
        React.createElement('rect', {
          width,
          height,
          fill: 'transparent',
        }),
        // Text
        React.createElement(
          'text',
          {
            x: getXPosition(),
            y: height / 2,
            dominantBaseline: 'central',
            textAnchor: getTextAnchor(),
            fill: elementStyle?.fill ?? theme.colors.text.primary,
            fontSize: fontSize ?? theme.fontSize.md,
            fontFamily: fontFamily ?? 'sans-serif',
            fontWeight: fontWeight ?? 'normal',
            opacity: elementStyle?.opacity ?? 1,
            style: { pointerEvents: 'none' },
          },
          text
        )
      );
    };

    return React.createElement(
      ElementBase,
      {
        ref,
        element,
        children: renderContent(),
        disabled: disabled || isEditing, // Disable drag/resize while editing
        showHandles: showHandles && !isEditing,
        enableRotation,
        className,
        style,
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

TextElement.displayName = 'TextElement';

export default TextElement;
