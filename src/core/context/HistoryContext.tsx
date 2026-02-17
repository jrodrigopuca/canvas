// History Context
// Manages undo/redo history stack

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { CanvasElement, Connection } from '@/types/elements';

// A snapshot of canvas state
export interface CanvasSnapshot {
  elements: CanvasElement[];
  connections: Connection[];
  timestamp: number;
}

// History state
interface HistoryState {
  past: CanvasSnapshot[];
  present: CanvasSnapshot;
  future: CanvasSnapshot[];
  maxHistorySize: number;
}

// Action types
type HistoryAction =
  | { type: 'PUSH'; payload: CanvasSnapshot }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' }
  | { type: 'SET_PRESENT'; payload: CanvasSnapshot }
  | { type: 'SET_MAX_SIZE'; payload: number };

// Create initial snapshot
const createEmptySnapshot = (): CanvasSnapshot => ({
  elements: [],
  connections: [],
  timestamp: Date.now(),
});

// Reducer
const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'PUSH': {
      const newPast = [...state.past, state.present];
      // Limit history size
      if (newPast.length > state.maxHistorySize) {
        newPast.shift();
      }
      return {
        ...state,
        past: newPast,
        present: action.payload,
        future: [], // Clear future on new action
      };
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }

    case 'CLEAR':
      return {
        ...state,
        past: [],
        present: state.present,
        future: [],
      };

    case 'SET_PRESENT':
      return {
        ...state,
        present: action.payload,
      };

    case 'SET_MAX_SIZE':
      return {
        ...state,
        maxHistorySize: action.payload,
      };

    default:
      return state;
  }
};

// Context value interface
interface HistoryContextValue {
  // State
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
  futureSize: number;
  present: CanvasSnapshot;

  // Actions
  pushState: (elements: CanvasElement[], connections: Connection[]) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  setPresent: (elements: CanvasElement[], connections: Connection[]) => void;
  setMaxHistorySize: (size: number) => void;
}

// Create context
const HistoryContext = createContext<HistoryContextValue | null>(null);

// Hook to use history
export const useHistory = (): HistoryContextValue => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

// Provider props
interface HistoryProviderProps {
  children: React.ReactNode;
  initialElements?: CanvasElement[];
  initialConnections?: Connection[];
  maxHistorySize?: number;
  onStateChange?: (elements: CanvasElement[], connections: Connection[]) => void;
}

// History Provider component
export const HistoryProvider: React.FC<HistoryProviderProps> = ({
  children,
  initialElements = [],
  initialConnections = [],
  maxHistorySize = 50,
  onStateChange,
}) => {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: {
      elements: initialElements,
      connections: initialConnections,
      timestamp: Date.now(),
    },
    future: [],
    maxHistorySize,
  });

  // Notify on state change
  React.useEffect(() => {
    onStateChange?.(state.present.elements, state.present.connections);
  }, [state.present, onStateChange]);

  // Actions
  const pushState = useCallback((elements: CanvasElement[], connections: Connection[]) => {
    dispatch({
      type: 'PUSH',
      payload: {
        elements,
        connections,
        timestamp: Date.now(),
      },
    });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const setPresent = useCallback((elements: CanvasElement[], connections: Connection[]) => {
    dispatch({
      type: 'SET_PRESENT',
      payload: {
        elements,
        connections,
        timestamp: Date.now(),
      },
    });
  }, []);

  const setMaxHistorySize = useCallback((size: number) => {
    dispatch({ type: 'SET_MAX_SIZE', payload: size });
  }, []);

  const value = useMemo<HistoryContextValue>(
    () => ({
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      historySize: state.past.length,
      futureSize: state.future.length,
      present: state.present,
      pushState,
      undo,
      redo,
      clearHistory,
      setPresent,
      setMaxHistorySize,
    }),
    [state.past.length, state.future.length, state.present, pushState, undo, redo, clearHistory, setPresent, setMaxHistorySize]
  );

  return React.createElement(HistoryContext.Provider, { value }, children);
};

export { HistoryContext };
