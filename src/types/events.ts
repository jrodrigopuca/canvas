// Event-related types

import type { Point, Bounds, CanvasElement } from "./elements";

/**
 * Base canvas event
 */
export interface CanvasEvent {
	type: string;
	timestamp: number;
}

/**
 * Element-related event
 */
export interface ElementEvent extends CanvasEvent {
	elementId: string;
	element: CanvasElement;
}

/**
 * Selection change event
 */
export interface SelectionEvent extends CanvasEvent {
	type: "selection:change";
	selectedIds: string[];
	previousSelectedIds: string[];
}

/**
 * Drag event
 */
export interface DragEvent extends CanvasEvent {
	type: "drag:start" | "drag:move" | "drag:end";
	elementId: string;
	startPosition: Point;
	currentPosition: Point;
	delta: Point;
}

/**
 * Resize handle positions
 */
export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

/**
 * Resize event
 */
export interface ResizeEvent extends CanvasEvent {
	type: "resize:start" | "resize:move" | "resize:end";
	elementId: string;
	handle: ResizeHandle;
	startBounds: { x: number; y: number; width: number; height: number };
	currentBounds: { x: number; y: number; width: number; height: number };
}
