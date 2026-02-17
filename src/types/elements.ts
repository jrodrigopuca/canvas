// Element-related types

/**
 * A point in 2D space
 */
export interface Point {
	x: number;
	y: number;
}

/**
 * Size dimensions
 */
export interface Size {
	width: number;
	height: number;
}

/**
 * Bounding box (position + size)
 */
export interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Element style properties
 */
export interface ElementStyle {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	cornerRadius?: number;
}

/**
 * Available element types
 */
export type ElementType =
	| "rectangle"
	| "ellipse"
	| "circle"
	| "diamond"
	| "text"
	| "line"
	| "actor"
	| "lifeline"
	| "message"
	| "activationBar"
	| "custom";

/**
 * Base canvas element interface
 */
export interface CanvasElement {
	id: string;
	type: ElementType;
	x: number;
	y: number;
	width: number;
	height: number;
	zIndex: number;
	rotation?: number;
	style?: ElementStyle;
	locked?: boolean;
	visible?: boolean;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
	data?: Record<string, unknown>;
}

/**
 * Text element
 */
export interface TextElement extends CanvasElement {
	type: "text";
	text?: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: "normal" | "bold";
	textAlign?: "left" | "center" | "right";
}

/**
 * Line type options
 */
export type LineType = "solid" | "dashed" | "dotted";

/**
 * Line element
 */
export interface LineElement extends CanvasElement {
	type: "line";
	points?: Point[];
	lineType?: LineType;
}

/**
 * Actor element (UML stick figure)
 */
export interface ActorElement extends CanvasElement {
	type: "actor";
	label?: string;
}

/**
 * Lifeline element (UML sequence diagram)
 */
export interface LifelineElement extends CanvasElement {
	type: "lifeline";
	label?: string;
}

/**
 * Message type options
 */
export type MessageType = "sync" | "async" | "return" | "create";

/**
 * Message element (UML sequence diagram arrow)
 */
export interface MessageElement extends CanvasElement {
	type: "message";
	label?: string;
	messageType?: MessageType;
	fromId?: string;
	toId?: string;
}

/**
 * Connection anchor position
 */
export type AnchorPosition = "top" | "right" | "bottom" | "left" | "center";

/**
 * Connection between elements
 */
export interface Connection {
	id: string;
	fromId: string;
	toId: string;
	fromAnchor?: AnchorPosition;
	toAnchor?: AnchorPosition;
	style?: ElementStyle;
	label?: string;
}
