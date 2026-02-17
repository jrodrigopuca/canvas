// Layers / Z-index management utilities

import type { CanvasElement } from "@/types/elements";

/**
 * Sort elements by z-index for rendering
 */
export const sortByZIndex = (elements: CanvasElement[]): CanvasElement[] => {
	return [...elements].sort((a, b) => a.zIndex - b.zIndex);
};

/**
 * Get the maximum z-index from elements
 */
export const getMaxZIndex = (elements: CanvasElement[]): number => {
	if (elements.length === 0) return 0;
	return Math.max(...elements.map((el) => el.zIndex));
};

/**
 * Get the minimum z-index from elements
 */
export const getMinZIndex = (elements: CanvasElement[]): number => {
	if (elements.length === 0) return 0;
	return Math.min(...elements.map((el) => el.zIndex));
};

/**
 * Bring element to front (highest z-index)
 */
export const bringToFront = (
	elements: CanvasElement[],
	elementId: string,
): CanvasElement[] => {
	const maxZ = getMaxZIndex(elements);
	return elements.map((el) =>
		el.id === elementId ? { ...el, zIndex: maxZ + 1 } : el,
	);
};

/**
 * Send element to back (lowest z-index)
 */
export const sendToBack = (
	elements: CanvasElement[],
	elementId: string,
): CanvasElement[] => {
	const minZ = getMinZIndex(elements);
	return elements.map((el) =>
		el.id === elementId ? { ...el, zIndex: minZ - 1 } : el,
	);
};

/**
 * Bring element one step forward
 */
export const bringForward = (
	elements: CanvasElement[],
	elementId: string,
): CanvasElement[] => {
	const sorted = sortByZIndex(elements);
	const index = sorted.findIndex((el) => el.id === elementId);

	if (index === -1 || index === sorted.length - 1) return elements;

	const current = sorted[index];
	const above = sorted[index + 1];

	return elements.map((el) => {
		if (el.id === current.id) return { ...el, zIndex: above.zIndex + 1 };
		return el;
	});
};

/**
 * Send element one step backward
 */
export const sendBackward = (
	elements: CanvasElement[],
	elementId: string,
): CanvasElement[] => {
	const sorted = sortByZIndex(elements);
	const index = sorted.findIndex((el) => el.id === elementId);

	if (index <= 0) return elements;

	const current = sorted[index];
	const below = sorted[index - 1];

	return elements.map((el) => {
		if (el.id === current.id) return { ...el, zIndex: below.zIndex - 1 };
		return el;
	});
};

/**
 * Normalize z-indexes to be sequential (0, 1, 2, ...)
 */
export const normalizeZIndexes = (
	elements: CanvasElement[],
): CanvasElement[] => {
	const sorted = sortByZIndex(elements);
	const idToNewIndex = new Map<string, number>();

	sorted.forEach((el, index) => {
		idToNewIndex.set(el.id, index);
	});

	return elements.map((el) => ({
		...el,
		zIndex: idToNewIndex.get(el.id) ?? el.zIndex,
	}));
};
