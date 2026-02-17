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

export type ImageFormat = "png" | "jpeg";

export interface ExportImageOptions {
	/** Image format: 'png' or 'jpeg' */
	format?: ImageFormat;
	/** Quality for JPEG format (0-1), default 0.92 */
	quality?: number;
	/** Background color (default: transparent for PNG, white for JPEG) */
	backgroundColor?: string;
	/** Scale factor for higher resolution (default: 1) */
	scale?: number;
}

/**
 * Export SVG canvas as PNG or JPEG image
 * Returns a Promise with the image as a data URL or Blob
 */
export const exportToImage = async (
	svgElement: SVGSVGElement,
	options: ExportImageOptions = {},
): Promise<Blob> => {
	const {
		format = "png",
		quality = 0.92,
		backgroundColor,
		scale = 1,
	} = options;

	// Get SVG dimensions
	const svgRect = svgElement.getBoundingClientRect();
	const width = svgRect.width * scale;
	const height = svgRect.height * scale;

	// Clone and prepare SVG
	const clone = svgElement.cloneNode(true) as SVGSVGElement;
	clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

	// Add inline styles
	const styleEl = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"style",
	);
	styleEl.textContent = getComputedStyles(svgElement);
	clone.insertBefore(styleEl, clone.firstChild);

	// Serialize SVG to string
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(clone);

	// Create a Blob from SVG string
	const svgBlob = new Blob([svgString], {
		type: "image/svg+xml;charset=utf-8",
	});
	const svgUrl = URL.createObjectURL(svgBlob);

	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			// Create canvas
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				URL.revokeObjectURL(svgUrl);
				reject(new Error("Failed to get canvas context"));
				return;
			}

			// Apply background color
			const bgColor =
				backgroundColor ?? (format === "jpeg" ? "#ffffff" : "transparent");
			if (bgColor !== "transparent") {
				ctx.fillStyle = bgColor;
				ctx.fillRect(0, 0, width, height);
			}

			// Scale and draw image
			ctx.scale(scale, scale);
			ctx.drawImage(img, 0, 0);

			// Convert to blob
			canvas.toBlob(
				(blob) => {
					URL.revokeObjectURL(svgUrl);
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error("Failed to create image blob"));
					}
				},
				format === "jpeg" ? "image/jpeg" : "image/png",
				format === "jpeg" ? quality : undefined,
			);
		};

		img.onerror = () => {
			URL.revokeObjectURL(svgUrl);
			reject(new Error("Failed to load SVG as image"));
		};

		img.src = svgUrl;
	});
};

/**
 * Download canvas as image file
 */
export const downloadAsImage = async (
	svgElement: SVGSVGElement,
	filename: string,
	options: ExportImageOptions = {},
): Promise<void> => {
	const { format = "png" } = options;
	const blob = await exportToImage(svgElement, options);
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${filename}.${format}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
