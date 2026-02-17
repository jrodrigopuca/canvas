// Core utilities barrel export

export { generateId } from "./id";
export { cx } from "./classnames";
export { deepMerge } from "./deepMerge";
export {
	distance,
	midpoint,
	isPointInBounds,
	boundsIntersect,
	boundsContain,
	getBoundsCenter,
	snapToGrid,
	snapPointToGrid,
	getContainingBounds,
	clamp,
	normalizeBounds,
	getResizeHandles,
	getConnectionPoints,
	normalizeAngle,
	rotatePoint,
} from "./geometry";
export type { ResizeHandle, ResizeHandleInfo } from "./geometry";
export {
	sortByZIndex,
	getMaxZIndex,
	getMinZIndex,
	bringToFront,
	sendToBack,
	bringForward,
	sendBackward,
	normalizeZIndexes,
} from "./layers";
export {
	serializeToJSON,
	deserializeFromJSON,
	exportToSVG,
	exportToImage,
	downloadAsFile,
	downloadAsImage,
} from "./serialization";
export type {
	CanvasData,
	ImageFormat,
	ExportImageOptions,
} from "./serialization";
export {
	validateCanvasData,
	validateElement,
	validateConnection,
	validateConnectionReferences,
} from "./validation";
export type { ValidationResult } from "./validation";
