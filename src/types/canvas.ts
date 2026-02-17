// Canvas-related types

import type { Point } from "./elements";

/**
 * Grid configuration
 */
export interface GridConfig {
	enabled: boolean;
	size: number;
	snap: boolean;
	visible: boolean;
	color?: string;
	opacity?: number;
}

/**
 * Viewport state (zoom and pan)
 */
export interface ViewportState {
	zoom: number;
	pan: Point;
	minZoom: number;
	maxZoom: number;
}

/**
 * Canvas configuration
 */
export interface CanvasConfig {
	width: number;
	height: number;
	grid?: Partial<GridConfig>;
	readonly?: boolean;
}

/**
 * Canvas state (for controlled mode)
 */
export interface CanvasState {
	width: number;
	height: number;
	zoom: number;
	pan: Point;
}

/**
 * Default grid config
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
	enabled: false,
	size: 20,
	snap: false,
	visible: false,
	color: "#e0e0e0",
	opacity: 0.5,
};

/**
 * Default viewport state
 */
export const DEFAULT_VIEWPORT: ViewportState = {
	zoom: 1,
	pan: { x: 0, y: 0 },
	minZoom: 0.1,
	maxZoom: 5,
};
