// ActivationBar element component (UML sequence diagram activation)

import React from 'react';
import { withElementBehavior, type ElementRenderProps } from '../withElementBehavior';
import { useTheme } from '@/core/context';

export interface ActivationBarProps extends ElementRenderProps {}

const ActivationBarRender: React.FC<ActivationBarProps> = ({ element }) => {
  const { theme } = useTheme();
  const { width, height, style } = element;

  return React.createElement('rect', {
    width: width || 12, // Default narrow width
    height,
    fill: style?.fill ?? theme.colors.element.fill,
    stroke: style?.stroke ?? theme.colors.element.stroke,
    strokeWidth: style?.strokeWidth ?? theme.strokeWidth.normal,
  });
};

export const ActivationBar = withElementBehavior(ActivationBarRender);

ActivationBar.displayName = 'ActivationBar';

export default ActivationBar;
