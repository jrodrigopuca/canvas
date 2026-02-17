// Serialization utilities
// JSON import/export for canvas data

import type { CanvasElement, Connection } from "@/types/elements";
import { validateCanvasData } from "./validation";

export interface CanvasData {
	version: string;
	elements: CanvasElement[];
	connections: Connection[];
	metadata?: Record<string, unknown>;
}

const CURRENT_VERSION = "1.0.0";

/**
 * Serialize canvas data to JSON string
 */
export const serializeToJSON = (
	elements: CanvasElement[],
	connections: Connection[],
	metadata?: Record<string, unknown>,
): string => {
	const data: CanvasData = {
		version: CURRENT_VERSION,
		elements,
		connections,
		metadata,
	};
	return JSON.stringify(data, null, 2);
};

/**
 * Deserialize JSON string to canvas data
 */
export const deserializeFromJSON = (json: string): CanvasData => {
	const data = JSON.parse(json) as CanvasData;

	const validation = validateCanvasData(data);
	if (!validation.valid) {
		throw new Error(`Invalid canvas data: ${validation.errors.join(", ")}`);
	}

	return data;
};

/**
 * Export canvas as SVG string
 */
export const exportToSVG = (
	svgElement: SVGSVGElement,
	options?: { includeStyles?: boolean },
): string => {
	const clone = svgElement.cloneNode(true) as SVGSVGElement;

	// Add XML namespace if not present
	if (!clone.getAttribute("xmlns")) {
		clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	}

	// Optionally include inline styles
	if (options?.includeStyles) {
		const styles = document.createElement("style");
		styles.textContent = getComputedStyles(svgElement);
		clone.insertBefore(styles, clone.firstChild);
	}

	const serializer = new XMLSerializer();
	return serializer.serializeToString(clone);
};

/**
 * Get computed styles from SVG element
 */
const getComputedStyles = (svg: SVGSVGElement): string => {
	// Get all unique tag names
	const tags = new Set<string>();
	svg.querySelectorAll("*").forEach((el) => tags.add(el.tagName.toLowerCase()));

	// Basic SVG styles
	return `
    svg { font-family: system-ui, sans-serif; }
    text { user-select: none; }
  `;
};

/**
 * Download string content as file
 */
export const downloadAsFile = (
	content: string,
	filename: string,
	mimeType: string,
): void => {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
