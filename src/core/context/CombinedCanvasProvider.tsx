// Combined Canvas Provider
// Composes all context providers into a single provider

import React from 'react';
import type { CanvasElement, Connection } from '@/types/elements';
import type { CanvasConfig, ViewportState } from '@/types/canvas';
import type { Theme } from '@/types/theme';
import { ThemeProvider } from './ThemeContext';
import { ViewportProvider } from './ViewportContext';
import { SelectionProvider } from './SelectionContext';
import { HistoryProvider } from './HistoryContext';
import { CanvasProvider as CanvasStateProvider } from './CanvasContext';

export interface CombinedCanvasProviderProps {
  children: React.ReactNode;

  // Initial data
  initialElements?: CanvasElement[];
  initialConnections?: Connection[];

  // Configuration
  config?: Partial<CanvasConfig>;
  theme?: 'light' | 'dark' | Theme;

  // Viewport settings
  initialViewport?: Partial<ViewportState>;

  // History settings
  maxHistorySize?: number;

  // Callbacks
  onElementsChange?: (elements: CanvasElement[], connections: Connection[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;

  // Controlled mode support
  elements?: CanvasElement[];
  connections?: Connection[];
  selectedIds?: string[];
}

/**
 * Combined provider that composes all canvas contexts
 * Use this for full-featured canvas components
 */
export const CombinedCanvasProvider: React.FC<CombinedCanvasProviderProps> = ({
  children,
  initialElements = [],
  initialConnections = [],
  config,
  theme = 'light',
  initialViewport,
  maxHistorySize = 50,
  onElementsChange,
  onSelectionChange,
  elements,
  connections,
  selectedIds,
}) => {
  // Use controlled elements if provided, otherwise use initial
  const effectiveElements = elements ?? initialElements;
  const effectiveConnections = connections ?? initialConnections;

  return (
    <ThemeProvider theme={theme}>
      <ViewportProvider initialViewport={initialViewport}>
        <SelectionProvider
          initialSelection={selectedIds}
          onSelectionChange={onSelectionChange}
        >
          <HistoryProvider
            initialElements={effectiveElements}
            initialConnections={effectiveConnections}
            maxHistorySize={maxHistorySize}
          >
            <CanvasStateProvider
              initialElements={effectiveElements}
              initialConnections={effectiveConnections}
              config={config}
              onChange={onElementsChange}
            >
              {children}
            </CanvasStateProvider>
          </HistoryProvider>
        </SelectionProvider>
      </ViewportProvider>
    </ThemeProvider>
  );
};

export default CombinedCanvasProvider;
