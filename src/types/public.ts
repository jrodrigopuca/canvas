// Public types - exported for consumers

export type {
	CanvasElement,
	ElementType,
	ElementStyle,
	Point,
	Size,
	Bounds,
	Connection,
	TextElement,
	LineElement,
	LineType,
	ActorElement,
	LifelineElement,
	MessageElement,
	MessageType,
	AnchorPosition,
} from "./elements";

export type {
	GridConfig,
	ViewportState,
	CanvasConfig,
	CanvasState,
} from "./canvas";

export type {
	Theme,
	ThemeColors,
	ThemeSpacing,
	ThemeBorderRadius,
	ThemeFontSize,
	ThemeStrokeWidth,
	ThemeShadows,
} from "./theme";

export type {
	CanvasEvent,
	ElementEvent,
	SelectionEvent,
	DragEvent,
	ResizeEvent,
	ResizeHandle,
} from "./events";
