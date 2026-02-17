// Viewport Context
// Manages zoom, pan, and coordinate transformations

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { Point, Bounds } from '@/types/elements';
import type { ViewportState } from '@/types/canvas';

// Default viewport state
const defaultViewport: ViewportState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  minZoom: 0.1,
  maxZoom: 5,
};

// Action types
type ViewportAction =
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'ZOOM_TO_FIT'; payload: { bounds: Bounds; padding?: number } }
  | { type: 'SET_PAN'; payload: Point }
  | { type: 'PAN_BY'; payload: Point }
  | { type: 'RESET' }
  | { type: 'SET_CONSTRAINTS'; payload: { minZoom?: number; maxZoom?: number } };

// Reducer
const viewportReducer = (state: ViewportState, action: ViewportAction): ViewportState => {
  switch (action.type) {
    case 'SET_ZOOM': {
      const zoom = Math.max(state.minZoom, Math.min(state.maxZoom, action.payload));
      return { ...state, zoom };
    }

    case 'ZOOM_IN': {
      const zoom = Math.min(state.maxZoom, state.zoom * 1.2);
      return { ...state, zoom };
    }

    case 'ZOOM_OUT': {
      const zoom = Math.max(state.minZoom, state.zoom / 1.2);
      return { ...state, zoom };
    }

    case 'ZOOM_TO_FIT': {
      const { bounds, padding = 50 } = action.payload;
      // Calculate zoom to fit bounds with padding (using x, y, width, height format)
      const zoom = Math.max(state.minZoom, Math.min(state.maxZoom, 1));
      const pan = {
        x: -(bounds.x - padding),
        y: -(bounds.y - padding),
      };
      return { ...state, zoom, pan };
    }

    case 'SET_PAN':
      return { ...state, pan: action.payload };

    case 'PAN_BY':
      return {
        ...state,
        pan: {
          x: state.pan.x + action.payload.x,
          y: state.pan.y + action.payload.y,
        },
      };

    case 'RESET':
      return { ...defaultViewport, minZoom: state.minZoom, maxZoom: state.maxZoom };

    case 'SET_CONSTRAINTS':
      return {
        ...state,
        minZoom: action.payload.minZoom ?? state.minZoom,
        maxZoom: action.payload.maxZoom ?? state.maxZoom,
      };

    default:
      return state;
  }
};

// Context value interface
interface ViewportContextValue {
  // State
  viewport: ViewportState;

  // Actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: (bounds: Bounds, padding?: number) => void;
  setPan: (pan: Point) => void;
  panBy: (delta: Point) => void;
  resetViewport: () => void;
  setConstraints: (constraints: { minZoom?: number; maxZoom?: number }) => void;

  // Coordinate transformations
  screenToCanvas: (point: Point) => Point;
  canvasToScreen: (point: Point) => Point;
}

// Create context
const ViewportContext = createContext<ViewportContextValue | null>(null);

// Hook to use viewport
export const useViewport = (): ViewportContextValue => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
};

// Provider props
interface ViewportProviderProps {
  children: React.ReactNode;
  initialViewport?: Partial<ViewportState>;
}

// Viewport Provider component
export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  initialViewport,
}) => {
  const [viewport, dispatch] = useReducer(viewportReducer, {
    ...defaultViewport,
    ...initialViewport,
  });

  // Actions
  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const zoomIn = useCallback(() => {
    dispatch({ type: 'ZOOM_IN' });
  }, []);

  const zoomOut = useCallback(() => {
    dispatch({ type: 'ZOOM_OUT' });
  }, []);

  const zoomToFit = useCallback((bounds: Bounds, padding?: number) => {
    dispatch({ type: 'ZOOM_TO_FIT', payload: { bounds, padding } });
  }, []);

  const setPan = useCallback((pan: Point) => {
    dispatch({ type: 'SET_PAN', payload: pan });
  }, []);

  const panBy = useCallback((delta: Point) => {
    dispatch({ type: 'PAN_BY', payload: delta });
  }, []);

  const resetViewport = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setConstraints = useCallback(
    (constraints: { minZoom?: number; maxZoom?: number }) => {
      dispatch({ type: 'SET_CONSTRAINTS', payload: constraints });
    },
    []
  );

  // Coordinate transformations
  const screenToCanvas = useCallback(
    (point: Point): Point => {
      return {
        x: (point.x - viewport.pan.x) / viewport.zoom,
        y: (point.y - viewport.pan.y) / viewport.zoom,
      };
    },
    [viewport.zoom, viewport.pan]
  );

  const canvasToScreen = useCallback(
    (point: Point): Point => {
      return {
        x: point.x * viewport.zoom + viewport.pan.x,
        y: point.y * viewport.zoom + viewport.pan.y,
      };
    },
    [viewport.zoom, viewport.pan]
  );

  const value = useMemo<ViewportContextValue>(
    () => ({
      viewport,
      setZoom,
      zoomIn,
      zoomOut,
      zoomToFit,
      setPan,
      panBy,
      resetViewport,
      setConstraints,
      screenToCanvas,
      canvasToScreen,
    }),
    [
      viewport,
      setZoom,
      zoomIn,
      zoomOut,
      zoomToFit,
      setPan,
      panBy,
      resetViewport,
      setConstraints,
      screenToCanvas,
      canvasToScreen,
    ]
  );

  return React.createElement(ViewportContext.Provider, { value }, children);
};

export { ViewportContext };
