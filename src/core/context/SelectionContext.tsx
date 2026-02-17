// Selection Context
// Manages element selection state (single and multi-select)

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Selection state
interface SelectionState {
  selectedIds: Set<string>;
  lastSelectedId: string | null;
}

// Default state
const defaultSelection: SelectionState = {
  selectedIds: new Set(),
  lastSelectedId: null,
};

// Action types
type SelectionAction =
  | { type: 'SELECT'; payload: string }
  | { type: 'SELECT_MULTIPLE'; payload: string[] }
  | { type: 'ADD_TO_SELECTION'; payload: string }
  | { type: 'REMOVE_FROM_SELECTION'; payload: string }
  | { type: 'TOGGLE_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_ALL'; payload: string[] };

// Reducer
const selectionReducer = (state: SelectionState, action: SelectionAction): SelectionState => {
  switch (action.type) {
    case 'SELECT':
      return {
        selectedIds: new Set([action.payload]),
        lastSelectedId: action.payload,
      };

    case 'SELECT_MULTIPLE':
      return {
        selectedIds: new Set(action.payload),
        lastSelectedId: action.payload.length > 0 ? action.payload[action.payload.length - 1] : null,
      };

    case 'ADD_TO_SELECTION': {
      const newSet = new Set(state.selectedIds);
      newSet.add(action.payload);
      return {
        selectedIds: newSet,
        lastSelectedId: action.payload,
      };
    }

    case 'REMOVE_FROM_SELECTION': {
      const newSet = new Set(state.selectedIds);
      newSet.delete(action.payload);
      return {
        selectedIds: newSet,
        lastSelectedId: newSet.size > 0 ? Array.from(newSet).pop()! : null,
      };
    }

    case 'TOGGLE_SELECTION': {
      const newSet = new Set(state.selectedIds);
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload);
        return {
          selectedIds: newSet,
          lastSelectedId: newSet.size > 0 ? Array.from(newSet).pop()! : null,
        };
      } else {
        newSet.add(action.payload);
        return {
          selectedIds: newSet,
          lastSelectedId: action.payload,
        };
      }
    }

    case 'CLEAR_SELECTION':
      return defaultSelection;

    case 'SELECT_ALL':
      return {
        selectedIds: new Set(action.payload),
        lastSelectedId: action.payload.length > 0 ? action.payload[action.payload.length - 1] : null,
      };

    default:
      return state;
  }
};

// Context value interface
interface SelectionContextValue {
  // State
  selectedIds: string[];
  lastSelectedId: string | null;
  selectionCount: number;
  hasSelection: boolean;

  // Queries
  isSelected: (id: string) => boolean;

  // Actions
  select: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  removeFromSelection: (id: string) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
}

// Create context
const SelectionContext = createContext<SelectionContextValue | null>(null);

// Hook to use selection
export const useSelection = (): SelectionContextValue => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

// Provider props
interface SelectionProviderProps {
  children: React.ReactNode;
  initialSelection?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

// Selection Provider component
export const SelectionProvider: React.FC<SelectionProviderProps> = ({
  children,
  initialSelection,
  onSelectionChange,
}) => {
  const [state, dispatch] = useReducer(selectionReducer, {
    selectedIds: new Set(initialSelection ?? []),
    lastSelectedId: initialSelection?.[initialSelection.length - 1] ?? null,
  });

  // Notify on selection change
  const selectedIdsArray = useMemo(() => Array.from(state.selectedIds), [state.selectedIds]);

  React.useEffect(() => {
    onSelectionChange?.(selectedIdsArray);
  }, [selectedIdsArray, onSelectionChange]);

  // Queries
  const isSelected = useCallback(
    (id: string): boolean => {
      return state.selectedIds.has(id);
    },
    [state.selectedIds]
  );

  // Actions
  const select = useCallback((id: string) => {
    dispatch({ type: 'SELECT', payload: id });
  }, []);

  const selectMultiple = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_MULTIPLE', payload: ids });
  }, []);

  const addToSelection = useCallback((id: string) => {
    dispatch({ type: 'ADD_TO_SELECTION', payload: id });
  }, []);

  const removeFromSelection = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_SELECTION', payload: id });
  }, []);

  const toggleSelection = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SELECTION', payload: id });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_ALL', payload: ids });
  }, []);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedIds: selectedIdsArray,
      lastSelectedId: state.lastSelectedId,
      selectionCount: state.selectedIds.size,
      hasSelection: state.selectedIds.size > 0,
      isSelected,
      select,
      selectMultiple,
      addToSelection,
      removeFromSelection,
      toggleSelection,
      clearSelection,
      selectAll,
    }),
    [
      selectedIdsArray,
      state.lastSelectedId,
      state.selectedIds.size,
      isSelected,
      select,
      selectMultiple,
      addToSelection,
      removeFromSelection,
      toggleSelection,
      clearSelection,
      selectAll,
    ]
  );

  return React.createElement(SelectionContext.Provider, { value }, children);
};

export { SelectionContext };
