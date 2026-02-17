// @canvas-uml/react - Main entry point
// A React component library for canvas drawing with UML support

// Main components
export {
	Canvas,
	DrawingCanvas,
	ElementFactory,
	createElement,
} from "./components";
export type {
	CanvasProps,
	CanvasRef,
	DrawingCanvasProps,
	CreateElementOptions,
} from "./components";

// Element components - shapes
export {
	Rectangle,
	Ellipse,
	Circle,
	Oval,
	Diamond,
	TextElement,
	Line,
} from "./elements/shapes";

// Element components - UML
export { Actor, Lifeline, Message, ActivationBar } from "./elements/uml";

// Element base
export { ElementBase, withElementBehavior } from "./elements";
export type {
	ElementBaseProps,
	ElementRenderProps,
	WithElementBehaviorProps,
} from "./elements";

// Factory functions
export {
	createRectangle,
	createEllipse,
	createCircle,
	createDiamond,
	createText,
	createLine,
	createActor,
	createLifeline,
	createMessage,
	createActivationBar,
} from "./components";

// Themes
export {
	lightTheme,
	darkTheme,
	getThemeCSSVariables,
} from "./core/context/ThemeContext";

// Types - elements
export type {
	CanvasElement,
	ElementType,
	ElementStyle,
	Point,
	Bounds,
	Connection,
	TextElement as TextElementType,
	LineElement,
	ActorElement,
	LifelineElement,
	MessageElement,
	MessageType,
} from "./types/elements";

// Types - canvas
export type {
	CanvasConfig,
	CanvasState,
	ViewportState,
	GridConfig,
} from "./types/canvas";

// Types - theme
export type { Theme, ThemeColors } from "./types/theme";

// Types - events
export type {
	CanvasEvent,
	ElementEvent,
	SelectionEvent,
	DragEvent,
	ResizeEvent,
} from "./types/events";

// Contexts and providers
export {
	CanvasProvider,
	useCanvas,
	SelectionProvider,
	useSelection,
	ViewportProvider,
	useViewport,
	HistoryProvider,
	useHistory,
	ThemeProvider,
	useTheme,
	CombinedCanvasProvider,
} from "./core/context";

// Hooks
export {
	useDraggable,
	useResizable,
	useRotatable,
	useSelectable,
	useCanvasActions,
	useKeyboard,
	useCanvasKeyboardShortcuts,
} from "./core/hooks";

// Utilities (for advanced usage)
export {
	generateId,
	cx,
	deepMerge,
	distance,
	isPointInBounds,
	boundsIntersect,
	snapToGrid,
	getResizeHandles,
	sortByZIndex,
	bringToFront,
	sendToBack,
	serializeToJSON,
	deserializeFromJSON,
	exportToSVG,
	exportToImage,
	downloadAsFile,
	downloadAsImage,
	validateCanvasData,
} from "./core/utils";

export type { CanvasData, ImageFormat, ExportImageOptions } from "./core/utils";
