// Canvas Context
// Manages canvas elements and connections state

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { CanvasElement, Connection, ElementType } from '@/types/elements';
import type { CanvasConfig } from '@/types/canvas';
import { generateId, bringToFront, sendToBack, bringForward, sendBackward } from '@/core/utils';

// Canvas state
interface CanvasState {
  elements: CanvasElement[];
  connections: Connection[];
  config: CanvasConfig;
}

// Default config
const defaultConfig: CanvasConfig = {
  width: 800,
  height: 600,
  grid: {
    enabled: false,
    size: 20,
    snap: false,
    visible: false,
  },
  readonly: false,
};

// Action types
type CanvasAction =
  // Element actions
  | { type: 'ADD_ELEMENT'; payload: CanvasElement }
  | { type: 'ADD_ELEMENTS'; payload: CanvasElement[] }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<CanvasElement> } }
  | { type: 'UPDATE_ELEMENTS'; payload: { ids: string[]; updates: Partial<CanvasElement> } }
  | { type: 'REMOVE_ELEMENT'; payload: string }
  | { type: 'REMOVE_ELEMENTS'; payload: string[] }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; x: number; y: number } }
  | { type: 'MOVE_ELEMENTS'; payload: { ids: string[]; deltaX: number; deltaY: number } }
  | { type: 'RESIZE_ELEMENT'; payload: { id: string; width: number; height: number; x?: number; y?: number } }
  | { type: 'BRING_TO_FRONT'; payload: string }
  | { type: 'SEND_TO_BACK'; payload: string }
  | { type: 'MOVE_UP'; payload: string }
  | { type: 'MOVE_DOWN'; payload: string }
  | { type: 'SET_ELEMENTS'; payload: CanvasElement[] }
  // Connection actions
  | { type: 'ADD_CONNECTION'; payload: Connection }
  | { type: 'UPDATE_CONNECTION'; payload: { id: string; updates: Partial<Connection> } }
  | { type: 'REMOVE_CONNECTION'; payload: string }
  | { type: 'SET_CONNECTIONS'; payload: Connection[] }
  // Config actions
  | { type: 'UPDATE_CONFIG'; payload: Partial<CanvasConfig> }
  // Bulk actions
  | { type: 'CLEAR_CANVAS' }
  | { type: 'LOAD_STATE'; payload: { elements: CanvasElement[]; connections: Connection[] } };

// Reducer
const canvasReducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  switch (action.type) {
    // Element actions
    case 'ADD_ELEMENT':
      return {
        ...state,
        elements: [...state.elements, action.payload],
      };

    case 'ADD_ELEMENTS':
      return {
        ...state,
        elements: [...state.elements, ...action.payload],
      };

    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
        ),
      };

    case 'UPDATE_ELEMENTS':
      return {
        ...state,
        elements: state.elements.map((el) =>
          action.payload.ids.includes(el.id) ? { ...el, ...action.payload.updates } : el
        ),
      };

    case 'REMOVE_ELEMENT': {
      const elementId = action.payload;
      return {
        ...state,
        elements: state.elements.filter((el) => el.id !== elementId),
        // Also remove connections involving this element
        connections: state.connections.filter(
          (conn) => conn.fromId !== elementId && conn.toId !== elementId
        ),
      };
    }

    case 'REMOVE_ELEMENTS': {
      const idsToRemove = new Set(action.payload);
      return {
        ...state,
        elements: state.elements.filter((el) => !idsToRemove.has(el.id)),
        connections: state.connections.filter(
          (conn) => !idsToRemove.has(conn.fromId) && !idsToRemove.has(conn.toId)
        ),
      };
    }

    case 'MOVE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.payload.id
            ? { ...el, x: action.payload.x, y: action.payload.y }
            : el
        ),
      };

    case 'MOVE_ELEMENTS':
      return {
        ...state,
        elements: state.elements.map((el) =>
          action.payload.ids.includes(el.id)
            ? { ...el, x: el.x + action.payload.deltaX, y: el.y + action.payload.deltaY }
            : el
        ),
      };

    case 'RESIZE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.payload.id
            ? {
                ...el,
                width: action.payload.width,
                height: action.payload.height,
                ...(action.payload.x !== undefined && { x: action.payload.x }),
                ...(action.payload.y !== undefined && { y: action.payload.y }),
              }
            : el
        ),
      };

    case 'BRING_TO_FRONT':
      return {
        ...state,
        elements: bringToFront(state.elements, action.payload),
      };

    case 'SEND_TO_BACK':
      return {
        ...state,
        elements: sendToBack(state.elements, action.payload),
      };

    case 'MOVE_UP':
      return {
        ...state,
        elements: bringForward(state.elements, action.payload),
      };

    case 'MOVE_DOWN':
      return {
        ...state,
        elements: sendBackward(state.elements, action.payload),
      };

    case 'SET_ELEMENTS':
      return {
        ...state,
        elements: action.payload,
      };

    // Connection actions
    case 'ADD_CONNECTION':
      return {
        ...state,
        connections: [...state.connections, action.payload],
      };

    case 'UPDATE_CONNECTION':
      return {
        ...state,
        connections: state.connections.map((conn) =>
          conn.id === action.payload.id ? { ...conn, ...action.payload.updates } : conn
        ),
      };

    case 'REMOVE_CONNECTION':
      return {
        ...state,
        connections: state.connections.filter((conn) => conn.id !== action.payload),
      };

    case 'SET_CONNECTIONS':
      return {
        ...state,
        connections: action.payload,
      };

    // Config actions
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };

    // Bulk actions
    case 'CLEAR_CANVAS':
      return {
        ...state,
        elements: [],
        connections: [],
      };

    case 'LOAD_STATE':
      return {
        ...state,
        elements: action.payload.elements,
        connections: action.payload.connections,
      };

    default:
      return state;
  }
};

// Context value interface
interface CanvasContextValue {
  // State
  elements: CanvasElement[];
  connections: Connection[];
  config: CanvasConfig;

  // Element queries
  getElementById: (id: string) => CanvasElement | undefined;
  getElementsByType: (type: ElementType) => CanvasElement[];

  // Element actions
  addElement: (element: Omit<CanvasElement, 'id'> & { id?: string }) => string;
  addElements: (elements: Array<Omit<CanvasElement, 'id'> & { id?: string }>) => string[];
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateElements: (ids: string[], updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  removeElements: (ids: string[]) => void;
  moveElement: (id: string, x: number, y: number) => void;
  moveElements: (ids: string[], deltaX: number, deltaY: number) => void;
  resizeElement: (id: string, width: number, height: number, x?: number, y?: number) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  setElements: (elements: CanvasElement[]) => void;

  // Connection queries
  getConnectionById: (id: string) => Connection | undefined;
  getConnectionsForElement: (elementId: string) => Connection[];

  // Connection actions
  addConnection: (connection: Omit<Connection, 'id'> & { id?: string }) => string;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  removeConnection: (id: string) => void;
  setConnections: (connections: Connection[]) => void;

  // Config actions
  updateConfig: (config: Partial<CanvasConfig>) => void;

  // Bulk actions
  clearCanvas: () => void;
  loadState: (elements: CanvasElement[], connections: Connection[]) => void;
}

// Create context
const CanvasContext = createContext<CanvasContextValue | null>(null);

// Hook to use canvas
export const useCanvas = (): CanvasContextValue => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

// Provider props
interface CanvasProviderProps {
  children: React.ReactNode;
  initialElements?: CanvasElement[];
  initialConnections?: Connection[];
  config?: Partial<CanvasConfig>;
  onChange?: (elements: CanvasElement[], connections: Connection[]) => void;
}

// Canvas Provider component
export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  children,
  initialElements = [],
  initialConnections = [],
  config: initialConfig,
  onChange,
}) => {
  const [state, dispatch] = useReducer(canvasReducer, {
    elements: initialElements,
    connections: initialConnections,
    config: { ...defaultConfig, ...initialConfig },
  });

  // Notify on change
  React.useEffect(() => {
    onChange?.(state.elements, state.connections);
  }, [state.elements, state.connections, onChange]);

  // Element queries
  const getElementById = useCallback(
    (id: string) => state.elements.find((el) => el.id === id),
    [state.elements]
  );

  const getElementsByType = useCallback(
    (type: ElementType) => state.elements.filter((el) => el.type === type),
    [state.elements]
  );

  // Element actions
  const addElement = useCallback(
    (element: Omit<CanvasElement, 'id'> & { id?: string }): string => {
      const id = element.id ?? generateId();
      const maxZIndex = state.elements.length > 0
        ? Math.max(...state.elements.map((el) => el.zIndex))
        : 0;
      dispatch({
        type: 'ADD_ELEMENT',
        payload: { ...element, id, zIndex: element.zIndex ?? maxZIndex + 1 } as CanvasElement,
      });
      return id;
    },
    [state.elements]
  );

  const addElements = useCallback(
    (elements: Array<Omit<CanvasElement, 'id'> & { id?: string }>): string[] => {
      const maxZIndex = state.elements.length > 0
        ? Math.max(...state.elements.map((el) => el.zIndex))
        : 0;
      const newElements = elements.map((el, i) => ({
        ...el,
        id: el.id ?? generateId(),
        zIndex: el.zIndex ?? maxZIndex + 1 + i,
      })) as CanvasElement[];
      dispatch({ type: 'ADD_ELEMENTS', payload: newElements });
      return newElements.map((el) => el.id);
    },
    [state.elements]
  );

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
  }, []);

  const updateElements = useCallback((ids: string[], updates: Partial<CanvasElement>) => {
    dispatch({ type: 'UPDATE_ELEMENTS', payload: { ids, updates } });
  }, []);

  const removeElement = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', payload: id });
  }, []);

  const removeElements = useCallback((ids: string[]) => {
    dispatch({ type: 'REMOVE_ELEMENTS', payload: ids });
  }, []);

  const moveElement = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'MOVE_ELEMENT', payload: { id, x, y } });
  }, []);

  const moveElements = useCallback((ids: string[], deltaX: number, deltaY: number) => {
    dispatch({ type: 'MOVE_ELEMENTS', payload: { ids, deltaX, deltaY } });
  }, []);

  const resizeElement = useCallback(
    (id: string, width: number, height: number, x?: number, y?: number) => {
      dispatch({ type: 'RESIZE_ELEMENT', payload: { id, width, height, x, y } });
    },
    []
  );

  const bringToFrontAction = useCallback((id: string) => {
    dispatch({ type: 'BRING_TO_FRONT', payload: id });
  }, []);

  const sendToBackAction = useCallback((id: string) => {
    dispatch({ type: 'SEND_TO_BACK', payload: id });
  }, []);

  const moveUpAction = useCallback((id: string) => {
    dispatch({ type: 'MOVE_UP', payload: id });
  }, []);

  const moveDownAction = useCallback((id: string) => {
    dispatch({ type: 'MOVE_DOWN', payload: id });
  }, []);

  const setElements = useCallback((elements: CanvasElement[]) => {
    dispatch({ type: 'SET_ELEMENTS', payload: elements });
  }, []);

  // Connection queries
  const getConnectionById = useCallback(
    (id: string) => state.connections.find((conn) => conn.id === id),
    [state.connections]
  );

  const getConnectionsForElement = useCallback(
    (elementId: string) =>
      state.connections.filter(
        (conn) => conn.fromId === elementId || conn.toId === elementId
      ),
    [state.connections]
  );

  // Connection actions
  const addConnection = useCallback(
    (connection: Omit<Connection, 'id'> & { id?: string }): string => {
      const id = connection.id ?? generateId();
      dispatch({
        type: 'ADD_CONNECTION',
        payload: { ...connection, id } as Connection,
      });
      return id;
    },
    []
  );

  const updateConnection = useCallback((id: string, updates: Partial<Connection>) => {
    dispatch({ type: 'UPDATE_CONNECTION', payload: { id, updates } });
  }, []);

  const removeConnection = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CONNECTION', payload: id });
  }, []);

  const setConnections = useCallback((connections: Connection[]) => {
    dispatch({ type: 'SET_CONNECTIONS', payload: connections });
  }, []);

  // Config actions
  const updateConfig = useCallback((config: Partial<CanvasConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  // Bulk actions
  const clearCanvas = useCallback(() => {
    dispatch({ type: 'CLEAR_CANVAS' });
  }, []);

  const loadState = useCallback((elements: CanvasElement[], connections: Connection[]) => {
    dispatch({ type: 'LOAD_STATE', payload: { elements, connections } });
  }, []);

  const value = useMemo<CanvasContextValue>(
    () => ({
      elements: state.elements,
      connections: state.connections,
      config: state.config,
      getElementById,
      getElementsByType,
      addElement,
      addElements,
      updateElement,
      updateElements,
      removeElement,
      removeElements,
      moveElement,
      moveElements,
      resizeElement,
      bringToFront: bringToFrontAction,
      sendToBack: sendToBackAction,
      moveUp: moveUpAction,
      moveDown: moveDownAction,
      setElements,
      getConnectionById,
      getConnectionsForElement,
      addConnection,
      updateConnection,
      removeConnection,
      setConnections,
      updateConfig,
      clearCanvas,
      loadState,
    }),
    [
      state.elements,
      state.connections,
      state.config,
      getElementById,
      getElementsByType,
      addElement,
      addElements,
      updateElement,
      updateElements,
      removeElement,
      removeElements,
      moveElement,
      moveElements,
      resizeElement,
      bringToFrontAction,
      sendToBackAction,
      moveUpAction,
      moveDownAction,
      setElements,
      getConnectionById,
      getConnectionsForElement,
      addConnection,
      updateConnection,
      removeConnection,
      setConnections,
      updateConfig,
      clearCanvas,
      loadState,
    ]
  );

  return React.createElement(CanvasContext.Provider, { value }, children);
};

export { CanvasContext };
