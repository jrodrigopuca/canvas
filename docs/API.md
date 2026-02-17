# API Reference

Complete API documentation for `@jrodrigopuca/canvas`.

## Table of Contents

- [Canvas Component](#canvas-component)
- [Element Types](#element-types)
- [Hooks](#hooks)
- [Context Providers](#context-providers)
- [Utility Functions](#utility-functions)
- [Factory Functions](#factory-functions)
- [Types](#types)

---

## Canvas Component

The main component that provides a complete drawing canvas.

### Props

| Prop                      | Type                              | Default   | Required | Description                            |
| ------------------------- | --------------------------------- | --------- | -------- | -------------------------------------- |
| `elements`                | `CanvasElement[]`                 | -         | No       | Controlled mode: current elements      |
| `connections`             | `Connection[]`                    | -         | No       | Controlled mode: current connections   |
| `selectedIds`             | `string[]`                        | -         | No       | Controlled mode: selected element IDs  |
| `defaultElements`         | `CanvasElement[]`                 | `[]`      | No       | Uncontrolled mode: initial elements    |
| `defaultConnections`      | `Connection[]`                    | `[]`      | No       | Uncontrolled mode: initial connections |
| `width`                   | `number`                          | `800`     | No       | Canvas width in pixels                 |
| `height`                  | `number`                          | `600`     | No       | Canvas height in pixels                |
| `config`                  | `Partial<CanvasConfig>`           | -         | No       | Canvas configuration                   |
| `theme`                   | `'light' \| 'dark' \| Theme`      | `'light'` | No       | Theme configuration                    |
| `readonly`                | `boolean`                         | `false`   | No       | Disable all interactions               |
| `initialViewport`         | `Partial<ViewportState>`          | -         | No       | Initial zoom/pan state                 |
| `maxHistorySize`          | `number`                          | `50`      | No       | Max undo/redo steps                    |
| `showGrid`                | `boolean`                         | `false`   | No       | Show grid lines                        |
| `gridSize`                | `number`                          | `20`      | No       | Grid cell size in pixels               |
| `enableKeyboardShortcuts` | `boolean`                         | `true`    | No       | Enable keyboard shortcuts              |
| `onChange`                | `(elements, connections) => void` | -         | No       | Called when canvas changes             |
| `onSelectionChange`       | `(selectedIds) => void`           | -         | No       | Called when selection changes          |
| `className`               | `string`                          | -         | No       | CSS class for container                |
| `style`                   | `CSSProperties`                   | -         | No       | Inline styles for container            |
| `children`                | `ReactNode`                       | -         | No       | Custom overlay content                 |

### Ref Methods (CanvasRef)

```typescript
interface CanvasRef {
	// Element operations
	addElement: (element: Omit<CanvasElement, "id"> & { id?: string }) => string;
	updateElement: (id: string, updates: Partial<CanvasElement>) => void;
	removeElement: (id: string) => void;
	getElement: (id: string) => CanvasElement | undefined;
	getElementsByType: (type: ElementType) => CanvasElement[];

	// Selection
	select: (id: string) => void;
	selectMultiple: (ids: string[]) => void;
	clearSelection: () => void;
	getSelectedIds: () => string[];

	// Viewport
	zoomIn: () => void;
	zoomOut: () => void;
	setZoom: (zoom: number) => void;
	resetViewport: () => void;

	// History
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;

	// Export
	toJSON: () => { elements: CanvasElement[]; connections: Connection[] };
	toSVG: () => string;
}
```

---

## Element Types

### CanvasElement (Base)

All elements extend this base interface:

```typescript
interface CanvasElement {
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
```

### ElementStyle

```typescript
interface ElementStyle {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
	cornerRadius?: number;
}
```

### ElementType

```typescript
type ElementType =
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
```

### Specialized Elements

#### TextElement

```typescript
interface TextElement extends CanvasElement {
	type: "text";
	text?: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: "normal" | "bold";
	textAlign?: "left" | "center" | "right";
}
```

#### LineElement

```typescript
interface LineElement extends CanvasElement {
	type: "line";
	points?: Point[];
	lineType?: "solid" | "dashed" | "dotted";
}
```

#### ActorElement

```typescript
interface ActorElement extends CanvasElement {
	type: "actor";
	label?: string;
}
```

#### LifelineElement

```typescript
interface LifelineElement extends CanvasElement {
	type: "lifeline";
	label?: string;
}
```

#### MessageElement

```typescript
interface MessageElement extends CanvasElement {
	type: "message";
	label?: string;
	messageType?: "sync" | "async" | "return" | "create";
	fromId?: string;
	toId?: string;
}
```

### Connection

```typescript
interface Connection {
	id: string;
	fromId: string;
	toId: string;
	fromAnchor?: "top" | "right" | "bottom" | "left" | "center";
	toAnchor?: "top" | "right" | "bottom" | "left" | "center";
	style?: ElementStyle;
	label?: string;
}
```

---

## Hooks

### useCanvas

Access canvas state and methods.

```typescript
const {
	elements, // CanvasElement[]
	connections, // Connection[]
	config, // CanvasConfig
	getElementById, // (id: string) => CanvasElement | undefined
	getElementsByType, // (type: ElementType) => CanvasElement[]
	addElement, // (element) => string
	updateElement, // (id, updates) => void
	removeElement, // (id) => void
	addConnection, // (connection) => string
	removeConnection, // (id) => void
} = useCanvas();
```

### useSelection

Access selection state and methods.

```typescript
const {
	selectedIds, // string[]
	isSelected, // (id: string) => boolean
	select, // (id: string) => void
	selectMultiple, // (ids: string[]) => void
	toggle, // (id: string) => void
	clearSelection, // () => void
	selectAll, // (ids: string[]) => void
} = useSelection();
```

### useViewport

Access viewport (zoom/pan) state and methods.

```typescript
const {
	viewport, // ViewportState
	setZoom, // (zoom: number) => void
	zoomIn, // () => void
	zoomOut, // () => void
	setPan, // (point: Point) => void
	panBy, // (delta: Point) => void
	resetViewport, // () => void
	screenToCanvas, // (point: Point) => Point
	canvasToScreen, // (point: Point) => Point
} = useViewport();
```

### useHistory

Access undo/redo functionality.

```typescript
const {
	canUndo, // boolean
	canRedo, // boolean
	undo, // () => void
	redo, // () => void
} = useHistory();
```

### useTheme

Access theme configuration.

```typescript
const {
	theme, // Theme
	setTheme, // (theme: 'light' | 'dark' | Theme) => void
} = useTheme();
```

### useCanvasActions

Combined actions hook for common operations.

```typescript
const {
	addElement,
	updateElement,
	removeElement,
	removeSelected,
	undo,
	redo,
	canUndo,
	canRedo,
	copy,
	paste,
	cut,
} = useCanvasActions();
```

### useDraggable

Make an element draggable.

```typescript
const { isDragging, handlers } = useDraggable({
  disabled?: boolean;
  onDragStart?: () => void;
  onDrag?: (position: Point, delta: Point) => void;
  onDragEnd?: (position: Point, delta: Point) => void;
});
```

### useResizable

Make an element resizable.

```typescript
const { isResizing, startResize } = useResizable({
  disabled?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResizeStart?: () => void;
  onResize?: (width, height, x, y) => void;
  onResizeEnd?: (width, height, x, y) => void;
});
```

### useSelectable

Make an element selectable.

```typescript
const { isSelected, handlers } = useSelectable({
  id: string;
  disabled?: boolean;
  onSelect?: (selected: boolean) => void;
});
```

### useKeyboard

Register keyboard shortcuts.

```typescript
useKeyboard({
  shortcuts: [
    { key: 's', ctrl: true, action: handleSave },
    { key: 'Delete', action: handleDelete },
  ],
  enabled?: boolean;
  targetRef?: RefObject<HTMLElement>;
});
```

---

## Context Providers

### CombinedCanvasProvider

Combines all providers into one. Used internally by Canvas.

```tsx
<CombinedCanvasProvider
	theme="light"
	initialElements={[]}
	initialConnections={[]}
	maxHistorySize={50}
	onElementsChange={(elements, connections) => {}}
	onSelectionChange={(selectedIds) => {}}
>
	{children}
</CombinedCanvasProvider>
```

### Individual Providers

For fine-grained control:

- `ThemeProvider` - Theme context
- `ViewportProvider` - Zoom/pan context
- `SelectionProvider` - Selection context
- `HistoryProvider` - Undo/redo context
- `CanvasProvider` - Element state context

---

## Utility Functions

### Geometry

```typescript
// Calculate distance between two points
distance(a: Point, b: Point): number

// Check if point is inside bounds
isPointInBounds(point: Point, bounds: Bounds): boolean

// Check if two bounds intersect
boundsIntersect(a: Bounds, b: Bounds): boolean

// Snap point to grid
snapToGrid(point: Point, gridSize: number): Point

// Get resize handles for an element
getResizeHandles(element: CanvasElement): ResizeHandle[]
```

### Layers (Z-Index)

```typescript
// Sort elements by z-index
sortByZIndex(elements: CanvasElement[]): CanvasElement[]

// Bring element to front
bringToFront(elements: CanvasElement[], elementId: string): CanvasElement[]

// Send element to back
sendToBack(elements: CanvasElement[], elementId: string): CanvasElement[]
```

### Serialization

```typescript
// Serialize to JSON string
serializeToJSON(elements: CanvasElement[], connections: Connection[]): string

// Deserialize from JSON string
deserializeFromJSON(json: string): { elements: CanvasElement[]; connections: Connection[] }

// Export canvas to SVG string
exportToSVG(svgElement: SVGSVGElement): string

// Download content as file
downloadAsFile(content: string, filename: string, mimeType: string): void
```

### Other

```typescript
// Generate unique ID
generateId(): string

// Classnames utility (like clsx)
cx(...classes: (string | Record<string, boolean> | undefined)[]): string

// Deep merge objects
deepMerge<T>(target: T, source: Partial<T>): T

// Validate canvas data structure
validateCanvasData(data: unknown): { valid: boolean; errors: string[] }
```

---

## Factory Functions

Create elements with proper defaults:

```typescript
createRectangle(options: Partial<CanvasElement>): CanvasElement
createEllipse(options: Partial<CanvasElement>): CanvasElement
createCircle(options: Partial<CanvasElement>): CanvasElement
createDiamond(options: Partial<CanvasElement>): CanvasElement
createText(options: Partial<TextElement>): TextElement
createLine(options: Partial<LineElement>): LineElement
createActor(options: Partial<ActorElement>): ActorElement
createLifeline(options: Partial<LifelineElement>): LifelineElement
createMessage(options: Partial<MessageElement>): MessageElement
createActivationBar(options: Partial<CanvasElement>): CanvasElement
```

---

## Types

### Theme

```typescript
interface Theme {
	name: string;
	colors: ThemeColors;
	spacing: ThemeSpacing;
	borderRadius: ThemeBorderRadius;
	fontSize: ThemeFontSize;
	strokeWidth: ThemeStrokeWidth;
	shadows: ThemeShadows;
}
```

### CanvasConfig

```typescript
interface CanvasConfig {
	width: number;
	height: number;
	grid?: Partial<GridConfig>;
	readonly?: boolean;
}
```

### ViewportState

```typescript
interface ViewportState {
	zoom: number;
	pan: Point;
	minZoom: number;
	maxZoom: number;
}
```

### GridConfig

```typescript
interface GridConfig {
	enabled: boolean;
	size: number;
	snap: boolean;
	visible: boolean;
	color?: string;
	opacity?: number;
}
```

### Point

```typescript
interface Point {
	x: number;
	y: number;
}
```

### Bounds

```typescript
interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}
```

---

## Events

### CanvasEvent

```typescript
interface CanvasEvent {
	type: "click" | "doubleClick" | "contextMenu";
	position: Point;
	originalEvent: MouseEvent;
}
```

### ElementEvent

```typescript
interface ElementEvent {
	elementId: string;
	element: CanvasElement;
	type: "select" | "deselect" | "update" | "remove";
}
```

### DragEvent

```typescript
interface DragEvent {
	elementId: string;
	startPosition: Point;
	currentPosition: Point;
	delta: Point;
}
```

### ResizeEvent

```typescript
interface ResizeEvent {
	elementId: string;
	handle: ResizeHandle;
	startBounds: Bounds;
	currentBounds: Bounds;
}
```
