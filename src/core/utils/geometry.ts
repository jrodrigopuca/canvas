// Geometry utilities
// Position and size calculations

import type { Point, Size, Bounds } from "@/types/elements";

/**
 * Calculate distance between two points
 */
export const distance = (p1: Point, p2: Point): number => {
	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if a point is inside bounds
 */
export const isPointInBounds = (point: Point, bounds: Bounds): boolean => {
	return (
		point.x >= bounds.x &&
		point.x <= bounds.x + bounds.width &&
		point.y >= bounds.y &&
		point.y <= bounds.y + bounds.height
	);
};

/**
 * Check if two bounds intersect
 */
export const boundsIntersect = (a: Bounds, b: Bounds): boolean => {
	return !(
		a.x + a.width < b.x ||
		b.x + b.width < a.x ||
		a.y + a.height < b.y ||
		b.y + b.height < a.y
	);
};

/**
 * Check if bounds A contains bounds B completely
 */
export const boundsContain = (
	container: Bounds,
	contained: Bounds,
): boolean => {
	return (
		contained.x >= container.x &&
		contained.y >= container.y &&
		contained.x + contained.width <= container.x + container.width &&
		contained.y + contained.height <= container.y + container.height
	);
};

/**
 * Get center point of bounds
 */
export const getBoundsCenter = (bounds: Bounds): Point => ({
	x: bounds.x + bounds.width / 2,
	y: bounds.y + bounds.height / 2,
});

/**
 * Snap a value to a grid
 */
export const snapToGrid = (value: number, gridSize: number): number => {
	return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a point to a grid
 */
export const snapPointToGrid = (point: Point, gridSize: number): Point => ({
	x: snapToGrid(point.x, gridSize),
	y: snapToGrid(point.y, gridSize),
});

/**
 * Get bounding box that contains all given bounds
 */
export const getContainingBounds = (boundsArray: Bounds[]): Bounds | null => {
	if (boundsArray.length === 0) return null;

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const bounds of boundsArray) {
		minX = Math.min(minX, bounds.x);
		minY = Math.min(minY, bounds.y);
		maxX = Math.max(maxX, bounds.x + bounds.width);
		maxY = Math.max(maxY, bounds.y + bounds.height);
	}

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

/**
 * Normalize bounds to ensure positive width/height
 */
export const normalizeBounds = (bounds: Bounds): Bounds => {
	let { x, y, width, height } = bounds;

	if (width < 0) {
		x += width;
		width = Math.abs(width);
	}

	if (height < 0) {
		y += height;
		height = Math.abs(height);
	}

	return { x, y, width, height };
};

/**
 * Resize handle positions
 */
export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

/**
 * Resize handle info
 */
export interface ResizeHandleInfo {
	position: ResizeHandle;
	x: number;
	y: number;
}

/**
 * Get resize handle positions for a given bounds
 */
export const getResizeHandles = (
	bounds: Bounds,
	handleSize: number,
): ResizeHandleInfo[] => {
	const { x, y, width, height } = bounds;
	const halfHandle = handleSize / 2;

	return [
		{ position: "nw", x: x - halfHandle, y: y - halfHandle },
		{ position: "n", x: x + width / 2 - halfHandle, y: y - halfHandle },
		{ position: "ne", x: x + width - halfHandle, y: y - halfHandle },
		{
			position: "e",
			x: x + width - halfHandle,
			y: y + height / 2 - halfHandle,
		},
		{ position: "se", x: x + width - halfHandle, y: y + height - halfHandle },
		{
			position: "s",
			x: x + width / 2 - halfHandle,
			y: y + height - halfHandle,
		},
		{ position: "sw", x: x - halfHandle, y: y + height - halfHandle },
		{ position: "w", x: x - halfHandle, y: y + height / 2 - halfHandle },
	];
};

/**
 * Get connection points for element bounds
 */
export const getConnectionPoints = (bounds: Bounds): Record<string, Point> => {
	const { x, y, width, height } = bounds;
	return {
		top: { x: x + width / 2, y },
		right: { x: x + width, y: y + height / 2 },
		bottom: { x: x + width / 2, y: y + height },
		left: { x, y: y + height / 2 },
		center: { x: x + width / 2, y: y + height / 2 },
	};
};

/**
 * Calculate midpoint between two points
 */
export const midpoint = (p1: Point, p2: Point): Point => ({
	x: (p1.x + p2.x) / 2,
	y: (p1.y + p2.y) / 2,
});

/**
 * Normalize angle to 0-360 range
 */
export const normalizeAngle = (angle: number): number => {
	return ((angle % 360) + 360) % 360;
};

/**
 * Rotate a point around an origin
 */
export const rotatePoint = (
	point: Point,
	origin: Point,
	angleDegrees: number,
): Point => {
	const angleRad = (angleDegrees * Math.PI) / 180;
	const cos = Math.cos(angleRad);
	const sin = Math.sin(angleRad);
	const dx = point.x - origin.x;
	const dy = point.y - origin.y;

	return {
		x: origin.x + dx * cos - dy * sin,
		y: origin.y + dx * sin + dy * cos,
	};
};
