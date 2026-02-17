// Text element component

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';
import type { TextElement as TextElementType } from '@/types/elements';

export interface TextProps extends ElementRenderProps {
  element: TextElementType;
}

const TextRender: React.FC<TextProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style, text = '', fontSize, fontFamily, fontWeight, textAlign } = element;

  // Calculate text anchor based on alignment
  const getTextAnchor = (): 'start' | 'middle' | 'end' => {
    switch (textAlign) {
      case 'right':
        return 'end';
      case 'center':
        return 'middle';
      default:
        return 'start';
    }
  };

  // Calculate x position based on alignment
  const getXPosition = (): number => {
    switch (textAlign) {
      case 'right':
        return width;
      case 'center':
        return width / 2;
      default:
        return 0;
    }
  };

  return React.createElement(
    'g',
    null,
    // Background (optional, for selection area)
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
        fill: style?.fill ?? theme.colors.text.primary,
        fontSize: fontSize ?? theme.fontSize.md,
        fontFamily: fontFamily ?? 'sans-serif',
        fontWeight: fontWeight ?? 'normal',
        opacity: style?.opacity ?? 1,
      },
      text
    )
  );
};

export const TextElement = withElementBehavior(TextRender);

TextElement.displayName = 'TextElement';

export default TextElement;
