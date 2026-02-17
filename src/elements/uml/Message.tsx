// Message element component (UML sequence diagram arrow)

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';
import type { MessageElement as MessageElementType, MessageType } from '@/types/elements';

export interface MessageProps extends ElementRenderProps {
  element: MessageElementType;
}

const MessageRender: React.FC<MessageProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style, label, messageType = 'sync' } = element;

  const strokeColor = style?.stroke ?? theme.colors.connection.line;
  const strokeWidth = style?.strokeWidth ?? theme.strokeWidth.normal;
  const arrowSize = 10;

  // Line from left to right
  const y = height / 2;

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

  return React.createElement(
    'g',
    null,
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

    // Label above the line
    label &&
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
        },
        label
      )
  );
};

export const Message = withElementBehavior(MessageRender);

Message.displayName = 'Message';

export default Message;
