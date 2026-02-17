// useCanvasActions hook
// Combines common canvas operations with history support

import { useCallback, useRef } from "react";
import { useCanvas, useSelection, useHistory } from "@/core/context";
import type { CanvasElement, Connection } from "@/types/elements";

export interface UseCanvasActionsReturn {
	// Element operations with history
	addElement: (element: Omit<CanvasElement, "id"> & { id?: string }) => string;
	updateElement: (id: string, updates: Partial<CanvasElement>) => void;
	removeElement: (id: string) => void;
	removeSelected: () => void;
	moveSelected: (deltaX: number, deltaY: number) => void;
	duplicateSelected: () => string[];

	// Connection operations with history
	addConnection: (
		connection: Omit<Connection, "id"> & { id?: string },
	) => string;
	removeConnection: (id: string) => void;

	// Clipboard operations
	copy: () => void;
	cut: () => void;
	paste: () => void;
	hasCopied: boolean;

	// History operations
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

export const useCanvasActions = (): UseCanvasActionsReturn => {
	const canvas = useCanvas();
	const selection = useSelection();
	const history = useHistory();

	// Clipboard storage
	const clipboardRef = useRef<{
		elements: CanvasElement[];
		connections: Connection[];
	} | null>(null);

	// Save state to history before making changes
	const saveState = useCallback(() => {
		history.pushState(canvas.elements, canvas.connections);
	}, [history, canvas.elements, canvas.connections]);

	// Element operations
	const addElement = useCallback(
		(element: Omit<CanvasElement, "id"> & { id?: string }): string => {
			saveState();
			return canvas.addElement(element);
		},
		[canvas, saveState],
	);

	const updateElement = useCallback(
		(id: string, updates: Partial<CanvasElement>) => {
			saveState();
			canvas.updateElement(id, updates);
		},
		[canvas, saveState],
	);

	const removeElement = useCallback(
		(id: string) => {
			saveState();
			canvas.removeElement(id);
		},
		[canvas, saveState],
	);

	const removeSelected = useCallback(() => {
		if (selection.selectedIds.length === 0) return;
		saveState();
		canvas.removeElements(selection.selectedIds);
		selection.clearSelection();
	}, [canvas, selection, saveState]);

	const moveSelected = useCallback(
		(deltaX: number, deltaY: number) => {
			if (selection.selectedIds.length === 0) return;
			saveState();
			canvas.moveElements(selection.selectedIds, deltaX, deltaY);
		},
		[canvas, selection, saveState],
	);

	const duplicateSelected = useCallback((): string[] => {
		if (selection.selectedIds.length === 0) return [];

		saveState();

		const selectedElements = canvas.elements.filter((el) =>
			selection.selectedIds.includes(el.id),
		);

		// Create duplicates with offset
		const duplicates = selectedElements.map((el) => ({
			...el,
			id: undefined, // Will be auto-generated
			x: el.x + 20,
			y: el.y + 20,
		}));

		const newIds = canvas.addElements(duplicates);
		selection.selectMultiple(newIds);
		return newIds;
	}, [canvas, selection, saveState]);

	// Connection operations
	const addConnection = useCallback(
		(connection: Omit<Connection, "id"> & { id?: string }): string => {
			saveState();
			return canvas.addConnection(connection);
		},
		[canvas, saveState],
	);

	const removeConnection = useCallback(
		(id: string) => {
			saveState();
			canvas.removeConnection(id);
		},
		[canvas, saveState],
	);

	// Clipboard operations
	const copy = useCallback(() => {
		if (selection.selectedIds.length === 0) return;

		const selectedElements = canvas.elements.filter((el) =>
			selection.selectedIds.includes(el.id),
		);
		const selectedIds = new Set(selection.selectedIds);
		const relevantConnections = canvas.connections.filter(
			(conn) => selectedIds.has(conn.fromId) && selectedIds.has(conn.toId),
		);

		clipboardRef.current = {
			elements: selectedElements,
			connections: relevantConnections,
		};
	}, [canvas.elements, canvas.connections, selection.selectedIds]);

	const cut = useCallback(() => {
		copy();
		removeSelected();
	}, [copy, removeSelected]);

	const paste = useCallback(() => {
		if (!clipboardRef.current) return;

		saveState();

		// Create ID mapping for connections
		const idMap = new Map<string, string>();

		// Paste elements with offset and new IDs
		const newElements = clipboardRef.current.elements.map((el) => ({
			...el,
			id: undefined,
			x: el.x + 20,
			y: el.y + 20,
		}));

		const newIds = canvas.addElements(newElements);

		// Map old IDs to new IDs
		clipboardRef.current.elements.forEach((el, i) => {
			idMap.set(el.id, newIds[i]);
		});

		// Paste connections with updated IDs
		clipboardRef.current.connections.forEach((conn) => {
			const newFromId = idMap.get(conn.fromId);
			const newToId = idMap.get(conn.toId);
			if (newFromId && newToId) {
				canvas.addConnection({
					...conn,
					id: undefined,
					fromId: newFromId,
					toId: newToId,
				});
			}
		});

		selection.selectMultiple(newIds);
	}, [canvas, selection, saveState]);

	// History operations
	const undo = useCallback(() => {
		if (!history.canUndo) return;
		history.undo();
		canvas.loadState(history.present.elements, history.present.connections);
	}, [history, canvas]);

	const redo = useCallback(() => {
		if (!history.canRedo) return;
		history.redo();
		canvas.loadState(history.present.elements, history.present.connections);
	}, [history, canvas]);

	return {
		addElement,
		updateElement,
		removeElement,
		removeSelected,
		moveSelected,
		duplicateSelected,
		addConnection,
		removeConnection,
		copy,
		cut,
		paste,
		hasCopied: clipboardRef.current !== null,
		undo,
		redo,
		canUndo: history.canUndo,
		canRedo: history.canRedo,
	};
};

export default useCanvasActions;
