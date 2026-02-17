# Examples

Practical examples showing how to use `@jrodrigopuca/canvas`.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Controlled Mode](#controlled-mode)
- [Working with Lines](#working-with-lines)
- [Custom Theme](#custom-theme)
- [Imperative API](#imperative-api)
- [UML Sequence Diagram](#uml-sequence-diagram)
- [Flowchart](#flowchart)
- [Custom Elements](#custom-elements)
- [Export and Import](#export-and-import)
- [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Basic Usage

Simple canvas with default elements (uncontrolled mode).

```tsx
import { Canvas } from "@jrodrigopuca/canvas";

function BasicCanvas() {
	const initialElements = [
		{
			id: "1",
			type: "rectangle",
			x: 50,
			y: 50,
			width: 120,
			height: 80,
			zIndex: 0,
			style: { fill: "#3b82f6", stroke: "#1d4ed8" },
		},
		{
			id: "2",
			type: "ellipse",
			x: 200,
			y: 100,
			width: 100,
			height: 60,
			zIndex: 0,
			style: { fill: "#10b981", stroke: "#059669" },
		},
		{
			id: "3",
			type: "text",
			x: 100,
			y: 180,
			width: 150,
			height: 30,
			zIndex: 1,
			text: "Hello Canvas!",
			fontSize: 16,
			textAlign: "center",
		},
	];

	return (
		<Canvas
			width={800}
			height={500}
			defaultElements={initialElements}
			showGrid
			gridSize={20}
			onChange={(elements, connections) => {
				console.log("Canvas updated:", elements.length, "elements");
			}}
		/>
	);
}
```

---

## Controlled Mode

Full control over canvas state with React state management.

```tsx
import { useState, useCallback } from "react";
import { Canvas, CanvasElement, Connection } from "@jrodrigopuca/canvas";

function ControlledCanvas() {
	const [elements, setElements] = useState<CanvasElement[]>([
		{
			id: "1",
			type: "rectangle",
			x: 100,
			y: 100,
			width: 120,
			height: 80,
			zIndex: 0,
		},
	]);
	const [connections, setConnections] = useState<Connection[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const handleChange = useCallback(
		(newElements: CanvasElement[], newConnections: Connection[]) => {
			setElements(newElements);
			setConnections(newConnections);
			// Sync with backend, etc.
		},
		[],
	);

	const handleSelectionChange = useCallback((ids: string[]) => {
		setSelectedIds(ids);
	}, []);

	const addRectangle = () => {
		const newElement: CanvasElement = {
			id: `rect-${Date.now()}`,
			type: "rectangle",
			x: Math.random() * 400 + 50,
			y: Math.random() * 300 + 50,
			width: 100,
			height: 70,
			zIndex: elements.length,
		};
		setElements([...elements, newElement]);
	};

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<button onClick={addRectangle}>Add Rectangle</button>
				<span style={{ marginLeft: 16 }}>
					Selected: {selectedIds.length} elements
				</span>
			</div>

			<Canvas
				elements={elements}
				connections={connections}
				selectedIds={selectedIds}
				width={800}
				height={500}
				onChange={handleChange}
				onSelectionChange={handleSelectionChange}
			/>
		</div>
	);
}
```

---

## Working with Lines

Lines have special behavior compared to other elements:

- **Endpoint handles**: Lines use endpoint handles instead of 8-point resize
- **Horizontal by default**: Created without explicit points, lines are horizontal
- **Auto-calculated bounds**: x, y, width, height are calculated from points
- **Perpendicular rotation**: Rotation handle follows line direction

### Creating Lines

```tsx
import { Canvas, createLine } from "@jrodrigopuca/canvas";

function LineExamples() {
	const lines = [
		// Horizontal line (default when no points specified)
		createLine({
			id: "horizontal",
			x: 50,
			y: 50,
			width: 200,
			lineType: "solid",
		}),

		// Diagonal line with explicit points
		createLine({
			id: "diagonal",
			points: [
				{ x: 50, y: 150 },
				{ x: 250, y: 250 },
			],
			lineType: "dashed",
		}),

		// Dotted vertical line
		createLine({
			id: "vertical",
			points: [
				{ x: 300, y: 50 },
				{ x: 300, y: 200 },
			],
			lineType: "dotted",
		}),
	];

	return <Canvas width={400} height={300} defaultElements={lines} />;
}
```

### Handling Point Changes

```tsx
import { Canvas, CanvasRef, createLine } from "@jrodrigopuca/canvas";
import { useRef, useState } from "react";

function LineWithPointTracking() {
	const canvasRef = useRef<CanvasRef>(null);
	const [lineInfo, setLineInfo] = useState<string>("");

	const handleChange = (state) => {
		const line = state.elements.find((el) => el.type === "line");
		if (line?.points) {
			const p1 = line.points[0];
			const p2 = line.points[1];
			setLineInfo(
				`Line from (${p1.x.toFixed(0)}, ${p1.y.toFixed(0)}) to (${p2.x.toFixed(0)}, ${p2.y.toFixed(0)})`,
			);
		}
	};

	return (
		<div>
			<Canvas
				ref={canvasRef}
				width={400}
				height={200}
				defaultElements={[
					createLine({
						id: "tracked-line",
						x: 50,
						y: 100,
						width: 200,
					}),
				]}
				onChange={handleChange}
			/>
			<p>{lineInfo}</p>
		</div>
	);
}
```

### Line Rotation

Lines can be rotated using the rotation handle, which is positioned perpendicular to the line direction and moves as the line changes orientation.

```tsx
// Line with initial rotation
createLine({
	id: "rotated-line",
	x: 100,
	y: 100,
	width: 150,
	rotation: 45, // 45 degrees
	style: { stroke: "#ef4444", strokeWidth: 3 },
});
```

**Tip**: Hold **Shift** while rotating to snap to 15° increments.

---

## Custom Theme

Create a custom color theme.

```tsx
import { Canvas, Theme } from "@jrodrigopuca/canvas";

const cyberpunkTheme: Theme = {
	name: "cyberpunk",
	colors: {
		background: "#0a0a0f",
		surface: "#1a1a2e",
		border: "#4a4a6a",
		text: {
			primary: "#ff00ff",
			secondary: "#00ffff",
			disabled: "#666680",
		},
		selection: {
			fill: "rgba(0, 255, 255, 0.1)",
			stroke: "#00ffff",
		},
		element: {
			fill: "#1a1a2e",
			stroke: "#ff00ff",
			hover: "#2a2a4e",
			active: "#3a3a6e",
		},
		handle: {
			fill: "#00ffff",
			stroke: "#ffffff",
		},
		grid: {
			line: "#2a2a4a",
			dot: "#3a3a6a",
		},
		connection: {
			line: "#ff00ff",
			arrow: "#ff00ff",
		},
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
	},
	borderRadius: {
		sm: 2,
		md: 4,
		lg: 8,
	},
	fontSize: {
		xs: 10,
		sm: 12,
		md: 14,
		lg: 18,
		xl: 24,
	},
	strokeWidth: {
		thin: 1,
		normal: 2,
		thick: 3,
	},
	shadows: {
		sm: "0 1px 2px rgba(255, 0, 255, 0.1)",
		md: "0 4px 6px rgba(255, 0, 255, 0.15)",
		lg: "0 10px 15px rgba(255, 0, 255, 0.2)",
		element: "0 2px 4px rgba(255, 0, 255, 0.1)",
		handle: "0 0 4px rgba(0, 255, 255, 0.5)",
	},
};

function ThemedCanvas() {
	return (
		<Canvas
			width={800}
			height={500}
			theme={cyberpunkTheme}
			showGrid
			defaultElements={[
				{
					id: "1",
					type: "diamond",
					x: 200,
					y: 150,
					width: 100,
					height: 100,
					zIndex: 0,
				},
			]}
		/>
	);
}
```

---

## Imperative API

Using ref to control the canvas programmatically.

```tsx
import { useRef, useState } from "react";
import {
	Canvas,
	CanvasRef,
	createRectangle,
	createEllipse,
	createText,
} from "@jrodrigopuca/canvas";

function ImperativeCanvas() {
	const canvasRef = useRef<CanvasRef>(null);
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);

	const addRandomRectangle = () => {
		canvasRef.current?.addElement(
			createRectangle({
				x: Math.random() * 500 + 50,
				y: Math.random() * 300 + 50,
				width: 80 + Math.random() * 60,
				height: 50 + Math.random() * 40,
				style: {
					fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
					stroke: `hsl(${Math.random() * 360}, 70%, 40%)`,
				},
			}),
		);
		updateHistoryState();
	};

	const addEllipse = () => {
		canvasRef.current?.addElement(
			createEllipse({
				x: Math.random() * 500 + 50,
				y: Math.random() * 300 + 50,
				width: 100,
				height: 70,
			}),
		);
		updateHistoryState();
	};

	const addText = () => {
		const id = canvasRef.current?.addElement(
			createText({
				x: Math.random() * 400 + 100,
				y: Math.random() * 300 + 50,
				text: "New Text",
				fontSize: 18,
			}),
		);
		if (id) {
			canvasRef.current?.select(id);
		}
		updateHistoryState();
	};

	const deleteSelected = () => {
		const selectedIds = canvasRef.current?.getSelectedIds() ?? [];
		selectedIds.forEach((id) => canvasRef.current?.removeElement(id));
		updateHistoryState();
	};

	const updateHistoryState = () => {
		setTimeout(() => {
			setCanUndo(canvasRef.current?.canUndo ?? false);
			setCanRedo(canvasRef.current?.canRedo ?? false);
		}, 0);
	};

	const handleUndo = () => {
		canvasRef.current?.undo();
		updateHistoryState();
	};

	const handleRedo = () => {
		canvasRef.current?.redo();
		updateHistoryState();
	};

	const zoomIn = () => canvasRef.current?.zoomIn();
	const zoomOut = () => canvasRef.current?.zoomOut();
	const resetZoom = () => canvasRef.current?.resetViewport();

	const exportJSON = () => {
		const data = canvasRef.current?.toJSON();
		console.log(JSON.stringify(data, null, 2));
		alert("Check console for JSON output");
	};

	const exportSVG = () => {
		const svg = canvasRef.current?.toSVG();
		console.log(svg);
		alert("Check console for SVG output");
	};

	return (
		<div>
			<div
				style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
			>
				<button onClick={addRandomRectangle}>+ Rectangle</button>
				<button onClick={addEllipse}>+ Ellipse</button>
				<button onClick={addText}>+ Text</button>
				<button onClick={deleteSelected}>Delete</button>
				<span style={{ borderLeft: "1px solid #ccc", margin: "0 8px" }} />
				<button onClick={handleUndo} disabled={!canUndo}>
					Undo
				</button>
				<button onClick={handleRedo} disabled={!canRedo}>
					Redo
				</button>
				<span style={{ borderLeft: "1px solid #ccc", margin: "0 8px" }} />
				<button onClick={zoomIn}>Zoom +</button>
				<button onClick={zoomOut}>Zoom -</button>
				<button onClick={resetZoom}>Reset Zoom</button>
				<span style={{ borderLeft: "1px solid #ccc", margin: "0 8px" }} />
				<button onClick={exportJSON}>Export JSON</button>
				<button onClick={exportSVG}>Export SVG</button>
			</div>

			<Canvas
				ref={canvasRef}
				width={800}
				height={500}
				showGrid
				onChange={() => updateHistoryState()}
			/>
		</div>
	);
}
```

---

## UML Sequence Diagram

Building a sequence diagram with UML elements.

```tsx
import {
	Canvas,
	createLifeline,
	createMessage,
	createActivationBar,
} from "@jrodrigopuca/canvas";

function SequenceDiagram() {
	const elements = [
		// Lifelines
		createLifeline({
			id: "client",
			x: 100,
			y: 50,
			width: 100,
			height: 400,
			label: "Client",
		}),
		createLifeline({
			id: "server",
			x: 300,
			y: 50,
			width: 100,
			height: 400,
			label: "Server",
		}),
		createLifeline({
			id: "database",
			x: 500,
			y: 50,
			width: 100,
			height: 400,
			label: "Database",
		}),

		// Messages
		createMessage({
			id: "msg1",
			x: 150,
			y: 120,
			width: 150,
			height: 20,
			label: "request()",
			messageType: "sync",
			fromId: "client",
			toId: "server",
		}),
		createMessage({
			id: "msg2",
			x: 350,
			y: 160,
			width: 150,
			height: 20,
			label: "query()",
			messageType: "sync",
			fromId: "server",
			toId: "database",
		}),
		createMessage({
			id: "msg3",
			x: 350,
			y: 220,
			width: 150,
			height: 20,
			label: "data",
			messageType: "return",
			fromId: "database",
			toId: "server",
		}),
		createMessage({
			id: "msg4",
			x: 150,
			y: 280,
			width: 150,
			height: 20,
			label: "response",
			messageType: "return",
			fromId: "server",
			toId: "client",
		}),

		// Activation bars
		createActivationBar({
			id: "act1",
			x: 345,
			y: 125,
			width: 10,
			height: 170,
		}),
		createActivationBar({
			id: "act2",
			x: 545,
			y: 165,
			width: 10,
			height: 60,
		}),
	];

	return (
		<Canvas
			width={700}
			height={500}
			theme="light"
			defaultElements={elements}
			showGrid={false}
		/>
	);
}
```

---

## Flowchart

Building a simple flowchart.

```tsx
import {
	Canvas,
	createRectangle,
	createDiamond,
	createEllipse,
	createLine,
	createText,
} from "@jrodrigopuca/canvas";

function Flowchart() {
	const elements = [
		// Start (oval)
		createEllipse({
			id: "start",
			x: 200,
			y: 20,
			width: 100,
			height: 50,
			style: { fill: "#10b981", stroke: "#059669" },
		}),
		createText({
			id: "start-text",
			x: 215,
			y: 35,
			width: 70,
			height: 20,
			text: "Start",
			textAlign: "center",
			style: { fill: "white" },
		}),

		// Process 1 (rectangle)
		createRectangle({
			id: "process1",
			x: 175,
			y: 100,
			width: 150,
			height: 60,
			style: { fill: "#3b82f6", stroke: "#1d4ed8" },
		}),
		createText({
			id: "process1-text",
			x: 190,
			y: 120,
			width: 120,
			height: 20,
			text: "Process A",
			textAlign: "center",
			style: { fill: "white" },
		}),

		// Decision (diamond)
		createDiamond({
			id: "decision",
			x: 200,
			y: 200,
			width: 100,
			height: 80,
			style: { fill: "#f59e0b", stroke: "#d97706" },
		}),
		createText({
			id: "decision-text",
			x: 215,
			y: 230,
			width: 70,
			height: 20,
			text: "OK?",
			textAlign: "center",
		}),

		// Process 2 (rectangle) - Yes branch
		createRectangle({
			id: "process2",
			x: 350,
			y: 210,
			width: 120,
			height: 60,
			style: { fill: "#3b82f6", stroke: "#1d4ed8" },
		}),
		createText({
			id: "process2-text",
			x: 365,
			y: 230,
			width: 90,
			height: 20,
			text: "Process B",
			textAlign: "center",
			style: { fill: "white" },
		}),

		// End (oval)
		createEllipse({
			id: "end",
			x: 200,
			y: 320,
			width: 100,
			height: 50,
			style: { fill: "#ef4444", stroke: "#dc2626" },
		}),
		createText({
			id: "end-text",
			x: 220,
			y: 335,
			width: 60,
			height: 20,
			text: "End",
			textAlign: "center",
			style: { fill: "white" },
		}),

		// Connecting lines (points auto-normalize, x/y calculated from bounding box)
		createLine({
			id: "line1",
			points: [
				{ x: 250, y: 70 },
				{ x: 250, y: 100 },
			],
		}),
		createLine({
			id: "line2",
			points: [
				{ x: 250, y: 160 },
				{ x: 250, y: 200 },
			],
		}),
		createLine({
			id: "line3",
			points: [
				{ x: 300, y: 240 },
				{ x: 350, y: 240 },
			],
		}),
		createLine({
			id: "line4",
			points: [
				{ x: 250, y: 280 },
				{ x: 250, y: 320 },
			],
		}),
	];

	return (
		<Canvas
			width={600}
			height={400}
			theme="light"
			defaultElements={elements}
			showGrid
			gridSize={10}
		/>
	);
}
```

---

## Custom Elements

Creating your own element using `withElementBehavior`.

```tsx
import {
	withElementBehavior,
	ElementRenderProps,
	CanvasElement,
	Canvas,
} from "@jrodrigopuca/canvas";

// Custom star shape
interface StarProps extends ElementRenderProps {}

const StarRender: React.FC<StarProps> = ({ element, isSelected }) => {
	const { width, height, style } = element;
	const cx = width / 2;
	const cy = height / 2;
	const outerRadius = Math.min(width, height) / 2;
	const innerRadius = outerRadius * 0.4;
	const points = 5;

	// Generate star points
	const starPoints = Array.from({ length: points * 2 }, (_, i) => {
		const radius = i % 2 === 0 ? outerRadius : innerRadius;
		const angle = (Math.PI / points) * i - Math.PI / 2;
		return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
	}).join(" ");

	return (
		<polygon
			points={starPoints}
			fill={style?.fill ?? "#fbbf24"}
			stroke={style?.stroke ?? "#d97706"}
			strokeWidth={style?.strokeWidth ?? 2}
			opacity={style?.opacity ?? 1}
		/>
	);
};

const Star = withElementBehavior(StarRender);

// Custom hexagon shape
const HexagonRender: React.FC<ElementRenderProps> = ({ element }) => {
	const { width, height, style } = element;
	const cx = width / 2;
	const cy = height / 2;
	const radius = Math.min(width, height) / 2;

	const hexPoints = Array.from({ length: 6 }, (_, i) => {
		const angle = (Math.PI / 3) * i - Math.PI / 2;
		return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
	}).join(" ");

	return (
		<polygon
			points={hexPoints}
			fill={style?.fill ?? "#8b5cf6"}
			stroke={style?.stroke ?? "#6d28d9"}
			strokeWidth={style?.strokeWidth ?? 2}
		/>
	);
};

const Hexagon = withElementBehavior(HexagonRender);

// Using custom elements
function CustomElementsDemo() {
	const elements: CanvasElement[] = [
		{
			id: "star1",
			type: "custom",
			x: 100,
			y: 100,
			width: 80,
			height: 80,
			zIndex: 0,
			style: { fill: "#fbbf24", stroke: "#d97706" },
		},
		{
			id: "hex1",
			type: "custom",
			x: 250,
			y: 100,
			width: 90,
			height: 90,
			zIndex: 0,
			style: { fill: "#8b5cf6", stroke: "#6d28d9" },
		},
	];

	// Note: To use custom elements, you'd need to register them
	// or render them manually. This example shows the pattern.
	return <Canvas width={500} height={300} defaultElements={elements} />;
}
```

---

## Export and Import

Save and load canvas state.

```tsx
import { useRef, useState } from "react";
import {
	Canvas,
	CanvasRef,
	serializeToJSON,
	deserializeFromJSON,
	downloadAsFile,
} from "@jrodrigopuca/canvas";

function ExportImportDemo() {
	const canvasRef = useRef<CanvasRef>(null);
	const [savedState, setSavedState] = useState<string | null>(null);

	const handleSaveToJSON = () => {
		const data = canvasRef.current?.toJSON();
		if (data) {
			const json = serializeToJSON(data.elements, data.connections);
			setSavedState(json);
			console.log("Saved:", json);
		}
	};

	const handleLoadFromJSON = () => {
		if (savedState) {
			const { elements, connections } = deserializeFromJSON(savedState);
			// In controlled mode, you'd setElements(elements)
			console.log("Loaded:", elements.length, "elements");
		}
	};

	const handleDownloadJSON = () => {
		const data = canvasRef.current?.toJSON();
		if (data) {
			const json = serializeToJSON(data.elements, data.connections);
			downloadAsFile(json, "canvas-export.json", "application/json");
		}
	};

	const handleDownloadSVG = () => {
		const svg = canvasRef.current?.toSVG();
		if (svg) {
			downloadAsFile(svg, "canvas-export.svg", "image/svg+xml");
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const json = event.target?.result as string;
				try {
					const { elements, connections } = deserializeFromJSON(json);
					console.log("Imported:", elements.length, "elements");
					// Load into canvas...
				} catch (error) {
					console.error("Invalid JSON:", error);
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
				<button onClick={handleSaveToJSON}>Save State</button>
				<button onClick={handleLoadFromJSON} disabled={!savedState}>
					Load State
				</button>
				<button onClick={handleDownloadJSON}>Download JSON</button>
				<button onClick={handleDownloadSVG}>Download SVG</button>
				<label>
					Import:
					<input type="file" accept=".json" onChange={handleFileUpload} />
				</label>
			</div>

			<Canvas
				ref={canvasRef}
				width={800}
				height={500}
				defaultElements={[
					{
						id: "1",
						type: "rectangle",
						x: 100,
						y: 100,
						width: 150,
						height: 100,
						zIndex: 0,
					},
				]}
			/>

			{savedState && (
				<pre style={{ marginTop: 16, padding: 8, background: "#f4f4f4" }}>
					{savedState.slice(0, 200)}...
				</pre>
			)}
		</div>
	);
}
```

---

## Keyboard Shortcuts

Customizing keyboard shortcuts.

```tsx
import { Canvas, useKeyboard } from "@jrodrigopuca/canvas";

function KeyboardShortcutsDemo() {
	// Custom shortcuts (outside Canvas)
	useKeyboard({
		shortcuts: [
			{
				key: "s",
				ctrl: true,
				action: () => {
					console.log("Save triggered!");
					// Save to server...
				},
				preventDefault: true,
			},
			{
				key: "n",
				ctrl: true,
				action: () => {
					console.log("New document");
					// Reset canvas...
				},
				preventDefault: true,
			},
		],
		enabled: true,
	});

	return (
		<div>
			<p>
				<strong>Shortcuts:</strong>
			</p>
			<ul>
				<li>Ctrl+S - Save</li>
				<li>Ctrl+N - New</li>
				<li>Ctrl+Z - Undo (built-in)</li>
				<li>Ctrl+Shift+Z - Redo (built-in)</li>
				<li>Delete - Remove selected (built-in)</li>
			</ul>

			<Canvas
				width={800}
				height={500}
				enableKeyboardShortcuts={true}
				defaultElements={[
					{
						id: "1",
						type: "rectangle",
						x: 200,
						y: 150,
						width: 120,
						height: 80,
						zIndex: 0,
					},
				]}
			/>
		</div>
	);
}
```

---

## Integration Examples

### With React Context (Global State)

```tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { Canvas, CanvasElement, Connection } from "@jrodrigopuca/canvas";

interface DiagramContextType {
	elements: CanvasElement[];
	connections: Connection[];
	setElements: (elements: CanvasElement[]) => void;
	setConnections: (connections: Connection[]) => void;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

export function DiagramProvider({ children }: { children: ReactNode }) {
	const [elements, setElements] = useState<CanvasElement[]>([]);
	const [connections, setConnections] = useState<Connection[]>([]);

	return (
		<DiagramContext.Provider
			value={{ elements, connections, setElements, setConnections }}
		>
			{children}
		</DiagramContext.Provider>
	);
}

export function useDiagram() {
	const context = useContext(DiagramContext);
	if (!context)
		throw new Error("useDiagram must be used within DiagramProvider");
	return context;
}

// Usage
function DiagramEditor() {
	const { elements, connections, setElements, setConnections } = useDiagram();

	return (
		<Canvas
			elements={elements}
			connections={connections}
			onChange={(newElements, newConnections) => {
				setElements(newElements);
				setConnections(newConnections);
			}}
		/>
	);
}
```

### With Zustand

```tsx
import { create } from "zustand";
import { Canvas, CanvasElement, Connection } from "@jrodrigopuca/canvas";

interface DiagramStore {
	elements: CanvasElement[];
	connections: Connection[];
	setElements: (elements: CanvasElement[]) => void;
	setConnections: (connections: Connection[]) => void;
	addElement: (element: CanvasElement) => void;
}

const useDiagramStore = create<DiagramStore>((set) => ({
	elements: [],
	connections: [],
	setElements: (elements) => set({ elements }),
	setConnections: (connections) => set({ connections }),
	addElement: (element) =>
		set((state) => ({ elements: [...state.elements, element] })),
}));

function ZustandCanvas() {
	const { elements, connections, setElements, setConnections } =
		useDiagramStore();

	return (
		<Canvas
			elements={elements}
			connections={connections}
			onChange={(newElements, newConnections) => {
				setElements(newElements);
				setConnections(newConnections);
			}}
		/>
	);
}
```
