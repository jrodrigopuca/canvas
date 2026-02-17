// Canvas component
// Main component that combines providers and drawing canvas

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CanvasElement, Connection, ElementType } from '@/types/elements';
import type { CanvasConfig, ViewportState } from '@/types/canvas';
import type { Theme } from '@/types/theme';
import { CombinedCanvasProvider, useCanvas, useSelection, useViewport } from '@/core/context';
import { useCanvasActions, useCanvasKeyboardShortcuts } from '@/core/hooks';
import { DrawingCanvas } from './DrawingCanvas';
import { cx } from '@/core/utils';

export interface CanvasProps {
  // Data (controlled mode)
  elements?: CanvasElement[];
  connections?: Connection[];
  selectedIds?: string[];

  // Data (uncontrolled mode)
  defaultElements?: CanvasElement[];
  defaultConnections?: Connection[];

  // Configuration
  width?: number;
  height?: number;
  config?: Partial<CanvasConfig>;
  theme?: 'light' | 'dark' | Theme;
  readonly?: boolean;

  // Viewport settings
  initialViewport?: Partial<ViewportState>;

  // History settings
  maxHistorySize?: number;

  // Features
  showGrid?: boolean;
  gridSize?: number;
  enableKeyboardShortcuts?: boolean;

  // Callbacks
  onChange?: (elements: CanvasElement[], connections: Connection[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onElementAdd?: (element: CanvasElement) => void;
  onElementUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  onElementRemove?: (id: string) => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // Children (for custom overlays)
  children?: React.ReactNode;
}

export interface CanvasRef {
  // Element operations
  addElement: (element: Omit<CanvasElement, 'id'> & { id?: string }) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  getElement: (id: string) => CanvasElement | undefined;
  getElementsByType: (type: ElementType) => CanvasElement[];

  // Selection
  select: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  getSelectedIds: () => string[];

  // Viewport
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  resetViewport: () => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Export
  toJSON: () => { elements: CanvasElement[]; connections: Connection[] };
  toSVG: () => string;
}

// Inner component that uses the contexts
const CanvasInner = forwardRef<CanvasRef, CanvasProps>(
  (
    {
      width,
      height,
      readonly = false,
      showGrid,
      gridSize,
      enableKeyboardShortcuts = true,
      className,
      style,
      children,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const canvas = useCanvas();
    const selection = useSelection();
    const viewport = useViewport();
    const actions = useCanvasActions();

    // Keyboard shortcuts
    useCanvasKeyboardShortcuts(
      enableKeyboardShortcuts
        ? {
            undo: actions.undo,
            redo: actions.redo,
            delete: actions.removeSelected,
            selectAll: () => selection.selectAll(canvas.elements.map((el) => el.id)),
            copy: actions.copy,
            paste: actions.paste,
            cut: actions.cut,
            escape: selection.clearSelection,
            zoomIn: viewport.zoomIn,
            zoomOut: viewport.zoomOut,
            resetZoom: viewport.resetViewport,
          }
        : {}
    );

    // Expose ref API
    useImperativeHandle(
      ref,
      () => ({
        addElement: actions.addElement,
        updateElement: actions.updateElement,
        removeElement: actions.removeElement,
        getElement: canvas.getElementById,
        getElementsByType: canvas.getElementsByType,
        select: selection.select,
        selectMultiple: selection.selectMultiple,
        clearSelection: selection.clearSelection,
        getSelectedIds: () => selection.selectedIds,
        zoomIn: viewport.zoomIn,
        zoomOut: viewport.zoomOut,
        setZoom: viewport.setZoom,
        resetViewport: viewport.resetViewport,
        undo: actions.undo,
        redo: actions.redo,
        canUndo: actions.canUndo,
        canRedo: actions.canRedo,
        toJSON: () => ({
          elements: canvas.elements,
          connections: canvas.connections,
        }),
        toSVG: () => svgRef.current?.outerHTML ?? '',
      }),
      [canvas, selection, viewport, actions]
    );

    return (
      <div
        className={cx('canvas-container', className, {
          'canvas-container--readonly': readonly,
        })}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        tabIndex={0}
      >
        <DrawingCanvas
          ref={svgRef}
          width={width}
          height={height}
          showGrid={showGrid}
          gridSize={gridSize}
        />
        {children}
      </div>
    );
  }
);

CanvasInner.displayName = 'CanvasInner';

// Main Canvas component with providers
export const Canvas = forwardRef<CanvasRef, CanvasProps>(
  (
    {
      elements,
      connections,
      selectedIds,
      defaultElements = [],
      defaultConnections = [],
      config,
      theme = 'light',
      initialViewport,
      maxHistorySize,
      onChange,
      onSelectionChange,
      ...innerProps
    },
    ref
  ) => {
    return (
      <CombinedCanvasProvider
        initialElements={defaultElements}
        initialConnections={defaultConnections}
        elements={elements}
        connections={connections}
        selectedIds={selectedIds}
        config={config}
        theme={theme}
        initialViewport={initialViewport}
        maxHistorySize={maxHistorySize}
        onElementsChange={onChange}
        onSelectionChange={onSelectionChange}
      >
        <CanvasInner {...innerProps} ref={ref} />
      </CombinedCanvasProvider>
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas;
