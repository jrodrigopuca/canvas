// Theme Context
// Manages theming (light/dark/custom)

import React, { createContext, useContext, useMemo } from 'react';
import type { Theme } from '@/types/theme';
import { deepMerge } from '@/core/utils';

// Default light theme
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#ffffff',
    surface: '#f8f9fa',
    border: '#dee2e6',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
    selection: {
      fill: 'rgba(59, 130, 246, 0.1)',
      stroke: '#3b82f6',
    },
    element: {
      fill: '#ffffff',
      stroke: '#212529',
      hover: '#f1f5f9',
      active: '#e2e8f0',
    },
    handle: {
      fill: '#ffffff',
      stroke: '#3b82f6',
    },
    grid: {
      line: '#e5e7eb',
      dot: '#d1d5db',
    },
    connection: {
      line: '#64748b',
      arrow: '#64748b',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 8,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  },
  strokeWidth: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    element: '0 2px 4px rgba(0,0,0,0.1)',
    handle: '0 1px 2px rgba(0,0,0,0.1)',
  },
};

// Default dark theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#1e1e1e',
    surface: '#252526',
    border: '#3c3c3c',
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      disabled: '#5a5a5a',
    },
    selection: {
      fill: 'rgba(59, 130, 246, 0.2)',
      stroke: '#60a5fa',
    },
    element: {
      fill: '#2d2d2d',
      stroke: '#ffffff',
      hover: '#383838',
      active: '#454545',
    },
    handle: {
      fill: '#2d2d2d',
      stroke: '#60a5fa',
    },
    grid: {
      line: '#333333',
      dot: '#444444',
    },
    connection: {
      line: '#94a3b8',
      arrow: '#94a3b8',
    },
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  fontSize: lightTheme.fontSize,
  strokeWidth: lightTheme.strokeWidth,
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 15px rgba(0,0,0,0.5)',
    element: '0 2px 4px rgba(0,0,0,0.3)',
    handle: '0 1px 2px rgba(0,0,0,0.3)',
  },
};

// Context value interface
interface ThemeContextValue {
  theme: Theme;
  themeName: 'light' | 'dark' | 'custom';
}

// Create context with default light theme
const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  themeName: 'light',
});

// Hook to use theme
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark' | Theme;
}

// Theme Provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme = 'light' }) => {
  const value = useMemo<ThemeContextValue>(() => {
    if (theme === 'light') {
      return { theme: lightTheme, themeName: 'light' };
    }
    if (theme === 'dark') {
      return { theme: darkTheme, themeName: 'dark' };
    }
    // Custom theme: merge with light theme as base
    return {
      theme: deepMerge(lightTheme, theme) as Theme,
      themeName: 'custom',
    };
  }, [theme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
};

// CSS custom properties generator
export const getThemeCSSVariables = (theme: Theme): Record<string, string> => {
  return {
    '--canvas-bg': theme.colors.background,
    '--canvas-surface': theme.colors.surface,
    '--canvas-border': theme.colors.border,
    '--canvas-text-primary': theme.colors.text.primary,
    '--canvas-text-secondary': theme.colors.text.secondary,
    '--canvas-text-disabled': theme.colors.text.disabled,
    '--canvas-selection-fill': theme.colors.selection.fill,
    '--canvas-selection-stroke': theme.colors.selection.stroke,
    '--canvas-element-fill': theme.colors.element.fill,
    '--canvas-element-stroke': theme.colors.element.stroke,
    '--canvas-element-hover': theme.colors.element.hover,
    '--canvas-element-active': theme.colors.element.active,
    '--canvas-handle-fill': theme.colors.handle.fill,
    '--canvas-handle-stroke': theme.colors.handle.stroke,
    '--canvas-grid-line': theme.colors.grid.line,
    '--canvas-grid-dot': theme.colors.grid.dot,
    '--canvas-connection-line': theme.colors.connection.line,
    '--canvas-connection-arrow': theme.colors.connection.arrow,
    '--canvas-spacing-xs': `${theme.spacing.xs}px`,
    '--canvas-spacing-sm': `${theme.spacing.sm}px`,
    '--canvas-spacing-md': `${theme.spacing.md}px`,
    '--canvas-spacing-lg': `${theme.spacing.lg}px`,
    '--canvas-spacing-xl': `${theme.spacing.xl}px`,
    '--canvas-radius-sm': `${theme.borderRadius.sm}px`,
    '--canvas-radius-md': `${theme.borderRadius.md}px`,
    '--canvas-radius-lg': `${theme.borderRadius.lg}px`,
    '--canvas-font-xs': `${theme.fontSize.xs}px`,
    '--canvas-font-sm': `${theme.fontSize.sm}px`,
    '--canvas-font-md': `${theme.fontSize.md}px`,
    '--canvas-font-lg': `${theme.fontSize.lg}px`,
    '--canvas-font-xl': `${theme.fontSize.xl}px`,
    '--canvas-stroke-thin': `${theme.strokeWidth.thin}px`,
    '--canvas-stroke-normal': `${theme.strokeWidth.normal}px`,
    '--canvas-stroke-thick': `${theme.strokeWidth.thick}px`,
    '--canvas-shadow-sm': theme.shadows.sm,
    '--canvas-shadow-md': theme.shadows.md,
    '--canvas-shadow-lg': theme.shadows.lg,
    '--canvas-shadow-element': theme.shadows.element,
    '--canvas-shadow-handle': theme.shadows.handle,
  };
};

export { ThemeContext };
