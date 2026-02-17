// ElementFactory
// Pure factory function for creating canvas elements

import type {
	CanvasElement,
	ElementType,
	ElementStyle,
	Point,
	TextElement,
	LineElement,
	ActorElement,
	LifelineElement,
	MessageElement,
} from "@/types/elements";
import { generateId } from "@/core/utils";

export interface CreateElementOptions {
	id?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	style?: ElementStyle;
	zIndex?: number;
	locked?: boolean;
	visible?: boolean;
	data?: Record<string, unknown>;
}

export interface CreateTextElementOptions extends CreateElementOptions {
	text?: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: "normal" | "bold";
	textAlign?: "left" | "center" | "right";
}

export interface CreateLineElementOptions extends CreateElementOptions {
	points?: Point[];
	lineType?: "solid" | "dashed" | "dotted";
}

export interface CreateActorElementOptions extends CreateElementOptions {
	label?: string;
}

export interface CreateLifelineElementOptions extends CreateElementOptions {
	label?: string;
}

export interface CreateMessageElementOptions extends CreateElementOptions {
	label?: string;
	messageType?: "sync" | "async" | "return" | "create";
	fromId?: string;
	toId?: string;
}

// Default dimensions by element type
const defaultDimensions: Record<
	ElementType,
	{ width: number; height: number }
> = {
	rectangle: { width: 120, height: 80 },
	ellipse: { width: 120, height: 80 },
	circle: { width: 80, height: 80 },
	diamond: { width: 100, height: 100 },
	text: { width: 100, height: 30 },
	line: { width: 100, height: 2 },
	actor: { width: 60, height: 100 },
	lifeline: { width: 100, height: 300 },
	message: { width: 150, height: 30 },
	activationBar: { width: 12, height: 60 },
	custom: { width: 100, height: 100 },
};

/**
 * Create a base element with common properties
 */
const createBaseElement = (
	type: ElementType,
	options: CreateElementOptions = {},
): CanvasElement => {
	const defaults = defaultDimensions[type] ?? defaultDimensions.custom;

	return {
		id: options.id ?? generateId(),
		type,
		x: options.x ?? 0,
		y: options.y ?? 0,
		width: options.width ?? defaults.width,
		height: options.height ?? defaults.height,
		zIndex: options.zIndex ?? 0,
		style: options.style,
		locked: options.locked ?? false,
		visible: options.visible ?? true,
		data: options.data,
	};
};

/**
 * Create a rectangle element
 */
export const createRectangle = (
	options: CreateElementOptions = {},
): CanvasElement => {
	return createBaseElement("rectangle", options);
};

/**
 * Create an ellipse element
 */
export const createEllipse = (
	options: CreateElementOptions = {},
): CanvasElement => {
	return createBaseElement("ellipse", options);
};

/**
 * Create a circle element (ellipse with equal dimensions)
 */
export const createCircle = (
	options: CreateElementOptions = {},
): CanvasElement => {
	const size = options.width ?? options.height ?? 80;
	return createBaseElement("circle", { ...options, width: size, height: size });
};

/**
 * Create a diamond element
 */
export const createDiamond = (
	options: CreateElementOptions = {},
): CanvasElement => {
	return createBaseElement("diamond", options);
};

/**
 * Create a text element
 */
export const createText = (
	options: CreateTextElementOptions = {},
): TextElement => {
	const { text, fontSize, fontFamily, fontWeight, textAlign, ...baseOptions } =
		options;

	return {
		...createBaseElement("text", baseOptions),
		type: "text",
		text: text ?? "",
		fontSize,
		fontFamily,
		fontWeight,
		textAlign,
	};
};

/**
 * Create a line element
 * Points are automatically normalized to be relative to (0,0)
 * and element x,y is set to the bounding box origin
 */
export const createLine = (
	options: CreateLineElementOptions = {},
): LineElement => {
	const { points: inputPoints, lineType, x, y, ...baseOptions } = options;

	// Default HORIZONTAL line if no points specified
	const defaultWidth = baseOptions.width ?? 100;
	let points = inputPoints ?? [
		{ x: x ?? 0, y: y ?? 0 },
		{ x: (x ?? 0) + defaultWidth, y: y ?? 0 },
	];

	// Calculate bounding box from points
	const xs = points.map((p) => p.x);
	const ys = points.map((p) => p.y);
	const minX = Math.min(...xs);
	const minY = Math.min(...ys);
	const maxX = Math.max(...xs);
	const maxY = Math.max(...ys);

	// Normalize points to be relative to (0,0)
	const normalizedPoints = points.map((p) => ({
		x: p.x - minX,
		y: p.y - minY,
	}));

	// Calculate dimensions
	// For horizontal/vertical lines, ensure minimum size for selection
	const rawWidth = maxX - minX;
	const rawHeight = maxY - minY;
	const width = Math.max(rawWidth, 10);
	const height = Math.max(rawHeight, 10);

	// Adjust normalized points if we expanded the bounding box
	const adjustedPoints = normalizedPoints.map((p) => ({
		x: rawWidth < 10 ? p.x + (10 - rawWidth) / 2 : p.x,
		y: rawHeight < 10 ? p.y + (10 - rawHeight) / 2 : p.y,
	}));

	return {
		...createBaseElement("line", {
			...baseOptions,
			x: rawWidth < 10 ? minX - (10 - rawWidth) / 2 : minX,
			y: rawHeight < 10 ? minY - (10 - rawHeight) / 2 : minY,
			width,
			height,
		}),
		type: "line",
		points: adjustedPoints,
		lineType: lineType ?? "solid",
	};
};

/**
 * Create an actor element (UML)
 */
export const createActor = (
	options: CreateActorElementOptions = {},
): ActorElement => {
	const { label, ...baseOptions } = options;

	return {
		...createBaseElement("actor", baseOptions),
		type: "actor",
		label,
	};
};

/**
 * Create a lifeline element (UML)
 */
export const createLifeline = (
	options: CreateLifelineElementOptions = {},
): LifelineElement => {
	const { label, ...baseOptions } = options;

	return {
		...createBaseElement("lifeline", baseOptions),
		type: "lifeline",
		label,
	};
};

/**
 * Create a message element (UML)
 */
export const createMessage = (
	options: CreateMessageElementOptions = {},
): MessageElement => {
	const { label, messageType, fromId, toId, ...baseOptions } = options;

	return {
		...createBaseElement("message", baseOptions),
		type: "message",
		label,
		messageType: messageType ?? "sync",
		fromId,
		toId,
	};
};

/**
 * Create an activation bar element (UML)
 */
export const createActivationBar = (
	options: CreateElementOptions = {},
): CanvasElement => {
	return createBaseElement("activationBar", options);
};

/**
 * Factory function to create any element by type
 */
export const createElement = (
	type: ElementType,
	options: CreateElementOptions & Record<string, unknown> = {},
): CanvasElement => {
	switch (type) {
		case "rectangle":
			return createRectangle(options);
		case "ellipse":
			return createEllipse(options);
		case "circle":
			return createCircle(options);
		case "diamond":
			return createDiamond(options);
		case "text":
			return createText(options as CreateTextElementOptions);
		case "line":
			return createLine(options as CreateLineElementOptions);
		case "actor":
			return createActor(options as CreateActorElementOptions);
		case "lifeline":
			return createLifeline(options as CreateLifelineElementOptions);
		case "message":
			return createMessage(options as CreateMessageElementOptions);
		case "activationBar":
			return createActivationBar(options);
		default:
			return createBaseElement(type, options);
	}
};

// Export factory as default
export const ElementFactory = {
	create: createElement,
	rectangle: createRectangle,
	ellipse: createEllipse,
	circle: createCircle,
	diamond: createDiamond,
	text: createText,
	line: createLine,
	actor: createActor,
	lifeline: createLifeline,
	message: createMessage,
	activationBar: createActivationBar,
};

export default ElementFactory;
